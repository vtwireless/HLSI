/**
 * These functions calculate path loss and received power for a wireless communication system based
 * on antenna patterns and signal characteristics.
 *
 * @param {Object} sig - Represents the signal being transmitted, containing properties such as frequency and gain.
 * @param {number} theta - The elevation angle in spherical coordinates, representing the angle from the positive z-axis.
 * @param {number} phi - The azimuth angle in spherical coordinates, representing the angle in the xy-plane measured from the positive x-axis.
 * @param {number} distance - The distance from the receiver antenna to the transmitter, typically measured in meters. This is an essential parameter for calculating path loss.
 * @param {Function} pattern - The antenna pattern function used for calculating path loss. It describes how the antenna radiates or receives electromagnetic signals in different directions.
 */

"use strict";

/// Classes for the Spatial Mobility Framework

// Base Station
const BaseStation = class {
  // constructor for BaseStation
  constructor(
    position,
    velocity,
    maxAcceleration,
    transmitters,
    receivers,
    txAntennas,
    RxAntennas
  ) {
    this.position = position;
    this.velocity = velocity;
    this.maxAcceleration = maxAcceleration;
    this.transmitters = transmitters;
    this.receivers = receivers;
    this.txAntennas = txAntennas;
    this.RxAntennas = RxAntennas;
  }

  // Getters
  get getPosition() {
    return this.position;
  }

  // Setters
  set setPosition(position) {
    this.position = position;
  }

  // Instance methods
};

// Transmitter
const Transmitter = (Base) =>
  class extends BaseStation {
    // constructor for Transmitter
    constructor(signal) {
      this.signal = signal;
    }

    // Getters
    get getSignal() {
      return this.signal;
    }

    // Setters
    set setSignal(signal) {
      this.signal = signal;
    }

    // Instance methods
  };

// Receiver
const Receiver = (Base) =>
  class extends BaseStation {
    // constructor for Receiver
    /**
     * @param {Signal} signal -- Signal of Interest
     * @param {} signals -- List of all signals including interferers
     */
    constructor(signal, preSelectorFilter, iip3, fc_Rx, signals = []) {
      this.signal = signal;
    }

    // Getters
    get getSignal() {
      return this.signal;
    }

    // Setters
    set setSignal(signal) {
      this.signal = signal;
    }

    // Instance methods
  };

// Antenna
const Antenna = class {
  // constructor for Antenna
  constructor(gain, pointingAngle) {
    this.gain = gain;
    this.pointingAngle = pointingAngle;
  }

  // Getters
  get getGain() {
    return this.gain;
  }

  // Setters
  set setGain(gain) {
    this.position = gain;
  }

  // Instance methods
};

// Position of an object in 3D space (x, y, z)
const Position = class {
  // constructor for Position
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
};

class RadioAirspace {
  constructor() {
    this.transmitters = [];      // Array to hold signal objects
    this.txPositions = [];      // Array to hold antenna position objects
    this.receivers = [];     // Array to hold antenna position objects
    this.rxPositions = [];     // Array to hold antenna position objects
  }

  addTransmitter() {
    var sigBase = Signal(JSON.parse(JSON.stringify(conf.signal_multi)), '', {
        // bw_max: 38.0e6, // Hz //this was 38 Hz, we needed to change this to 100
        bw_max: 4.0e7,
        // bw_min: 4.0e6,  // Hz //this was 4 Hz, we needed to change this to -10
        bw_min: 0,
        bw_init: 4.0e6, // Hz
        gn_init: -10, // dB
        gn_min: -10, // dB
        gn_max: 90,
        mcs_init: 6, // array index int
        freq_init: 1785.0e6
      });
    sigBase.name = "Transmitter " + (this.transmitters.length + 1);
    this.transmitters.push(sigBase);
    
    // get antenna posistion 
    let str = `tx_transform_${this.transmitters.length}`; // "signal_1"
    // console.log("!!!!! rx transform name:", str);
    let pos = getCoordinatesFromX3D(str);
    this.txPositions.push(pos);
  }

  addReceiver() {
    var sigBase = Signal(JSON.parse(JSON.stringify(conf.signal_multi)), '', {
        // bw_max: 38.0e6, // Hz //this was 38 Hz, we needed to change this to 100
        bw_max: 4.0e7,
        // bw_min: 4.0e6,  // Hz //this was 4 Hz, we needed to change this to -10
        bw_min: 0,
        bw_init: 4.0e6, // Hz
        gn_init: -10, // dB
        gn_min: -10, // dB
        gn_max: 90,
        mcs_init: 6, // array index int
        freq_init: 1785.0e6
      });
    sigBase.name = "Receiver " + (this.receivers.length + 1);
    this.receivers.push(sigBase);
    // get antenna posistion
    let str = `rx_transform_${this.receivers.length}`; // "signal_1"
    // console.log("!!!!! rx transform name:", str);
    let pos = getCoordinatesFromX3D(str);
    this.rxPositions.push(pos);
  }

}

// Calculates the path loss at a given point in space with given spherical coordinates theta and phi
// Uses equation:
// path_loss = 20log10(lambda/(4pi*distance)) + abs(fvert(theta,phi))^2 + abs(fhoriz(theta,phi))^2
// lambda: wavelength of the signal
// distance: the distance from the receiver antenna to the transmitter
// fvert(theta,phi) and fhoriz(theta,phi): the complex antenna pattern values at the given spherical coordinates
// pattern: selected antenna pattern string

//console.log("rxAngleBEG: " + window.rxAngles.Z);


//console.log("Accessing rxAngles.Z from external file:", rxAngles.Z);

// Example use:
function getRxZAngleDegrees() {
  return rxAngles.Z;
}

function getTxZAngleDegrees() {
  return txAngles.Z;
}

// Retrieves the coordinates of a Transform node in an X3D file by its object name.
  function getCoordinatesFromX3D(objectName) {

    const transformNode = document.getElementById(objectName);
    if (!transformNode) {
     // console.error(`Object "${objectName}" not found in X3D file.`);
      return null;
    }

    // Get the translation attribute of the Transform node
    const translationAttr = transformNode.getAttribute("translation");

    // Parse the translation attribute string into an array of coordinates
    const coordinates = translationAttr.split(" ").map(parseFloat);
    console.log(coordinates);
    // receiverPos.x = coordinates[0];
    // receiverPos.y = coordinates[1];
    // receiverPos.z = coordinates[2];
    // console.log(receiverPos);

    // Return the coordinates as an object with x, y, and z properties
    return { x: coordinates[0], y: coordinates[1], z: coordinates[2] };
  }

//TODO: the polarization has only been implemented when we assume both antennas are vertically polarized.  Need to implement the case when both antennas are horizontally polarized and when one is vertically polarized and the other is horizontally polarized. This can be done with an if, else if, else, where we put if tx horiz, if rx horiz, etc.  Note this must go in advancedcalculatePathLoss

function calculatePathLoss(sig, theta, phi, distance, pattern) {
  //console.log("========== calculatePathLoss Called ==========");

  // 1. Check input arguments (ESSENTIAL)
  //console.log("[INPUT] freq (Hz):", sig["_freq"], 
  //            "gain (dB):", sig["_gn"], 
  //            "theta (°):", theta, 
  //            "phi (°):", phi, 
  //            "distance (m):", distance, 
  //            "pattern:", pattern);

  // 2. Wavelength
  let lambda = 299.792458e6 / sig["_freq"];

  // 3. Z-angle tilt (degrees -> radians -> cos²z)
  let zRadians = (rxAngles.Z * Math.PI) / 180;
  let cos2z = Math.cos(zRadians) ** 2;
  //console.log("[Z TILT] rxAngles.Z (°):", rxAngles.Z, "→ cos²(z):", cos2z.toFixed(4));

  // 4. Antenna pattern values for RX
  let antenna_pattern = getAntennaPatternValue(theta, phi, pattern);
  let fvert_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[0]));
  let fhoriz_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[1]));
  //console.log("RX vertical pattern gain (fvert_tx_dB):", fvert_rx_dB);
//console.log("RX horizontal pattern gain (fhoriz_tx_dB):", fhoriz_rx_dB);

  // 5. Antenna pattern values for TX (directional fix)
  // You must calculate theta_tx and phi_tx: the angles between TX boresight and RX direction
  // For beginner mode, you may need to use global variables or functions to get TX/RX positions and TX orientation
  // Example (replace with your actual variables):
  // let theta_tx = ...; // angle between TX boresight and RX direction (degrees)
  // let phi_tx = ...;   // azimuth angle if needed (degrees)
  // let pattern_tx = pattern; // or use a separate TX pattern variable

  // If you don't have theta_tx/phi_tx, just use theta/phi for now (will work for isotropic, not directional)
  let tx_pattern = getAntennaPatternValue(theta, phi, pattern);
  //let fvert_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[0]));
  //let fhoriz_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[1]));

  let fvert_tx_dB, fhoriz_tx_dB;
  if (pattern === "horizontal_isotropic") {
    fvert_tx_dB = -300;
  fhoriz_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[1]));
  } else {
  fvert_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[0]));
      fhoriz_tx_dB = -300;
  }

  // 6. EIRP (Effective Isotropic Radiated Power)
  let eirp_vert_dB = sig._gn + fvert_tx_dB;
  let eirp_horiz_dB = sig._gn + fhoriz_tx_dB;
  //console.log("TX gain (sig._gn):", sig._gn);
//console.log("TX vertical pattern gain (fvert_tx_dB):", fvert_tx_dB);
//console.log("TX horizontal pattern gain (fhoriz_tx_dB):", fhoriz_tx_dB);

  // 7. Path loss
  let pathLoss_dB = 20 * Math.log10((4 * Math.PI * distance) / lambda);
  //console.log("[Path Loss] (dB):", pathLoss_dB.toFixed(2));

  // 8. Received power before tilt
  let p_receiver_vert_dB = eirp_vert_dB - pathLoss_dB + fvert_rx_dB;
  let p_receiver_horiz_dB = eirp_horiz_dB - pathLoss_dB + fhoriz_rx_dB;

  let tiltVert = cos2z;
  let tiltHoriz = 1 - cos2z;

  let p_receiver_vert_linear = Math.pow(10, p_receiver_vert_dB / 10) * tiltVert;
  let p_receiver_horiz_linear = Math.pow(10, p_receiver_horiz_dB / 10) * tiltHoriz;

  // 10. Total received power
  let p_receiver_dB = 10 * Math.log10(p_receiver_vert_linear + p_receiver_horiz_linear + 1e-12);
  //console.log("[Received Power] FINAL (dB):", p_receiver_dB.toFixed(2));

  // 11. Update DOM
  document.getElementById("path_loss").innerHTML = pathLoss_dB.toFixed(2);
  if (!isNaN(p_receiver_dB) && Math.abs(p_receiver_dB) !== Infinity) {
    document.getElementById("power_rx_db").innerHTML = p_receiver_dB.toFixed(2);
  }

  //console.log("===============================================");
}



function calculatePathLossAdvanced(
  sig,
  theta_rx,
  phi_rx,
  theta_tx,
  phi_tx,
  distance,
  pattern_rx,
  pattern_tx
) {
  // Compute wavelength in meters
  let lambda = 299.792458e6 / sig["_freq"];

  // Get antenna pattern values
  let antenna_pattern = getAntennaPatternValue(theta_rx, phi_rx, pattern_rx);
// Flip phi for TX pattern only (red-to-blue)
let phi_tx_flipped = (phi_tx + 180) % 360;
let tx_pattern = getAntennaPatternValue(theta_tx, phi_tx_flipped, pattern_tx);

  let fvert_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[0]));
  let fhoriz_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[1]));

  let z1 = typeof rxAngles !== "undefined" ? rxAngles.Z : 0;
  let z2 = typeof txAngles !== "undefined" ? txAngles.Z : 0;
  let zDiffRad = Math.abs(z1 - z2) * Math.PI / 180;
  let cos2z = Math.cos(zDiffRad) ** 2;

  let fvert_tx_dB, fhoriz_tx_dB;
  if (pattern_tx === "horizontal_isotropic") {
    fvert_tx_dB = -300;
    fhoriz_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[1]));
  } else {
    fvert_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[0]));
    fhoriz_tx_dB = -300;
  }

  let tiltVert = cos2z;
  let tiltHoriz = 1 - cos2z;

  // Effective isotropic radiated power at antenna of the transmitter
  let eirp_vert_dB = sig._gn + fvert_tx_dB;
  let eirp_horiz_dB = sig._gn + fhoriz_tx_dB;

  // Path loss
  let pathLoss_dB = 20 * Math.log10((4 * Math.PI * distance) / lambda);

  // Received power before tilt
  let p_receiver_vert_dB = eirp_vert_dB - pathLoss_dB + fvert_rx_dB;
  let p_receiver_horiz_dB = eirp_horiz_dB - pathLoss_dB + fhoriz_rx_dB;

  let p_receiver_vert_linear = Math.pow(10, p_receiver_vert_dB / 10) * tiltVert;
  let p_receiver_horiz_linear = Math.pow(10, p_receiver_horiz_dB / 10) * tiltHoriz;

  // Total received power
  let p_receiver_dB = 10 * Math.log10(p_receiver_vert_linear + p_receiver_horiz_linear + 1e-12);

  // Update DOM
   document.getElementById("path_loss").innerHTML = pathLoss_dB.toFixed(2);
  if (!isNaN(p_receiver_dB) && Math.abs(p_receiver_dB) !== Infinity) {
    document.getElementById("power_rx_db").innerHTML = p_receiver_dB.toFixed(2);
  }

  console.log("Link 1 | RX pattern gain at (theta, phi):", theta_rx, phi_rx, pattern_rx);
}



function calculatePathLossAdvanced2(
  sig,
  theta_rx,
  phi_rx,
  theta_tx,
  phi_tx,
  distance,
  pattern_rx,
  pattern_tx
) {
  // Compute wavelength in meters
  let lambda = 299.792458e6 / sig["_freq"];

  // Get antenna pattern values
  let antenna_pattern = getAntennaPatternValue(theta_rx, phi_rx, pattern_rx);
  let tx_pattern = getAntennaPatternValue(theta_tx, phi_tx, pattern_tx);

  let fvert_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[0]));
  let fhoriz_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[1]));

  // If you have separate rxAngles2/txAngles2, use them here
  let z1 = typeof rxAngles2 !== "undefined" ? rxAngles2.Z : 0;
  let z2 = typeof txAngles2 !== "undefined" ? txAngles2.Z : 0;
  let zDiffRad = Math.abs(z1 - z2) * Math.PI / 180;
  let cos2z = Math.cos(zDiffRad) ** 2;

  let fvert_tx_dB, fhoriz_tx_dB;
  if (pattern_tx === "horizontal_isotropic") {
    fvert_tx_dB = -300;
    fhoriz_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[1]));
  } else {
    fvert_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[0]));
    fhoriz_tx_dB = -300;
  }

  let tiltVert = cos2z;
  let tiltHoriz = 1 - cos2z;

  // Effective isotropic radiated power at antenna of the transmitter
  let eirp_vert_dB = sig._gn + fvert_tx_dB;
  let eirp_horiz_dB = sig._gn + fhoriz_tx_dB;

  // Path loss
  let pathLoss_dB = 20 * Math.log10((4 * Math.PI * distance) / lambda);

  // Received power before tilt
  let p_receiver_vert_dB = eirp_vert_dB - pathLoss_dB + fvert_rx_dB;
  let p_receiver_horiz_dB = eirp_horiz_dB - pathLoss_dB + fhoriz_rx_dB;

  let p_receiver_vert_linear = Math.pow(10, p_receiver_vert_dB / 10) * tiltVert;
  let p_receiver_horiz_linear = Math.pow(10, p_receiver_horiz_dB / 10) * tiltHoriz;

  // Total received power
  let p_receiver_dB = 10 * Math.log10(p_receiver_vert_linear + p_receiver_horiz_linear + 1e-12);

  // Update DOM for new antennas only
  document.getElementById("path_loss").innerHTML = pathLoss_dB.toFixed(2);
  if (!isNaN(p_receiver_dB) && Math.abs(p_receiver_dB) !== Infinity) {
    document.getElementById("power_rx_db_2").innerHTML = p_receiver_dB.toFixed(2);
  }

    console.log("Link 2 | RX pattern gain at (theta, phi):", theta_rx, phi_rx, pattern_rx);

}


function calculatePathLossAdvanced3(
  sig,
  theta_rx,
  phi_rx,
  theta_tx,
  phi_tx,
  distance,
  pattern_rx,
  pattern_tx
) {
  // Use OG RX Z and New TX Z
  let z1 = typeof rxAngles !== "undefined" ? rxAngles.Z : 0;
  let z2 = typeof txAngles2 !== "undefined" ? txAngles2.Z : 0;
  let zDiffRad = Math.abs(z1 - z2) * Math.PI / 180;
  let cos2z = Math.cos(zDiffRad) ** 2;

  let lambda = 299.792458e6 / sig["_freq"];
  let antenna_pattern = getAntennaPatternValue(theta_rx, phi_rx, pattern_rx);
  let tx_pattern = getAntennaPatternValue(theta_tx, phi_tx, pattern_tx);

  let fvert_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[0]));
  let fhoriz_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[1]));

  let fvert_tx_dB, fhoriz_tx_dB;
  if (pattern_tx === "horizontal_isotropic") {
    fvert_tx_dB = -300;
    fhoriz_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[1]));
  } else {
    fvert_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[0]));
    fhoriz_tx_dB = -300;
  }

  let tiltVert = cos2z;
  let tiltHoriz = 1 - cos2z;

  let eirp_vert_dB = sig._gn + fvert_tx_dB;
  let eirp_horiz_dB = sig._gn + fhoriz_tx_dB;

  let pathLoss_dB = 20 * Math.log10((4 * Math.PI * distance) / lambda);

  let p_receiver_vert_dB = eirp_vert_dB - pathLoss_dB + fvert_rx_dB;
  let p_receiver_horiz_dB = eirp_horiz_dB - pathLoss_dB + fhoriz_rx_dB;

  let p_receiver_vert_linear = Math.pow(10, p_receiver_vert_dB / 10) * tiltVert;
  let p_receiver_horiz_linear = Math.pow(10, p_receiver_horiz_dB / 10) * tiltHoriz;

  let p_receiver_dB = 10 * Math.log10(p_receiver_vert_linear + p_receiver_horiz_linear + 1e-12);

  // Update DOM for Link 3 (OG RX ↔ New TX)
  document.getElementById("path_loss").innerHTML = pathLoss_dB.toFixed(2);
  if (!isNaN(p_receiver_dB) && Math.abs(p_receiver_dB) !== Infinity) {
    document.getElementById("power_rx_db").innerHTML = p_receiver_dB.toFixed(2);
  }

    console.log("Link 3 | RX pattern gain at (theta, phi):", theta_rx, phi_rx, pattern_rx);

}



function calculatePathLossAdvanced4(
  sig,
  theta_rx,
  phi_rx,
  theta_tx,
  phi_tx,
  distance,
  pattern_rx,
  pattern_tx
) {
  // Use New RX Z and OG TX Z
  let z1 = typeof rxAngles2 !== "undefined" ? rxAngles2.Z : 0;
  let z2 = typeof txAngles !== "undefined" ? txAngles.Z : 0;
  let zDiffRad = Math.abs(z1 - z2) * Math.PI / 180;
  let cos2z = Math.cos(zDiffRad) ** 2;

  let lambda = 299.792458e6 / sig["_freq"];

  // Flip phi_rx for RX2 only for the RX2–TX1 link (rotate by 270°)
 let rx_pattern = getAntennaPatternValue(theta_rx, phi_rx, pattern_rx);
  let tx_pattern = getAntennaPatternValue(theta_tx, phi_tx, pattern_tx);

  // Use the flipped RX2 pattern for gain calculations
  let fvert_rx_dB = 20 * Math.log10(Math.abs(rx_pattern[0]));
  let fhoriz_rx_dB = 20 * Math.log10(Math.abs(rx_pattern[1]));

  let fvert_tx_dB, fhoriz_tx_dB;
  if (pattern_tx === "horizontal_isotropic") {
    fvert_tx_dB = -300;
    fhoriz_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[1]));
  } else {
    fvert_tx_dB = 20 * Math.log10(Math.abs(tx_pattern[0]));
    fhoriz_tx_dB = -300;
  }

  let tiltVert = cos2z;
  let tiltHoriz = 1 - cos2z;

  let eirp_vert_dB = sig._gn + fvert_tx_dB;
  let eirp_horiz_dB = sig._gn + fhoriz_tx_dB;

  let pathLoss_dB = 20 * Math.log10((4 * Math.PI * distance) / lambda);

  let p_receiver_vert_dB = eirp_vert_dB - pathLoss_dB + fvert_rx_dB;
  let p_receiver_horiz_dB = eirp_horiz_dB - pathLoss_dB + fhoriz_rx_dB;

  let p_receiver_vert_linear = Math.pow(10, p_receiver_vert_dB / 10) * tiltVert;
  let p_receiver_horiz_linear = Math.pow(10, p_receiver_horiz_dB / 10) * tiltHoriz;

  let p_receiver_dB = 10 * Math.log10(p_receiver_vert_linear + p_receiver_horiz_linear + 1e-12);

  // Update DOM for Link 4 (OG TX ↔ New RX)
  document.getElementById("path_loss").innerHTML = pathLoss_dB.toFixed(2);
  if (!isNaN(p_receiver_dB) && Math.abs(p_receiver_dB) !== Infinity) {
    document.getElementById("power_rx_db_2").innerHTML = p_receiver_dB.toFixed(2);
  }


    console.log("Link 4 | RX pattern gain at (theta, phi):", theta_rx, phi_rx, pattern_rx);

}



