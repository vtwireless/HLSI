
function CapacityRunner(sig, parentElement = null, opts = null) {

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


    // The default Gain and Bandwidth vs time functions.
    //
    function Gain(t) {
        // t is time in seconds.
        return -25 + 13*Math.log10(0.001 +
                (0.5 + 0.5*Math.cos(2*Math.PI*0.02*t + 0.7))) *
            Math.exp(-0.05*t);
    }
    //
    function Bandwidth(t) {
        // t is time in seconds.
        return bw_avg + bw_amp * Math.exp(-0.015*t) *
            Math.cos(2*Math.PI*0.03*t + 1.5);
    }

    if(opts !== null) {
        if(typeof(opts.gainFunc) === 'function')
            // User overrides Gain(t) with custom function.
            Gain = opts.gainFunc;
        if(typeof(opts.bandwidthFunc) === 'function')
            // User overrides Bandwidth(t) with custom function.
            Bandwidth = opts.bandwidthFunc;
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

        sig.bw = Bandwidth(t);
        sig.gn = Gain(t);

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
