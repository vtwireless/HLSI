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

function CapacityRunner_MultiSignal(signal_list, parentElement = null, avgThroughput_chart = null,
    func = null, opts = null) {

    if (func != undefined && typeof (func) !== 'function' && typeof (func) !== 'object') {
        let msg = "Code ERROR BAD func arguement to CapacityRunner()";
        alert(msg);
        console.log(msg);
        throw (msg);
    }

    // We make this an object if we have a select options list of functions.
    var funcs = false;

    if (func != undefined && typeof (func) === 'object') {
        funcs = func;
        // Pick the first in the list as the current function to run.
        func = func[Object.keys(func)[0]];
    }

    // Generate a unique id for HTML element ids.
    var id = (CapacityRunner_MultiSignal.count++).toString() + '_capRu';
    var pu_mode = document.getElementById("pu_mode");

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
';

    innerHTML += `<label style="font-weight: bold">Throughput (bits): </label>\
    `;
    if (signal_list.length === 2) {
        innerHTML += `<label>User Signal: </label>\ &nbsp;\
        `;
        innerHTML += `<output id="sig${1}${id}" style="color: #0C0;"></output>\ &nbsp; \
        `;
        if (pu_mode && pu_mode.value) {
            if (pu_mode.value === 'comms_primary_user') {
                innerHTML += `<label>Primary User: </label>\ &nbsp;\
        `;
                innerHTML += `<output id="sig${2}${id}" style="color: #0C0;"></output>\ &nbsp; \
        `;
            }
        }
    } else {
        for (let i = 0; i < signal_list.length; i++) {
            if (i == 4) {
                innerHTML += `<label for="sig${i + 1}${id}">Primary User: </label>\ &nbsp;\
                <output id="sig${i + 1}${id}" style="color: #0C0;"></output>\ &nbsp; \
                `;
            } else {
                innerHTML += `<label for="sig${i + 1}${id}">Link ${i + 1}: </label>\ &nbsp;\
                <output id="sig${i + 1}${id}" style="color: #0C0;"></output>\ &nbsp; \
                `;
            }
        }
    }

    innerHTML += `<br><label style="font-weight: bold">Outage (seconds): </label>\
    `;
    if (signal_list.length === 2) {
        innerHTML += `<label>User Signal: </label>\ &nbsp;\
        `;
        innerHTML += `<output id="outage_sig${1}${id}" style="color: #FFFF00;"></output>\ &nbsp; \
        `;
        innerHTML += `<label>Primary User: </label>\ &nbsp;\
        `;
        innerHTML += `<output id="outage_sig${2}${id}" style="color: #FFFF00;"></output>\ &nbsp; \
        `;
    } else {
        for (let i = 0; i < signal_list.length; i++) {
            if (i == 4) {
                innerHTML += `<label for="outage_sig${i + 1}${id}"> Primary User: </label>\
                <output id="outage_sig${i + 1}${id}" style="color: #FFFF00;"></output>, &nbsp;\
                `;
            } else {
                innerHTML += `<label for="outage_sig${i + 1}${id}"> Link ${i + 1}: </label>\
                <output id="outage_sig${i + 1}${id}" style="color: #FFFF00;"></output>, &nbsp;\
                `;
            }
        }
    }

    if (pu_mode != null && pu_mode.value != null) {
        innerHTML += `<br><label style="font-weight: bold;">Performance score: </label>\
        `;
        innerHTML += `<output id="perf_score${id}" style="color: #FFFF00;"></output>\ &nbsp; \
        `;
    }
   
    if (pu_mode != null && pu_mode.value != null) {
        innerHTML += `<br><label style="font-weight: bold;">Outage Events: </label>\
            `;
        if (signal_list.length === 5) {
            for (let i = 0; i < signal_list.length-1; i++) { 
                innerHTML += `<label">Link ${i + 1}: </label>\
                `;
                innerHTML += `<output id="outage_events_sig${i + 1}${id}" style="color: #FFFF00;"></output>\ &nbsp; \
                `;
            }
        } else {
            innerHTML += `<label">User Signal: </label>\
            `;
            innerHTML += `<output id="outage_events_sig${id}" style="color: #FFFF00;"></output>\ &nbsp; \
            `;
        }
      
        innerHTML += `<label">Primary User: </label>\
            `;
        innerHTML += `<output id="outage_events_pu${id}" style="color: #FFFF00;"></output>\ &nbsp; \
            `;

    }

    if (parentElement === null) {
        parentElement = document.createElement('p');
        document.body.appendChild(parentElement);
    } else if (typeof (parentElement) === 'string') {
        parentElement = document.querySelector(parentElement);
    }

    var tStep = 0.1; // Default tStep.

    if (opts && typeof (opts.tStep) !== 'undefined')
        // User option to set tStep.
        tStep = opts.tStep;

    const runTime = 60.0; // seconds

    var signal_bits = Array(signal_list.length).fill(0);
    var signal_outages = Array(signal_list.length).fill(0.0);        // seconds with no throughput
    var signal_prevRates = [];
    var pu_outageEvents = 0;
    var sig_outageEvents = 0;
    var signal_outageEvents = Array(signal_list.length).fill(0);

    var perf_score = 0;
    var prev_pu_sinr;
    var prev_sig_sinr;
    var signal_prevSinr = [];
    var timeLeft = runTime; // seconds

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

        for (let i = 0; i < signal_list.length; i++) {
            if (pu_mode && pu_mode.value && pu_mode.value !== 'comms_primary_user' && i == 1) {
                continue;
            }

            var el = '#sig' + (i + 1);
            getElement(el).value = d3.format(",")(signal_bits[i]);
        }

        for (let i = 0; i < signal_list.length; i++) {
            var outage_el = '#outage_sig' + (i + 1);
            getElement(outage_el).value = d3.format(",")(signal_outages[i].toFixed(2));
        }

        if (pu_mode != null && pu_mode.value != null) {

            getElement('#perf_score').value = d3.format(",")(perf_score);

            if (signal_list.length === 5) {
                for (let i = 0; i < signal_list.length-1; i++) { 
                    var outage_events_el = '#outage_events_sig' + (i + 1);
                    getElement(outage_events_el).value = d3.format(",")(signal_outageEvents[i]);
                }
            } else {
                getElement('#outage_events_sig').value = d3.format(",")(sig_outageEvents);
            }
            
            getElement('#outage_events_pu').value = d3.format(",")(pu_outageEvents);
        }

    }

    var prevT = 0.0; // seconds

    function getValues() {

        if (!isRunning) {
            prevT = 0.0;
            return;
        }

        var t = (new Date()).getTime() / 1000.0; // seconds
        if (prevT === 0.0) {
            // We just started so we do not have a time change.
            for (let i = 0; i < signal_list.length; i++) {
                signal_prevRates[i] = signal_list[i].rate;
            }

            prevT = t;
            return;
        }

        let dt = t - prevT;

        for (let i = 0; i < signal_list.length; i++) {
            if (signal_prevRates[i] <= 0.0)
                signal_outages[i] += dt;
            else {
                signal_bits[i] += Math.round(signal_prevRates[i] * dt);
            }
        }

        var sum_total = 0;
        for (let i = 0; i < signal_list.length; i++) {
            sum_total += signal_bits[i];
            total_bits = sum_total;
        }

        for (let i = 0; i < signal_list.length; i++) {
            signal_prevRates[i] = signal_list[i].rate;
        }

        prevT = t;

        SetLabels();

        var data_bits = {
            bits_list: signal_bits,
            timeElapsed: runTime - timeLeft
        };

        if (signal_bits.length === 2) {
            perf_score += (0.9 * signal_bits[0] + 0.1 * signal_bits[1]) - (1000000 * signal_outages[1]);
        } else if (signal_bits.length === 5) {
            perf_score += (0.9 * (signal_bits[0] + signal_bits[1] + signal_bits[2] + signal_bits[3])
                + 0.1 * signal_bits[4]) - (1000000 * signal_outages[4]);
        }

        // calculate outage events
        if (pu_mode && pu_mode.value) {
            switch (pu_mode.value) {
                case 'interference':
                    break;
                case 'radar_primary_user':
                    var sinr_threshold = document.getElementById("sinr_threshold");
                    var primary_user = signal_list.length === 5 ? signal_list[4] : signal_list[1];
                    // PU Outage Events based on the SINR threshold
                    if ((prev_pu_sinr === null || prev_pu_sinr !== primary_user.sinr)
                        && sinr_threshold && sinr_threshold.value) {
                        if (primary_user.sinr < Number(sinr_threshold.value)) {
                            pu_outageEvents += 1;
                            prev_pu_sinr = primary_user.sinr;
                        }
                    }

                    // Signal Outage Events based on the SINR threshold
                    if (signal_list.length === 5) {
                        for (let i = 0; i < signal_list.length - 1; i++) {
                            if ((signal_prevSinr[i] === null || signal_prevSinr[i] !== signal_list[i].sinr)
                                && sinr_threshold && sinr_threshold.value) {
                                if (signal_list[i].sinr < Number(sinr_threshold.value)) {
                                    signal_outageEvents[i] += 1;
                                    signal_prevSinr[i] = signal_list[i].sinr;
                                }
                            }
                        }
                    } else {
                        if ((prev_sig_sinr === null || prev_sig_sinr !== signal_list[0].sinr)
                            && sinr_threshold && sinr_threshold.value) {
                            if (signal_list[0].sinr < Number(sinr_threshold.value)) {
                                sig_outageEvents += 1;
                                prev_sig_sinr = signal_list[0].sinr;
                            }
                        }
                    }
                    break;
                case 'comms_primary_user':
                    var rate_threshold = document.getElementById("rate_threshold");
                    var primary_user = signal_list.length === 5 ? signal_list[4] : signal_list[1];
                    // PU Outage Events based on the Data Rate threshold
                    var pu_dataRate = signal_list.length === 5 ? (signal_bits[1] / data_bits.timeElapsed)
                        : (signal_bits[4] / data_bits.timeElapsed);
                    var sig_dataRate = signal_bits[0] / data_bits.timeElapsed;
                    if ((prev_pu_sinr === null || prev_pu_sinr !== primary_user.sinr)
                        && rate_threshold && rate_threshold.value) {
                        if (pu_dataRate < Number(rate_threshold.value) * 1e6) {
                            pu_outageEvents += 1;
                            prev_pu_sinr = primary_user.sinr;
                        }
                    }

                    // Signal Outage Events based on the Data Rate threshold
                    if (signal_list.length === 5) {
                        for (let i = 0; i < signal_list.length - 1; i++) {
                            if ((signal_prevSinr[i] === null || signal_prevSinr[i] !== signal_list[i].sinr)
                                && rate_threshold && rate_threshold.value) {
                                if ((signal_bits[i] / data_bits.timeElapsed) < Number(rate_threshold.value) * 1e6) {
                                    signal_outageEvents[i] += 1;
                                    signal_prevSinr[i] = signal_list[i].sinr;
                                }
                            }
                        }
                    } else {
                        if ((prev_sig_sinr === null || prev_sig_sinr !== signal_list[0].sinr)
                            && rate_threshold && rate_threshold.value) {
                            if (sig_dataRate < Number(rate_threshold.value) * 1e6) {
                                sig_outageEvents += 1;
                                prev_sig_sinr = signal_list[0].sinr;
                            }
                        }
                    }

                    break;
            }
        }

        // update the average data throughput plot
        avgThroughput_chart.update_plot(data_bits);
        ThroughputPlot.isRunning = true;
    }

    for (let i = 0; i < signal_list.length; i++) {
        signal_list[i].onChange('rate', getValues);
    }

    function RunStep() {

        if (!isRunning) return;

        // Advance the time.
        timeLeft -= tStep;
        if (timeLeft <= 0.0)
            timeLeft = 0.0;

        const t = runTime - timeLeft;

        // Call user function:
        if (func != undefined)
            func(t);

        // Get the last value changes.
        getValues();

        if (timeLeft === 0.0)
            Stop();
    }


    function Reset() {

        for (let i = 0; i < signal_list.length; i++) {
            signal_outages[i] = 0.0;
            signal_bits[i] = 0;
            signal_outageEvents[i] = 0;
        }

        timeLeft = runTime; // seconds
        ThroughputPlot.timeLeft = runTime;
        pu_outageEvents = 0;
        sig_outageEvents = 0;

        total_bits = 0; // number of bits in bits
        perf_score = 0;
        timerId = null;
        SetLabels();
    }


    function Start() {

        if (func != undefined && typeof (func) !== 'function') {
            Stop();
            return;
        }

        if (isRunning) return;

        // if we are not running the timer for the first time, clear the Avg Data Rate graph
        if (timeLeft < runTime && document.getElementById("throughput-multisignal-plot") !== null) {
            document.getElementById("throughput-multisignal-plot").remove();
            ThroughputPlot.timeLeft = runTime;
            ThroughputPlot.stopClick = false;
            ThroughputPlot.isRunning = true;
            RecreateThroughputPlot();
            HoppingInterferer.stopClick = false;
            if (document.getElementById("hoppingInterferer")) {
                HoppingInterferer(interferer, '#hoppingInterferer');
            }

            if (document.getElementById("scriptController") != null) {
                ScriptController.stopClick = false;
            }
        }

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
        ThroughputPlot.stopClick = true;
        ThroughputPlot.isRunning = false;
        HoppingInterferer.stopClick = true;
        ScriptController.stopClick = true;
        getElement('#start').value = "Start";
    }


    function StartStop() {
        if (isRunning) Stop();
        else Start();
    }

    function RecreateThroughputPlot() {
        if (document.getElementById("pu_mode") !== null) {
            let pu_mode = document.getElementById("pu_mode").value;
            switch (pu_mode) {
                case 'comms_primary_user':
                    if (signalList.length === 2) {
                        ThroughputPlot([sig, interferer], [], rate_threshold);
                    } else {
                        ThroughputPlot([sig1, sig2, sig3, sig4, interferer], [], rate_threshold);
                    }
                    break;
                case 'radar_primary_user':
                case 'interference':
                    if (signalList.length === 2) {
                        ThroughputPlot([sig]);
                    } else {
                        ThroughputPlot([sig1, sig2, sig3, sig4]);
                    }
                    break;
            }
            return;
        }

        ThroughputPlot(signal_list);
    }


    parentElement.innerHTML = innerHTML;

    getElement('#runTime').value = d3.format('.2f')(runTime) + " s";
    getElement('#timeLeft').value = d3.format('.2f')(timeLeft) + " s";
    var startButton = getElement('#start');
    startButton.addEventListener('click', StartStop);

    if (funcs) {

        // We setup a <select> of functions to choice from:
        //

        let space = document.createTextNode(" ");
        startButton.parentNode.insertBefore(space, startButton.nextSibling);
        let select = document.createElement('select');
        space.parentNode.insertBefore(select, space.nextSibling);
        // We have a bunch of functions to pick from, so we make a
        // <select> to hold all the optional functions.
        Object.keys(funcs).forEach(function (fname) {

            let opt = document.createElement('option');
            opt.Func = funcs[fname];
            opt.innerHTML = fname;
            select.appendChild(opt);
        });

        select.onchange = function () {
            // We select the options function:
            func = select.options[this.selectedIndex].Func;

            // Stop if it's not stopped. ???
            Stop();
        };
    }

    Reset();
}

CapacityRunner_MultiSignal.count = 0;
