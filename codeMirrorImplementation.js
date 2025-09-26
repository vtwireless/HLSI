let editor;

document.addEventListener('DOMContentLoaded', function () {
  const editorContainer = document.getElementById("editorContainer");
  const editorInner = document.getElementById("editorInner"); // Make sure this exists in your HTML

  // --- Create a flex row for the buttons ---
  const buttonRow = document.createElement("div");
  buttonRow.style.display = "flex";
  buttonRow.style.gap = "1em";
  buttonRow.style.marginBottom = "0.5em";

  // --- Hide/Show CodeMirror button ---
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Hide CodeMirror";
  toggleBtn.onclick = function () {
    if (editorInner.style.display !== "none") {
      editorInner.style.display = "none";
      toggleBtn.textContent = "Show CodeMirror";
    } else {
      editorInner.style.display = "";
      toggleBtn.textContent = "Hide CodeMirror";
    }
  };

  // --- Apply Antenna Transforms button ---
  const applyBtn = document.createElement("button");
  applyBtn.textContent = "Apply Antenna Transforms";
  applyBtn.onclick = applyAntennaTransforms;

  // --- Add both buttons to the row ---
  buttonRow.appendChild(toggleBtn);
  buttonRow.appendChild(applyBtn);

  // --- Insert the button row as the first child of editorContainer ---
  editorContainer.insertBefore(buttonRow, editorContainer.firstChild);

  // --- Create the CodeMirror editor ---
  editor = CodeMirror.fromTextArea(document.getElementById('antennaEditor'), {
    lineNumbers: true,
    theme: "blackboard",
    mode: { name: "application/json", globalVars: true }
  });
  // Move the CodeMirror DOM node into editorInner (replacing the textarea)
  editorInner.appendChild(editor.getWrapperElement());

  // Read initial slider values for RX OG
  const rx_translation = [
    Number(document.getElementById('sliderForMoveX').value),
    Number(document.getElementById('sliderForMoveZ').value),
    Number(document.getElementById('sliderForMoveY').value)
  ];
  const rx_rotation = {
    azimuth: Number(document.getElementById('sliderForRotateY').value),
    elevation: Number(document.getElementById('sliderForRotateX').value),
    boresight: Number(document.getElementById('sliderForTiltZ').value)
  };

  // Read initial slider values for TX OG
  const tx_translation = [
    Number(document.getElementById('slider2ForMoveX').value),
    Number(document.getElementById('slider2ForZupward').value),
    Number(document.getElementById('slider2ForMoveY').value)
  ];
  const tx_rotation = {
    azimuth: Number(document.getElementById('slider2ForRotateY').value),
    elevation: Number(document.getElementById('slider2ForRotateX').value),
    boresight: Number(document.getElementById('slider2ForTiltZ').value)
  };

  // Set the default JSON in the editor, translation arrays on one line
  editor.setValue(JSON.stringify({
    tx_og: {
      translation: tx_translation,
      rotation: tx_rotation
    },
    rx_og: {
      translation: rx_translation,
      rotation: rx_rotation
    }
  }, null, 2).replace(/"translation": \[\s*([\d\.,\s-]+)\s*\]/g, function(match, p1) {
    return `"translation": [${p1.trim().replace(/\s+/g, ' ')}]`;
  }));
});

function applyAntennaTransforms() {
  let config;
  try {
    config = JSON.parse(editor.getValue());
  } catch (e) {
    alert("Error: Invalid JSON in the editor.");
    return;
  }

  // TX OG
  if (config.tx_og) {
    // Translation sliders (TX OG)
    if (Array.isArray(config.tx_og.translation)) {
      document.getElementById('slider2ForMoveX').value = config.tx_og.translation[0];
      document.getElementById('slider2ForZupward').value = config.tx_og.translation[1];
      document.getElementById('slider2ForMoveY').value = config.tx_og.translation[2];
      document.getElementById('slider2ForMoveX').dispatchEvent(new Event('input'));
      document.getElementById('slider2ForZupward').dispatchEvent(new Event('input'));
      document.getElementById('slider2ForMoveY').dispatchEvent(new Event('input'));
    }
    // Rotation sliders (TX OG)
    if (config.tx_og.rotation) {
      document.getElementById('slider2ForRotateY').value = config.tx_og.rotation.azimuth ?? 0;
      document.getElementById('slider2ForRotateX').value = config.tx_og.rotation.elevation ?? 0;
      document.getElementById('slider2ForTiltZ').value = config.tx_og.rotation.boresight ?? 0;
      document.getElementById('slider2ForRotateY').dispatchEvent(new Event('input'));
      document.getElementById('slider2ForRotateX').dispatchEvent(new Event('input'));
      document.getElementById('slider2ForTiltZ').dispatchEvent(new Event('input'));
    }
  }

  // RX OG
  if (config.rx_og) {
    // Translation sliders (RX OG)
    if (Array.isArray(config.rx_og.translation)) {
      document.getElementById('sliderForMoveX').value = config.rx_og.translation[0];
      document.getElementById('sliderForMoveZ').value = config.rx_og.translation[1];
      document.getElementById('sliderForMoveY').value = config.rx_og.translation[2];
      document.getElementById('sliderForMoveX').dispatchEvent(new Event('input'));
      document.getElementById('sliderForMoveZ').dispatchEvent(new Event('input'));
      document.getElementById('sliderForMoveY').dispatchEvent(new Event('input'));
    }
    // Rotation sliders (RX OG)
    if (config.rx_og.rotation) {
      document.getElementById('sliderForRotateY').value = config.rx_og.rotation.azimuth ?? 0;
      document.getElementById('sliderForRotateX').value = config.rx_og.rotation.elevation ?? 0;
      document.getElementById('sliderForTiltZ').value = config.rx_og.rotation.boresight ?? 0;
      document.getElementById('sliderForRotateY').dispatchEvent(new Event('input'));
      document.getElementById('sliderForRotateX').dispatchEvent(new Event('input'));
      document.getElementById('sliderForTiltZ').dispatchEvent(new Event('input'));
    }
  }
}