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


