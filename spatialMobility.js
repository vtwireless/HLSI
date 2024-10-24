'use strict';

/// Classes for the Spatial Mobility Framework


// Base Station
const BaseStation = class {

    // constructor for BaseStation 
    constructor(position, velocity, maxAcceleration, transmitters, receivers, txAntennas, RxAntennas) {
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

// Calculates the path loss at a given point in space with given spherical coordinates theta and phi
// Uses equation: 
// path_loss = 20log10(lambda/(4pi*distance)) + abs(fvert(theta,phi))^2 + abs(fhoriz(theta,phi))^2
// lambda: wavelength of the signal
// distance: the distance from the receiver antenna to the transmitter
// fvert(theta,phi) and fhoriz(theta,phi): the complex antenna pattern values at the given spherical coordinates
// pattern: selected antenna pattern string
function calculatePathLoss(receiverSig, transmitterSig, theta, phi, distance, pattern) {
    // compute wavelength in meters
    let lambda = 299.792458e6 / (receiverSig["_freq"]);

    // convert the normalized antenna pattern values in fvert and fhoriz to dB
    // uncomment these lines when transmitter antenna angle will be controllable
    // let fvert_tx_dB = 20 * Math.log10(Math.abs(fvert_antenna_pattern));
    // let fhoriz_tx_dB = 20 * Math.log10(Math.abs(fhoriz_antenna_pattern));

    let antenna_pattern = getAntennaPatternValue(theta, phi, pattern);
    
    let fvert_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[0]));
    let fhoriz_rx_dB = 20 * Math.log10(Math.abs(antenna_pattern[1]));

    let fvert_tx_dB = 0;
    let fhoriz_tx_dB = -300;

    // effective isotropic radiated power at antenna of the transmitter
    let eirp_vert_dB = transmitterSig._gn + fvert_tx_dB;
    let eirp_horiz_dB = transmitterSig._gn + fhoriz_tx_dB;
    console.log("Transmitter gain: " + transmitterSig._gn);
    console.log("eirp vert dB: " + eirp_vert_dB);
    console.log("eirp horiz dB: " + eirp_horiz_dB);
    

    let pathLoss_dB = 20 * Math.log10((4 * Math.PI * distance)/lambda);

    let p_receiver_vert_dB = eirp_vert_dB - pathLoss_dB + fvert_rx_dB;
    let p_receiver_horiz_dB = eirp_horiz_dB - pathLoss_dB + fhoriz_rx_dB;

    let p_receiver_dB = 10 * Math.log10(10 ** (p_receiver_vert_dB/10) + 10 ** (p_receiver_horiz_dB/10));

    document.getElementById("path_loss").innerHTML = pathLoss_dB.toFixed(2);
    document.getElementById("power_rx_db").innerHTML = p_receiver_dB.toFixed(2);


}


