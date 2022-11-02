'use strict';

// Run a function at regular intervals.  Adds a "Start" button and some dynamic
// labels.
//
//  ARGUMENTS:
//
//     sig:  a signal object from Signal().

//     parentElement: an HTML CSS selector string, or <p> HTML element
//                    or none (null).
//                    This adds, HTML, a "Start" button and run numbers
//                    labels.
//
//    opts:  options object
//
//           opts.tStep: set time step in seconds.
//

function CapacityRunner(signal_list, parentElement = null, avgThroughput_chart = null) {

    // Generate a unique id for HTML element ids.
    var id = (CapacityRunner.count++).toString() + '_capRu';

    var innerHTML = '\
\
    <input id=start' + id + ' type=button\
        value=Start />\
\
    <label for=runTime' + id + '>Run Time: </label>\
    <output id=runTime' + id + '></output>, &nbsp;\
\
    <label for=timeLeft' + id + '>Time Left: </label>\
    <output id=timeLeft' + id + '></output>, &nbsp;\
\
    <label for=bits' + id + '>Total Bits: </label>\
    <output id="bits' + id + '" style="color: #0C0;"></output>\ &nbsp; \
    <label for=sig1' + id + '>Link 1: </label>\ &nbsp;\
    <output id="sig1' + id + '" style="color: #0C0;"></output>\ &nbsp; \
    <label for=sig2' + id + '>Link 2: </label>\ &nbsp;\
    <output id="sig2' + id + '" style="color: #0C0;"></output>\ &nbsp; \
    <label for=sig3' + id + '>Link 3: </label>\ &nbsp;\
    <output id="sig3' + id + '" style="color: #0C0;"></output>\ &nbsp; \
    <label for=sig4' + id + '>Link 4: </label>\ &nbsp;\
    <output id="sig4' + id + '" style="color: #0C0;"></output>\
';


    if (parentElement === null) {
        parentElement = document.createElement('p');
        document.body.appendChild(parentElement);
    } else if (typeof (parentElement) === 'string') {
        parentElement = document.querySelector(parentElement);
    }

    var tStep = 0.1; // Default tStep.

    const runTime = 60.0; // seconds

    var outage_sig1 = 0.0, outage_sig2 = 0.0, outage_sig3 = 0.0, outage_sig4 = 0.0;  // seconds with no throughput
    var timeLeft = runTime; // seconds

    var sig1 = signal_list[0], sig2 = signal_list[1], sig3 = signal_list[2], sig4 = signal_list[3];

    var bits_sig1 = 0, bits_sig2 = 0, bits_sig3 = 0, bits_sig4 = 0;
    var total_bits = 0; // total number of bits in bits

    var timerId = null;
    var isRunning = false;


    function getElement(sel) {
        var el = document.querySelector(sel + id);
        if (el === null)
            alert("Can't get element with selector \"" + sel + '"');
        return el;
    }


    function SetLabels() {

        getElement('#timeLeft').value =
            d3.format(".2f")(timeLeft) + " s";
        getElement('#bits').value =
            d3.format(",")(total_bits);
        getElement('#sig1').value =
            d3.format(",")(bits_sig1);
        getElement('#sig2').value =
            d3.format(",")(bits_sig2);
        getElement('#sig3').value =
            d3.format(",")(bits_sig3);
        getElement('#sig4').value =
            d3.format(",")(bits_sig4);
    }


    var prevT = 0.0; // seconds
    var prevRate_sig1, prevRate_sig2, prevRate_sig3, prevRate_sig4;

    function getValues() {

        if (!isRunning) {
            prevT = 0.0;
            return;
        }

        var t = (new Date()).getTime() / 1000.0; // seconds
        if (prevT === 0.0) {
            // We just started so we do not have a time change.
            prevRate_sig1 = sig1.rate;
            prevRate_sig2 = sig2.rate;
            prevRate_sig3 = sig3.rate;
            prevRate_sig4 = sig4.rate;

            prevT = t;
            return;
        }

        let dt = t - prevT;

        if (prevRate_sig1 <= 0.0)
            outage_sig1 += dt;
        else {
            bits_sig1 += Math.round(prevRate_sig1 * dt);
            total_bits += bits_sig1;
        }

        if (prevRate_sig2 <= 0.0)
            outage_sig2 += dt;
        else {
            bits_sig2 += Math.round(prevRate_sig2 * dt);
            total_bits += bits_sig2;
        }

        if (prevRate_sig3 <= 0.0)
            outage_sig3 += dt;
        else {
            bits_sig3 += Math.round(prevRate_sig3 * dt);
            total_bits += bits_sig3;
        }

        if (prevRate_sig4 <= 0.0)
            outage_sig4 += dt;
        else {
            bits_sig4 += Math.round(prevRate_sig4 * dt);
            total_bits += bits_sig4;
        }

        prevRate_sig1 = sig1.rate;
        prevRate_sig2 = sig2.rate;
        prevRate_sig3 = sig3.rate;
        prevRate_sig4 = sig4.rate;

        prevT = t;

        SetLabels();

        var data_bits = {
            bits_list: [bits_sig1, bits_sig2, bits_sig3, bits_sig4],
            timeElapsed: runTime - timeLeft
        };

        // update the average data throughput plot
        avgThroughput_chart.update_plot(data_bits);
    }

    sig1.onChange('rate', getValues);
    sig2.onChange('rate', getValues);
    sig3.onChange('rate', getValues);
    sig4.onChange('rate', getValues);

    function RunStep() {

        if (!isRunning) return;

        // Advance the time.
        timeLeft -= tStep;
        if (timeLeft <= 0.0)
            timeLeft = 0.0;

        const t = runTime - timeLeft;

        // Get the last value changes.
        getValues();

        if (timeLeft === 0.0)
            Stop();
    }


    function Reset() {

        outage_sig1 = 0.0;  // seconds with no throughput
        outage_sig2 = 0.0;
        outage_sig3 = 0.0;
        outage_sig4 = 0.0;
        timeLeft = runTime; // seconds
        bits_sig1 = 0;
        bits_sig2 = 0;
        bits_sig3 = 0;
        bits_sig4 = 0;
        total_bits = 0; // number of bits in bits
        timerId = null;
        SetLabels();
    }


    function Start() {

        if (isRunning) return;

        Reset();
        timerId = setInterval(RunStep, tStep * 1000 /*1000 ms/s*/);
        isRunning = true;
        getElement('#start').value = "Stop ";
    }


    function Stop() {

        if (!isRunning) return;

        // Get the last value changes.
        getValues();

        // Stop does not also reset, it just stops.
        clearTimeout(timerId);
        isRunning = false;
        getElement('#start').value = "Start";
    }


    function StartStop() {
        if (isRunning) Stop();
        else Start();
    }


    parentElement.innerHTML = innerHTML;

    getElement('#runTime').value = d3.format('.2f')(runTime) + " s";
    getElement('#timeLeft').value = d3.format('.2f')(timeLeft) + " s";
    var startButton = getElement('#start');
    startButton.addEventListener('click', StartStop);

    Reset();
}

CapacityRunner.count = 0;
