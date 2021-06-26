
// Run a function at regular intervals.  Adds a "Start" button and some dynamic
// labels.
//
//  ARGUMENTS:
//
//     sig:  a signal object from Signal().
//
//     func: a function that takes to the argument t (time).
//
//     parentElement: an HTML CSS selector string, or <p> HTML element
//                    or none (null).
//                    This adds, HTML, a "Start" button and run numbers
//                    labels.
//

function CapacityRunner(func = null, parentElement = null) {

    if(typeof(func) !== 'function') {
        let msg = "Code ERROR BAD func arguement to CapacityRunner()";
        alert(msg);
        console.log(msg);
        throw(msg);
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

    const tStep = 0.1; // seconds
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


    function RunStep() {

        if(!isRunning) return;

        // Advance the time.
        timeLeft -= tStep;
        if(timeLeft <= 0.0)
            timeLeft = 0.0;

        const t = runTime - timeLeft;

        // Call user function:
        func(t);

        if(sig.rate <= 0.0)
            outage += tStep;
        else
            bits += Math.round(sig.rate * tStep);

        SetLabels();

        if(timeLeft === 0.0)
            Stop();
    }


    function Reset() {

        sig.bw = Bandwidth(0.0);
        sig.gn = Gain(0.0);
        outage = 0.0;  // seconds with no throughput
        timeLeft = runTime; // seconds
        bits = 0; // number of bits in bits
        timerId = null;
        SetLabels();
    }


    function Start() {

        Reset();
        timerId = setInterval(RunStep, tStep * 1000 /*1000 ms/s*/);
        isRunning = true;
        getElement('#start').value = "Stop ";
    }


    function Stop() {

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
    getElement('#start').addEventListener('click', StartStop)


    Reset();
}

CapacityRunner.count = 0;
