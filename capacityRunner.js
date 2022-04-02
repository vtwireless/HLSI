'use strict';

// Run a function at regular intervals.  Adds a "Start" button and some dynamic
// labels.
//
//  ARGUMENTS:
//
//     sig:  a signal object from Signal().
//
//     func: a function that takes to the argument t (time in seconds),
//           or an object that has key and function pairs
//           The key will be a "select option" label and
//           the corresponding function will be a function of time
//           in seconds that will be call every tStep (0.01) seconds.
//           TODO: add tStep user option.
//
//     parentElement: an HTML CSS selector string, or <p> HTML element
//                    or none (null).
//                    This adds, HTML, a "Start" button and run numbers
//                    labels.
//
//    opts:  options object
//
//           opts.tStep: set time step in seconds.
//

function CapacityRunner(sig, func = null, parentElement = null, opts = null) {

    if(typeof(func) !== 'function' && typeof(func) !== 'object') {
        let msg = "Code ERROR BAD func arguement to CapacityRunner()";
        alert(msg);
        console.log(msg);
        throw(msg);
    }

    // We make this an object if we have a select options list of functions.
    var funcs = false;

    if(typeof(func) === 'object') {
        funcs = func;
        // Pick the first in the list as the current function to run.
        func = func[Object.keys(func)[0]];
    }


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
    <label for=outage' + id + '> Outage: </label>\
    <output id=outage' + id + ' style="color: #C00;"></output>, &nbsp;\
\
    <label for=bits' + id + '>Total Bits: </label>\
    <output id="bits' + id + '" style="color: #0C0;"></output>\
';


    if(parentElement === null) {
        parentElement = document.createElement('p');
        document.body.appendChild(parentElement);
    } else if(typeof(parentElement) === 'string') {
        parentElement = document.querySelector(parentElement);
    }

    var tStep = 0.1; // Default tStep.

    if(opts && typeof(opts.tStep) !== 'undefined')
        // User option to set tStep.
        tStep = opts.tStep;

    const runTime = 60.0; // seconds

    var outage = 0.0;  // seconds with no throughput
    var timeLeft = runTime; // seconds
    var bits = 0; // number of bits in bits
    var timerId = null;

    var isRunning = false;


    function getElement(sel) {
        var el = document.querySelector(sel + id);
        if(el === null)
            alert("Can't get element with selector \""+ sel+ '"');
        return el;
    }


    function SetLabels() {

        getElement('#timeLeft').value =
            d3.format(".2f")(timeLeft) + " s";
        getElement('#outage').value =
            d3.format(".2f")(outage) + " s";
        getElement('#bits').value =
            d3.format(",")(bits);
    }


    var prevT = 0.0; // seconds
    var prevRate;


    function getValues() {

        if(!isRunning) {
            prevT = 0.0;
            return;
        }

        var t = (new Date()).getTime()/1000.0; // seconds
        if(prevT === 0.0) {
            // We just started so we do not have a time change.
            prevRate = sig.rate;
            prevT = t;
            return;
        }

        let dt = t - prevT;


        if(prevRate <= 0.0)
            outage += dt;
        else
            bits += Math.round(prevRate * dt);

        prevRate = sig.rate;
        prevT = t;

        SetLabels();
    }

    sig.onChange('rate', getValues);

    function RunStep() {

        if(!isRunning) return;

        // Advance the time.
        timeLeft -= tStep;
        if(timeLeft <= 0.0)
            timeLeft = 0.0;

        const t = runTime - timeLeft;

        // Call user function:
        func(t);
        
        // Get the last value changes.
        getValues();

        if(timeLeft === 0.0)
            Stop();
    }


    function Reset() {

        outage = 0.0;  // seconds with no throughput
        timeLeft = runTime; // seconds
        bits = 0; // number of bits in bits
        timerId = null;
        SetLabels();
    }


    function Start() {

        if(typeof(func) !== 'function') {
            Stop();
            return;
        }

        if(isRunning) return;

        Reset();
        timerId = setInterval(RunStep, tStep * 1000 /*1000 ms/s*/);
        isRunning = true;
        getElement('#start').value = "Stop ";
    }


    function Stop() {

        if(!isRunning) return;

        // Get the last value changes.
        getValues();

        // Stop does not also reset, it just stops.
        clearTimeout(timerId);
        isRunning = false;
        getElement('#start').value = "Start";
    }


    function StartStop() {
        if(isRunning) Stop();
        else Start();
    }


    parentElement.innerHTML = innerHTML;
    
    getElement('#runTime').value = d3.format('.2f')(runTime) + " s";
    getElement('#timeLeft').value = d3.format('.2f')(timeLeft) + " s";
    var startButton = getElement('#start');
    startButton.addEventListener('click', StartStop);


    if(funcs) {

        // We setup a <select> of functions to choice from:
        //

        let space = document.createTextNode(" ");
        startButton.parentNode.insertBefore(space, startButton.nextSibling);
        let select = document.createElement('select');
        space.parentNode.insertBefore(select, space.nextSibling);
        // We have a bunch of functions to pick from, so we make a
        // <select> to hold all the optional functions.
        Object.keys(funcs).forEach(function(fname) {

            let opt = document.createElement('option');
            opt.Func = funcs[fname];
            opt.innerHTML = fname;
            select.appendChild(opt);
        });

        select.onchange = function() {
            // We select the options function:
            func = select.options[this.selectedIndex].Func;
            
            // Stop if it's not stopped. ???
            Stop();
        };
    }


    Reset();
}

CapacityRunner.count = 0;
