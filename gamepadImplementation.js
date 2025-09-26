(function () {
  let gamepadIndex = null;
  //const moveSpeed = 0.1; // Adjust for translation sensitivity
  //const zSpeed = 0.1;    // Z movement sensitivity
  const rotateSpeed = 2; // Degrees per frame

  
  let highlightMode = 'param'; // 'param' or 'type'
let lastR1State = false;
let gamepadActive = false; // Track if a gamepad is connected

// couldn't get the features below to work yet
let patternDropdownOpen = false;
let patternDropdownIndex = 0;
let patternDropdownOptions = [];
// couldnt' get the features above to work yet

let lastAState = false;
let lastBState = false;
let lastXState = false;
let lastYState = false;


function clearAllHighlights() {
  // Remove param highlights
  [
    'freq1', 'bw1', 'gn1', 'mcs1',
    'freq2', 'bw2', 'gn2', 'mcs2',
    'freq3', 'bw3', 'gn3', 'mcs3',
    'freq4', 'bw4', 'gn4', 'mcs4'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('param-active');
  });
  // Remove antenna control highlights
  [
    'sliderForMoveX', 'sliderForMoveY', 'sliderForMoveZ',
    'sliderForRotateX', 'sliderForRotateY',
    'slider2ForMoveX', 'slider2ForMoveY', 'slider2ForZupward',
    'slider2ForRotateX', 'slider2ForRotateY',
    'slider3ForMoveX', 'slider3ForMoveY', 'slider4ForZupward',
    'slider3ForRotateX', 'slider3ForRotateY',
    'slider4ForMoveX', 'slider4ForMoveY', 'slider3ForZupward',
    'slider4ForRotateX', 'slider4ForRotateY'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('antenna-active');
  });
  // Remove pattern highlights
  ['tx_pattern', 'antenna_pattern', 'tx2_pattern', 'rx2_pattern'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('pattern-highlight');
  });
}


function highlightPatternSelect(antennaType) {
  // Remove highlight from all pattern selects
    if (!gamepadActive) return;

  ['tx_pattern', 'antenna_pattern', 'tx2_pattern', 'rx2_pattern'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('pattern-highlight');
  });

  if (highlightMode !== 'type') return; // Only highlight if in type mode

  // Add highlight to the current one
  let id = '';
  switch (antennaType) {
    case 'og_tx': id = 'tx_pattern'; break;
    case 'og_rx': id = 'antenna_pattern'; break;
    case 'new_tx': id = 'tx2_pattern'; break;
    case 'new_rx': id = 'rx2_pattern'; break;
  }
  const el = document.getElementById(id);
  if (el) el.classList.add('pattern-highlight');
}


if (highlightMode === 'type' && dropdown) {
  if (gp.buttons[2]?.pressed && !lastXState) { // X button
    // Move to next option
    let nextIndex = (dropdown.selectedIndex + 1) % dropdown.options.length;
    dropdown.selectedIndex = nextIndex;
    dropdown.dispatchEvent(new Event('change'));
  }
  lastXState = gp.buttons[2]?.pressed;
}


function pollGamepads() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  if (gamepadIndex !== null && gamepads[gamepadIndex]) {
    const gp = gamepads[gamepadIndex];

    const r1Pressed = gp.buttons[5]?.pressed; // R1 is usually button 5
    if (r1Pressed && !lastR1State) {
      highlightMode = (highlightMode === 'param') ? 'type' : 'param';
      updateAntennaVisual();
      highlightPatternSelect(controlledAntenna);
      highlightAntennaParams();
      patternDropdownOpen = false; // Always close dropdown when switching modes
    }
    lastR1State = r1Pressed;

    handleToggle(gp);

    // --- Pattern selection controls (when in 'type' mode) ---
    if (highlightMode === 'type') {
      // Determine dropdown and checkbox IDs for the current antenna
      let dropdownId = '';
      let horizId = '';
      let vertId = '';
       switch (controlledAntenna) {
        case 'og_rx':
          dropdownId = 'antenna_pattern';
          horizId = 'horizontal_rx';
          vertId = 'vertical_rx';
          break;
        case 'og_tx':
          dropdownId = 'tx_pattern';
          horizId = 'horizontal_tx';
          vertId = 'vertical_tx';
          break;
        case 'new_rx':
          dropdownId = 'rx2_pattern';
          horizId = 'horizontal_rx2';
          vertId = 'vertical_rx2';
          break;
        case 'new_tx':
          dropdownId = 'tx2_pattern';
          horizId = 'horizontal_tx2';
          vertId = 'vertical_tx2';
          break;
      }
      const dropdown = document.getElementById(dropdownId);

      // --- A/B toggle checkboxes when NOT in dropdown navigation ---
      if (!patternDropdownOpen) {
        // A button (button 0) toggles horizontal
        if (gp.buttons[0]?.pressed && !lastAState) {
          const horiz = document.getElementById(horizId);
          if (horiz) {
            horiz.checked = !horiz.checked;
            horiz.dispatchEvent(new Event('change'));
          }
        }
        lastAState = gp.buttons[0]?.pressed;

        // B button (button 1) toggles vertical
        if (gp.buttons[1]?.pressed && !lastBState) {
          const vert = document.getElementById(vertId);
          if (vert) {
            vert.checked = !vert.checked;
            vert.dispatchEvent(new Event('change'));
          }
        }
        lastBState = gp.buttons[1]?.pressed;
      }

      if (dropdown) {
        // Get dropdown options as array
        patternDropdownOptions = Array.from(dropdown.options);

        // If dropdown is open, handle navigation and selection
        if (patternDropdownOpen) {
          // D-pad navigation
          if (gp.buttons[12]?.pressed && patternDropdownIndex > 0) { // up
            patternDropdownIndex--;
            while (patternDropdownIndex > 0 && patternDropdownOptions[patternDropdownIndex].disabled) {
              patternDropdownIndex--;
            }
          }
          if (gp.buttons[13]?.pressed && patternDropdownIndex < patternDropdownOptions.length - 1) { // down
            patternDropdownIndex++;
            while (patternDropdownIndex < patternDropdownOptions.length - 1 && patternDropdownOptions[patternDropdownIndex].disabled) {
              patternDropdownIndex++;
            }
          }

          // Highlight the currently selected option
          patternDropdownOptions.forEach((opt, idx) => {
            if (idx === patternDropdownIndex) {
              opt.classList.add('pattern-dropdown-highlight');
            } else {
              opt.classList.remove('pattern-dropdown-highlight');
            }
          });

          // X to select
          if (gp.buttons[2]?.pressed && !lastXState) { // X
            dropdown.selectedIndex = patternDropdownIndex;
            dropdown.dispatchEvent(new Event('change'));
            patternDropdownOpen = false;
            // Remove highlights
            patternDropdownOptions.forEach(opt => opt.classList.remove('pattern-dropdown-highlight'));
          }
          lastXState = gp.buttons[2]?.pressed;

          // Y to cancel/close
          if (gp.buttons[3]?.pressed && !lastYState) { // Y
            patternDropdownOpen = false;
            patternDropdownOptions.forEach(opt => opt.classList.remove('pattern-dropdown-highlight'));
          }
          lastYState = gp.buttons[3]?.pressed;

          requestAnimationFrame(pollGamepads);
          return; // Don't process other controls while dropdown is open
        }

        // If dropdown is not open, X opens it when pattern select is highlighted
        if (gp.buttons[2]?.pressed && !lastXState) { // X
          patternDropdownOpen = true;
          patternDropdownIndex = dropdown.selectedIndex || 0;
        }
        lastXState = gp.buttons[2]?.pressed;
      }

      // Always highlight the pattern select in type mode
      highlightPatternSelect(controlledAntenna);
      requestAnimationFrame(pollGamepads);
      return; // Don't process other controls in type mode
    }

    // --- Only allow movement, rotation, and param adjustment if in 'param' mode ---
    if (highlightMode === 'param') {
      // D-pad buttons
      let dpadY = 0;
      if (gp.buttons[12]?.pressed) dpadY += 1; // up
      if (gp.buttons[13]?.pressed) dpadY -= 1; // down
      let dpadX = 0;
      if (gp.buttons[15]?.pressed) dpadX += 1; // right
      if (gp.buttons[14]?.pressed) dpadX -= 1; // left

      // Button mapping: X = 2, Y = 3, B = 1, A = 0 (standard mapping)
      if (gp.buttons[2]?.pressed) { // X
        if (selectedParam !== 'freq') {
          selectedParam = 'freq';
          highlightAntennaParams();
        }
      }
      if (gp.buttons[3]?.pressed) { // Y
        if (selectedParam !== 'bw') {
          selectedParam = 'bw';
          highlightAntennaParams();
        }
      }
      if (gp.buttons[1]?.pressed) { // B
        if (selectedParam !== 'gn') {
          selectedParam = 'gn';
          highlightAntennaParams();
        }
      }
      if (gp.buttons[0]?.pressed) { // A
        if (selectedParam !== 'mcs') {
          selectedParam = 'mcs';
          highlightAntennaParams();
        }
      }

      // Define axes for movement and rotation
      let moveZ = gp.axes[1] || 0; // left stick vertical
      let paramX = gp.axes[0] || 0;  // left stick horizontal (for param adjustment)
      let rotX = gp.axes[2] || 0;    // right stick horizontal (for rotation)
      let rotY = gp.axes[3] || 0;    // right stick vertical (for rotation)
      let tiltZ = gp.axes[0] || 0; // right trigger (Z-axis tilt)

      // --- Parameter adjustment with left stick left/right ---
      if (Math.abs(paramX) > 0.3) { // Add a deadzone
  let paramId = '';
  switch (controlledAntenna) {
    case 'og_rx': paramId = selectedParam + '1'; break;
    case 'og_tx': paramId = selectedParam + '2'; break;
    case 'new_tx': paramId = selectedParam + '3'; break;
    case 'new_rx': paramId = selectedParam + '4'; break;
  }
  const slider = document.getElementById(paramId);
  if (slider) {
    let step = Number(slider.step) || 1;
    // Drastically increase step for freq, bw, gn if desired
    if (['freq', 'bw', 'gn'].includes(selectedParam)) {
      step *= 20; // Or higher for faster movement
    }
    let direction = paramX > 0 ? 1 : -1;
    // Update every frame while stick is held
    let newValue = Number(slider.value) + direction * step;
    newValue = Math.max(Number(slider.min), Math.min(Number(slider.max), newValue));
    slider.value = newValue;
    slider.dispatchEvent(new Event('input'));
  }
} else {
        // Reset debounce when stick is released
        let paramId = '';
        switch (controlledAntenna) {
          case 'og_rx': paramId = selectedParam + '1'; break;
          case 'og_tx': paramId = selectedParam + '2'; break;
          case 'new_tx': paramId = selectedParam + '3'; break;
          case 'new_rx': paramId = selectedParam + '4'; break;
        }
        const slider = document.getElementById(paramId);
        if (slider) slider._lastDirection = 0;
      }

      // --- Antenna movement/rotation ---
      switch (controlledAntenna) {
        case 'og_rx':
          updateAntennaOG(moveZ, dpadY, dpadX);
          updateRotationOG(rotX, rotY, tiltZ);
          break;
        case 'og_tx':
          updateAntennaTX(moveZ, dpadY, dpadX);
          updateRotationTX(rotX, rotY, tiltZ);
          break;
        case 'new_rx':
          updateAntennaNewRX(moveZ, dpadY, dpadX);
          updateRotationNewRX(rotX, rotY, tiltZ);
          break;
        case 'new_tx':
          updateAntennaNewTX(moveZ, dpadY, dpadX);
          updateRotationNewTX(rotX, rotY, tiltZ);
          break;
      }
    }

    highlightPatternSelect(controlledAntenna);
    requestAnimationFrame(pollGamepads);
  }
}

window.addEventListener('DOMContentLoaded', function() {
  updateAntennaVisual();
  if (gamepadActive) {
    highlightPatternSelect(controlledAntenna); // Ensure initial highlight
  }
});

  window.addEventListener("gamepadconnected", function (e) {
    gamepadIndex = e.gamepad.index;
    gamepadActive = true; // Set gamepad active
    console.log("Gamepad connected:", e.gamepad.id);
    updateAntennaVisual();
highlightPatternSelect(controlledAntenna);
highlightAntennaParams();
    pollGamepads();
    // Optional: show a visual indicator
    let overlay = document.getElementById('gamepad-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'gamepad-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '100px';
      overlay.style.right = '10px';
      overlay.style.background = 'rgba(0,0,0,0.7)';
      overlay.style.color = '#fff';
      overlay.style.padding = '8px 16px';
      overlay.style.borderRadius = '8px';
      overlay.style.zIndex = 9999;
      overlay.innerText = 'Gamepad Active';
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'block';
  });


function updateAntennaOG(moveZ, dpadY, dpadX) {
  // OG RX: sliderForMoveX, sliderForMoveY, sliderForMoveZ
  const sliderX = document.getElementById('sliderForMoveX');
  const sliderY = document.getElementById('sliderForMoveY');
  const sliderZ = document.getElementById('sliderForMoveZ');
  if (sliderX && sliderY && sliderZ &&
      (dpadX !== 0 || dpadY !== 0 || Math.abs(moveZ) > 0.15)) {
    let moveSpeed = 1, zSpeed = 1;
    let newX = Math.max(Number(sliderX.min), Math.min(Number(sliderX.max), Number(sliderX.value) + dpadX * moveSpeed));
    let newY = Math.max(Number(sliderY.min), Math.min(Number(sliderY.max), Number(sliderY.value) + dpadY * moveSpeed));
    let newZ = Math.max(Number(sliderZ.min), Math.min(Number(sliderZ.max), Number(sliderZ.value) + moveZ * zSpeed));
    sliderX.value = newX;
    sliderY.value = newY;
    sliderZ.value = newZ;
    sliderX.dispatchEvent(new Event('input'));
    sliderY.dispatchEvent(new Event('input'));
    sliderZ.dispatchEvent(new Event('input'));
  }
}

function updateAntennaTX(moveZ, dpadY, dpadX) {
  // OG TX: slider2ForMoveX, slider2ForMoveY, slider2ForZupward
  const sliderX = document.getElementById('slider2ForMoveX');
  const sliderY = document.getElementById('slider2ForMoveY');
  const sliderZ = document.getElementById('slider2ForZupward');
  if (sliderX && sliderY && sliderZ &&
      (dpadX !== 0 || dpadY !== 0 || Math.abs(moveZ) > 0.15)) {
    let moveSpeed = 1, zSpeed = 1;
    let newX = Math.max(Number(sliderX.min), Math.min(Number(sliderX.max), Number(sliderX.value) + dpadX * moveSpeed));
    let newY = Math.max(Number(sliderY.min), Math.min(Number(sliderY.max), Number(sliderY.value) + dpadY * moveSpeed));
    let newZ = Math.max(Number(sliderZ.min), Math.min(Number(sliderZ.max), Number(sliderZ.value) + moveZ * zSpeed));
    sliderX.value = newX;
    sliderY.value = newY;
    sliderZ.value = newZ;
    sliderX.dispatchEvent(new Event('input'));
    sliderY.dispatchEvent(new Event('input'));
    sliderZ.dispatchEvent(new Event('input'));
  }
}

function updateAntennaNewRX(moveZ, dpadY, dpadX) {
  // New RX: slider3ForMoveX, slider3ForMoveY, slider4ForZupward
  const sliderX = document.getElementById('slider3ForMoveX');
  const sliderY = document.getElementById('slider3ForMoveY');
  const sliderZ = document.getElementById('slider4ForZupward');
  if (sliderX && sliderY && sliderZ &&
      (dpadX !== 0 || dpadY !== 0 || Math.abs(moveZ) > 0.15)) {
    let moveSpeed = 1, zSpeed = 1;
    let newX = Math.max(Number(sliderX.min), Math.min(Number(sliderX.max), Number(sliderX.value) + dpadX * moveSpeed));
    let newY = Math.max(Number(sliderY.min), Math.min(Number(sliderY.max), Number(sliderY.value) + dpadY * moveSpeed));
    let newZ = Math.max(Number(sliderZ.min), Math.min(Number(sliderZ.max), Number(sliderZ.value) + moveZ * zSpeed));
    sliderX.value = newX;
    sliderY.value = newY;
    sliderZ.value = newZ;
    sliderX.dispatchEvent(new Event('input'));
    sliderY.dispatchEvent(new Event('input'));
    sliderZ.dispatchEvent(new Event('input'));
  }
}

function updateAntennaNewTX(moveZ, dpadY, dpadX) {
  // New TX: slider4ForMoveX, slider4ForMoveY, slider3ForZupward
  const sliderX = document.getElementById('slider4ForMoveX');
  const sliderY = document.getElementById('slider4ForMoveY');
  const sliderZ = document.getElementById('slider3ForZupward');
  if (sliderX && sliderY && sliderZ &&
      (dpadX !== 0 || dpadY !== 0 || Math.abs(moveZ) > 0.15)) {
    let moveSpeed = 1, zSpeed = 1;
    let newX = Math.max(Number(sliderX.min), Math.min(Number(sliderX.max), Number(sliderX.value) + dpadX * moveSpeed));
    let newY = Math.max(Number(sliderY.min), Math.min(Number(sliderY.max), Number(sliderY.value) + dpadY * moveSpeed));
    let newZ = Math.max(Number(sliderZ.min), Math.min(Number(sliderZ.max), Number(sliderZ.value) + moveZ * zSpeed));
    sliderX.value = newX;
    sliderY.value = newY;
    sliderZ.value = newZ;
    sliderX.dispatchEvent(new Event('input'));
    sliderY.dispatchEvent(new Event('input'));
    sliderZ.dispatchEvent(new Event('input'));
  }
}


  let controlledAntenna = 'og_rx'; 

function getAvailableAntennas() {
  const mode = document.getElementById('mode').value;
  const antennas = [];
  if (mode === 'beginner') {
    antennas.push('og_rx');
  } else {
    antennas.push('og_rx', 'og_tx');
    if (document.getElementById('rx_new_transform')) antennas.push('new_rx');
    if (document.getElementById('tx_new_transform')) antennas.push('new_tx');
  }
  return antennas;
}

let lastR2State = false;

function handleToggle(gamepad) {
  const r2Pressed = gamepad.buttons[7]?.pressed; // R2 is usually button 7
  if (r2Pressed && !lastR2State) {
  const antennas = getAvailableAntennas();
  let idx = antennas.indexOf(controlledAntenna);
  controlledAntenna = antennas[(idx + 1) % antennas.length];
  selectedParam = 'freq'; // Reset to frequency
  highlightMode = 'param'; // Always start on param when switching antennas
  updateAntennaVisual();
  highlightPatternSelect(controlledAntenna);
  highlightAntennaParams();
}
  lastR2State = r2Pressed;
}


function updateRotationOG(rotX, rotY, tiltZ) {
  const sliderX = document.getElementById('sliderForRotateX');
  const sliderY = document.getElementById('sliderForRotateY');
  const sliderZ = document.getElementById('sliderForTiltZ');
  let updated = false;
  if (sliderX && Math.abs(rotY) > 0.1) {
    let rotateSpeed = 2;
    sliderX.value = Math.min(360, Math.max(0, Number(sliderX.value) + rotY * rotateSpeed));
    sliderX.dispatchEvent(new Event('input'));
    updated = true;
  }
  if (sliderY && Math.abs(rotX) > 0.1) {
    let rotateSpeed = 2;
    sliderY.value = Math.min(360, Math.max(0, Number(sliderY.value) + rotX * rotateSpeed));
    sliderY.dispatchEvent(new Event('input'));
    updated = true;
  }
  if (sliderZ && Math.abs(tiltZ) > 0.1) {
    let tiltSpeed = 2;
    sliderZ.value = Math.min(180, Math.max(0, Number(sliderZ.value) + tiltZ * tiltSpeed));
    sliderZ.dispatchEvent(new Event('input'));
    updated = true;
  }
}


function updateRotationTX(rotX, rotY, tiltZ) {
    const sliderX = document.getElementById('slider2ForRotateX');
  const sliderY = document.getElementById('slider2ForRotateY');
  const sliderZ = document.getElementById('slider2ForTiltZ');
  let updated = false;
  if (sliderX && Math.abs(rotY) > 0.1) {
    let rotateSpeed = 2;
    sliderX.value = Math.min(360, Math.max(0, Number(sliderX.value) + rotY * rotateSpeed));
    sliderX.dispatchEvent(new Event('input'));
    updated = true;
  }
  if (sliderY && Math.abs(rotX) > 0.1) {
    let rotateSpeed = 2;
    sliderY.value = Math.min(360, Math.max(0, Number(sliderY.value) + rotX * rotateSpeed));
    sliderY.dispatchEvent(new Event('input'));
    updated = true;
  }
  if (sliderZ && Math.abs(tiltZ) > 0.1) {
    let tiltSpeed = 2;
    sliderZ.value = Math.min(180, Math.max(0, Number(sliderZ.value) + tiltZ * tiltSpeed));
    sliderZ.dispatchEvent(new Event('input'));
    updated = true;
  }
}


function updateRotationNewRX(rotX, rotY, tiltZ) {
   const sliderX = document.getElementById('slider3ForRotateX');
  const sliderY = document.getElementById('slider3ForRotateY');
  const sliderZ = document.getElementById('slider3ForTiltZ');
  let updated = false;
  if (sliderX && Math.abs(rotY) > 0.1) {
    let rotateSpeed = 2;
    sliderX.value = Math.min(360, Math.max(0, Number(sliderX.value) + rotY * rotateSpeed));
    sliderX.dispatchEvent(new Event('input'));
    updated = true;
  }
  if (sliderY && Math.abs(rotX) > 0.1) {
    let rotateSpeed = 2;
    sliderY.value = Math.min(360, Math.max(0, Number(sliderY.value) + rotX * rotateSpeed));
    sliderY.dispatchEvent(new Event('input'));
    updated = true;
  }
  if (sliderZ && Math.abs(tiltZ) > 0.1) {
    let tiltSpeed = 2;
    sliderZ.value = Math.min(180, Math.max(0, Number(sliderZ.value) + tiltZ * tiltSpeed));
    sliderZ.dispatchEvent(new Event('input'));
    updated = true;
  }
}


function updateRotationNewTX(rotX, rotY, tiltZ) {
   const sliderX = document.getElementById('slider4ForRotateX');
  const sliderY = document.getElementById('slider4ForRotateY');
  const sliderZ = document.getElementById('slider4ForTiltZ');
  let updated = false;
  if (sliderX && Math.abs(rotY) > 0.1) {
    let rotateSpeed = 2;
    sliderX.value = Math.min(360, Math.max(0, Number(sliderX.value) + rotY * rotateSpeed));
    sliderX.dispatchEvent(new Event('input'));
    updated = true;
  }
  if (sliderY && Math.abs(rotX) > 0.1) {
    let rotateSpeed = 2;
    sliderY.value = Math.min(360, Math.max(0, Number(sliderY.value) + rotX * rotateSpeed));
    sliderY.dispatchEvent(new Event('input'));
    updated = true;
  }
  if (sliderZ && Math.abs(tiltZ) > 0.1) {
    let tiltSpeed = 2;
    sliderZ.value = Math.min(180, Math.max(0, Number(sliderZ.value) + tiltZ * tiltSpeed));
    sliderZ.dispatchEvent(new Event('input'));
    updated = true;
  }
}



  function highlightAntennaControls() {

      if (!gamepadActive) return;
  // Remove highlight from all possible controls
  const allIds = [
    // OG RX
    'sliderForMoveX', 'sliderForMoveY', 'sliderForMoveZ',
    'sliderForRotateX', 'sliderForRotateY',
    // OG TX
    'slider2ForMoveX', 'slider2ForMoveY', 'slider2ForZupward',
    'slider2ForRotateX', 'slider2ForRotateY',
    // New RX
    'slider3ForMoveX', 'slider3ForMoveY', 'slider4ForZupward',
    'slider3ForRotateX', 'slider3ForRotateY',
    // New TX
    'slider4ForMoveX', 'slider4ForMoveY', 'slider3ForZupward',
    'slider4ForRotateX', 'slider4ForRotateY'
  ];
  allIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('antenna-active');
  });

  // Only highlight if in param mode
  if (highlightMode !== 'param') return;

  // Add highlight to the currently controlled antenna's controls
  let ids = [];
  switch (controlledAntenna) {
    case 'og_rx':
      ids = ['sliderForMoveX', 'sliderForMoveY', 'sliderForMoveZ', 'sliderForRotateX', 'sliderForRotateY'];
      break;
    case 'og_tx':
      ids = ['slider2ForMoveX', 'slider2ForMoveY', 'slider2ForZupward', 'slider2ForRotateX', 'slider2ForRotateY'];
      break;
    case 'new_rx':
      ids = ['slider3ForMoveX', 'slider3ForMoveY', 'slider4ForZupward', 'slider3ForRotateX', 'slider3ForRotateY'];
      break;
    case 'new_tx':
      ids = ['slider4ForMoveX', 'slider4ForMoveY', 'slider3ForZupward', 'slider4ForRotateX', 'slider4ForRotateY'];
      break;
  }
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('antenna-active');
  });
}
function highlightAntennaControls() {
  if (!gamepadActive) return;
  // Remove highlight from all possible controls
  const allIds = [
    // OG RX
    'sliderForMoveX', 'sliderForMoveY', 'sliderForMoveZ',
    'sliderForRotateX', 'sliderForRotateY', 'sliderForTiltZ',
    // OG TX
    'slider2ForMoveX', 'slider2ForMoveY', 'slider2ForZupward',
    'slider2ForRotateX', 'slider2ForRotateY', 'slider2ForTiltZ',
    // New RX
    'slider3ForMoveX', 'slider3ForMoveY', 'slider4ForZupward',
    'slider3ForRotateX', 'slider3ForRotateY', 'slider3ForTiltZ',
    // New TX
    'slider4ForMoveX', 'slider4ForMoveY', 'slider3ForZupward',
    'slider4ForRotateX', 'slider4ForRotateY', 'slider4ForTiltZ'
  ];
  allIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('antenna-active');
  });

  if (highlightMode !== 'param') return;

  let ids = [];
  switch (controlledAntenna) {
    case 'og_rx':
      ids = ['sliderForMoveX', 'sliderForMoveY', 'sliderForMoveZ', 'sliderForRotateX', 'sliderForRotateY', 'sliderForTiltZ'];
      break;
    case 'og_tx':
      ids = ['slider2ForMoveX', 'slider2ForMoveY', 'slider2ForZupward', 'slider2ForRotateX', 'slider2ForRotateY', 'slider2ForTiltZ'];
      break;
    case 'new_rx':
      ids = ['slider3ForMoveX', 'slider3ForMoveY', 'slider4ForZupward', 'slider3ForRotateX', 'slider3ForRotateY', 'slider3ForTiltZ'];
      break;
    case 'new_tx':
      ids = ['slider4ForMoveX', 'slider4ForMoveY', 'slider3ForZupward', 'slider4ForRotateX', 'slider4ForRotateY', 'slider4ForTiltZ'];
      break;
  }
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('antenna-active');
  });
}


function updateAntennaVisual() {
  let overlay = document.getElementById('antenna-control-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'antenna-control-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '60px';
    overlay.style.right = '10px';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.color = '#fff';
    overlay.style.padding = '10px 20px';
    overlay.style.borderRadius = '8px';
    overlay.style.zIndex = 10000;
    document.body.appendChild(overlay);
  }
  let label = '';
  switch (controlledAntenna) {
    case 'og_rx': label = 'OG RX (Blue)'; break;
    case 'og_tx': label = 'OG TX (Red)'; break;
    case 'new_rx': label = 'New RX (Lime)'; break;
    case 'new_tx': label = 'New TX (Orange)'; break;
  }
  overlay.textContent = `Currently controlling: ${label}`;
  if (gamepadActive) {
    highlightAntennaControls();
    highlightAntennaParams();
  }
}


window.addEventListener('DOMContentLoaded', updateAntennaVisual);

window.addEventListener('DOMContentLoaded', function() {
  updateAntennaVisual();
  highlightPatternSelect(controlledAntenna); // Ensure initial highlight
});

  window.addEventListener("gamepaddisconnected", function (e) {
    if (gamepadIndex === e.gamepad.index) {
      gamepadIndex = null;
      gamepadActive = false; // Set gamepad inactive
      clearAllHighlights(); // Clear all highlights
      console.log("Gamepad disconnected:", e.gamepad.id);
      // Hide overlay
      const overlay = document.getElementById('gamepad-overlay');
      if (overlay) overlay.style.display = 'none';
    }
  });


  let selectedParam = 'freq'; // 'freq', 'bw', 'gn', 'mcs'
//const paramOrder = ['freq', 'bw', 'gn', 'mcs'];

function handleToggle(gamepad) {
  const r2Pressed = gamepad.buttons[7]?.pressed;
  if (r2Pressed && !lastR2State) {
    const antennas = getAvailableAntennas();
    let idx = antennas.indexOf(controlledAntenna);
    controlledAntenna = antennas[(idx + 1) % antennas.length];
    selectedParam = 'freq'; // Reset to frequency
    updateAntennaVisual();
    highlightPatternSelect(controlledAntenna);
    highlightAntennaParams(); 
  }
  lastR2State = r2Pressed;
}

function highlightAntennaParams() {

  // Remove highlight from all param sliders
    if (!gamepadActive) return;


  const allParamIds = [
    'freq1', 'bw1', 'gn1', 'mcs1',
    'freq2', 'bw2', 'gn2', 'mcs2',
    'freq3', 'bw3', 'gn3', 'mcs3',
    'freq4', 'bw4', 'gn4', 'mcs4'
  ];
  allParamIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('param-active');
  });

  if (highlightMode !== 'param') return; // Only highlight if in param mode

  // Highlight the selected param for the currently controlled antenna
  let id = '';
  switch (controlledAntenna) {
    case 'og_rx': id = selectedParam + '1'; break;
    case 'og_tx': id = selectedParam + '2'; break;
    case 'new_tx': id = selectedParam + '3'; break;
    case 'new_rx': id = selectedParam + '4'; break;
  }
  const el = document.getElementById(id);
  if (el) el.classList.add('param-active');
}
  


})();