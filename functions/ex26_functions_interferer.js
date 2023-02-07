
// This file is used by ScriptController() in scriptController.js.
//
//
var functions = {

    // We need to convert the body of these functions to strings,
    // hence the odd text layout in these functions, they are
    // pushed to the left side.
    //
    // They are called like so:
    //
    // function callback(freq1, bw1, gn1, mcs1, rate1, freq2, bw2, gn2, mcs2,\
    //                   rate2, dt, userData, init)
    //

    "Adapt mcs":
function() {
 
    // Code to adapt mcs1; waits tTryAgain seconds after the
    // last transmission failure before trying to increase mcs1

    function reset() {
        userData.t = 0.0;
        userData.done = false;
        userData.lastBits = rate1 * dt;
    }


    if(init){
        userData.lastLastBits = 0;
        userData.lastBits = rate1 * dt;
        userData.lastdBits = 0;
        userData.tSinceBeginning = 0.0;
        userData.tLastTimeBelowThreshold = 0.0;
        reset();
    }

    if(userData.done) return;
 
    userData.t += dt; // in seconds
    userData.tSinceBeginning += dt; // in seconds
 
    const minBits = 1000; // Reduce mcs if fewer bits are received during measureT seconds
    const measureT = 5.0; // Interval in seconds for measuring bits transmitted and received
    const tTryAgain = 25.0;// Time to try increasing mcs
 
    if(userData.t < measureT) return;
 
    // Total bits over 5 seconds.
    var dBits = rate1 * dt - userData.lastBits;
 
    console.log("   dBits=" + dBits);
 
    reset();
 
    var tSinceLastFailure = userData.tSinceBeginning - userData.tLastTimeBelowThreshold;
 
    if(dBits < minBits) {
        // Reduce mcs
        // userData.done = true;
        userData.lastdBits = dBits;
        userData.tLastTimeBelowThreshold = userData.tSinceBeginning;
        return { mcs1: mcs1-2 };
    } else if(tSinceLastFailure < tTryAgain){
        userData.lastdBits = dBits;
        return { mcs1: mcs1 };
    } else if(mcs1 < mcs_max1) {
        // Try for more throughput.
        userData.lastdBits = dBits;
        return { mcs1: mcs1+1 };
    }
},



    "Changing freq":
function() {
    // freq1 is in Hz
    freq1 += 0.2e6;
    if(freq1 > freq_max1)
        freq1 = freq_min1;

    return { freq1: freq1 };
},


    "Changing bw":
function() {
    bw1 += 0.02e6;
    if(bw1 > bw_max1)
        bw1 = bw_min1;

    return { bw1: bw1 };
},



    "Changing gn":
function() {
    gn1 += 0.5;
    if(gn1 > gn_max1)
        gn1 = gn_min1;

    return { gn1: gn1 };
},


    "Changing mcs":
function() {

    if(typeof userData.t === undefined)
        userData.t = 0.0;

    userData.t += dt;

    if(userData.t < 3.0) return;

    // Reset timer, keeping remainder.
    userData.t -= 3.0;

    mcs1 += 1;
    if(mcs1 > mcs_max1)
        mcs1 = mcs_max1;

    return { mcs1: mcs1 };
},


    "Changing mcs with bits out":
function() {

    function reset() {
        userData.t = 0.0;
        userData.done = false;
        userData.lastBits = rate1 * dt;
    }

    if(init)
        reset();

    if(userData.done) return;

    userData.t += dt; // in seconds

    const measureT = 5.0;

    if(userData.t < measureT) return;

    // Total bits over 5 seconds.
    var dBits = rate1 * dt - userData.lastBits;

    console.log("   dBits=" + dBits);

    reset();

    if(dBits < 1000) {
        // Bummer, not thinking any more.
        userData.done = true;
        return { mcs1: mcs1-1 };
    }

    if(mcs1 < mcs_max1) {
        // so try for more throughput.
        return { mcs1: mcs1+1 };
    }

    // or not.

},


    "freq -- Random walk frequency example":
function() {

    // Random walk frequency example
 
    // Initialize / update userData.freq1, used to set freq1 (freq1 is in Hz)
    if(init)
        userData.freq1 = 1780e6;
    else
        userData.freq1 += -2e6 + 4e6*Math.random();
    
    if((userData.freq1 > 1820e6 )|| (userData.freq1 < 1780e6))
        userData.freq1 = 1780e6;
        
    // userData is automatically saved.
    return { freq1: userData.freq1 };
},


    "Blank":
function() {

    // Paste your code in here.

}



};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
