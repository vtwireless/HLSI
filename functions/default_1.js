
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
    // function callback(freq1, bw1, gn1, mcs1, bits1, dt, userData, init, globalUserData)
    //

    "Changing freq1, bw1, gn1":
function() {
    
    freq1 += 0.1e6;
    if(freq1 > freq_max1)
        freq1 = freq_min1;

    bw1 += 0.1e6;
    if(bw1 > bw_max1)
        bw1 = bw_min1;

    gn1 += 0.05;
    if(gn1 > gn_max1)
        gn1 = gn_min1;

    return { freq1: freq1, bw1: bw1, gn1: gn1 };
},



    "Changing bw1":
function() {
    // bw1 is in Hz
    bw1 += 0.04e6;
    if(bw1 > bw_max1)
        bw1 = bw_min1;

    return { bw1: bw1 };
},


    "Adapt mcs1":
function() {
 
    // Code to adapt mcs1; waits tTryAgain seconds after the
    // last transmission failure before trying to increase mcs1

    function reset() {
        userData.t = 0.0;
        userData.done = false;
        userData.lastBits = bits1;
    }


    if(init){
        userData.lastLastBits = 0;
        userData.lastBits = bits1;
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
    var dBits = bits1 - userData.lastBits;
 
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


    "Changing freq1":
function() {
    // freq1 is in Hz
    freq1 += 0.04e6;
    if(freq1 > freq_max1)
        freq1 = freq_min1;

    return { freq1: freq1 };
},



    "Blank":
function() {

    // Paste your code in here.

}



};

