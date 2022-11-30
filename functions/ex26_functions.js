
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


    "RFFE-Aware 1":
function() {
    if(init){
        return {
          freq1: freq1,
          freq2: freq1,
          freq3: freq1,
          freq4: freq1,
        }
    }
     
    let newfreq1 = freq1;
    
    /*if((rate1 < 1) ||
    
          (Math.abs(newfreq1-freq2) < Math.max(bw1,bw2)) ||
    
          (Math.abs(newfreq1-freq3) < Math.max(bw1,bw3)) ||
    
          (Math.abs(newfreq1-freq4) < Math.max(bw1,bw4))){
    
               newfreq1 = newfreq1 + 2e5;
    
               newfreq1 = 1785e6 + ((newfreq1 - 1785e6) % (1815e6 - 1785e6));
    
      console.log(newfreq1);
    
    }*/
     
    
    let newfreq2 = freq2;
    if((rate2 < 1) ||
          (Math.abs(newfreq2-newfreq1) < Math.max(bw2,bw1)) ||
          (Math.abs(newfreq2-freq3) < Math.max(bw2,bw3)) ||
          (Math.abs(newfreq2-freq4) < Math.max(bw2,bw4))){
         newfreq2 = newfreq2 + 4e5;
         newfreq2 = 1785e6 + ((newfreq2 - 1785e6) % (1815e6 - 1785e6));
    }
    
    let newfreq3 = freq3;
    if((rate3 < 1) ||
          (Math.abs(newfreq3-newfreq1) < Math.max(bw3,bw1)) ||
          (Math.abs(newfreq3-newfreq2) < Math.max(bw3,bw2))||
          (Math.abs(newfreq3-freq4) < Math.max(bw3,bw4))){
         newfreq3 = newfreq3 + 6e5;
         newfreq3 = 1785e6 + ((newfreq3 - 1785e6) % (1815e6 - 1785e6));
    
    }
    
    let newfreq4 = freq4;
    
    if((rate4 < 1) ||
          (Math.abs(newfreq4-newfreq1) < Math.max(bw4,bw1)) ||
          (Math.abs(newfreq4-newfreq2) < Math.max(bw4,bw2)) ||
          (Math.abs(newfreq4-newfreq3) < Math.max(bw4,bw3))){
         newfreq4 = newfreq4 + 8e5;
         newfreq4 = 1785e6 + ((newfreq4 - 1785e6) % (1815e6 - 1785e6));
    }
    
    return{
        freq1: newfreq1,
        freq2: newfreq2,
        freq3: newfreq3,
        freq4: newfreq4,
    }
},


    "Adapt mcs1":
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



    "Largest contiguous interference-free sub-band":
function() {
    // Make Signal 1 occupy the largest contiguous interference-free sub-band
    // freq1 and freq2 are in Hz
    // freq2 and bw2 are assumed to be known

    var mid_freq = freq_min1 + (freq_max1 - freq_min1)/2.0;

    if(freq2 > mid_freq) {
        freq1 = (freq2 - bw2/2.0 + freq_min1)/2.0;
        bw1 = 2.0*(freq1 - freq_min1);
    } else {
        freq1 = (freq2 + bw2/2.0 + freq_max1)/2.0;
        bw1 = 2.0*(freq_max1 - freq1);
    };

    // We have limited bandwidth.
    if(bw1 > bw_max1)
        bw1 = bw_max1;
    else if(bw1 < bw_min1)
        bw1 = bw_min1;
    else
        bw1 = bw1-3e6; // Adding a guard band to prevent overlap

   return { freq1: freq1, bw1: bw1 };
},



    "Changing freq1":
function() {
    // freq1 is in Hz
    freq1 += 0.2e6;
    if(freq1 > freq_max1)
        freq1 = freq_min1;

    return { freq1: freq1 };
},



    "Changing freq2":
function() {
    freq2 += 0.04e6;
    if(freq2 > freq_max2)
        freq2 = freq_min2;

    return { freq2: freq2 };
},

    "Changing freq3":
function() {
    freq3 += 0.04e6;
    if(freq3 > freq_max3)
        freq3 = freq_min3;

    return { freq3: freq3 };
},

        "Changing freq4":
function() {
    freq4 += 0.04e6;
    if(freq4 > freq_max4)
        freq4 = freq_min4;

    return { freq4: freq4 };
},


    "Changing bw1":
function() {
    bw1 += 0.02e6;
    if(bw1 > bw_max1)
        bw1 = bw_min1;

    return { bw1: bw1 };
},


    "Changing bw2":
function() {
    bw2 += 0.02e6;
    if(bw2 > bw_max2)
        bw2 = bw_min2;

    return { bw2: bw2 };
},


    "Changing bw3":
function() {
    bw3 += 0.02e6;
    if(bw3 > bw_max3)
        bw3 = bw_min3;

    return { bw3: bw3 };
},


    "Changing bw4":
function() {
    bw4 += 0.02e6;
    if(bw4 > bw_max3)
        bw4 = bw_min3;

    return { bw4: bw4 };
},



    "Changing gn1":
function() {
    gn1 += 0.5;
    if(gn1 > gn_max1)
        gn1 = gn_min1;

    return { gn1: gn1 };
},


"Changing gn2":
function() {
    // Note this gain change is to low to have an effect.
    // libUHD will not change the gain this small amount.
    gn2 += 0.2;
    if(gn2 > gn_max2)
        gn2 = gn_min2;

    return { gn2: gn2 };
},



    "Changing gn3":
function() {
    // Note this gain change is to low to have an effect.
    // libUHD will not change the gain this small amount.
    gn3 += 0.2;
    if(gn3 > gn_max3)
        gn3 = gn_min3;

    return { gn3: gn3 };
},


    "Changing gn4":
function() {
    // Note this gain change is to low to have an effect.
    // libUHD will not change the gain this small amount.
    gn4 += 0.2;
    if(gn4 > gn_max4)
        gn4 = gn_min4;

    return { gn4: gn4 };
},


    "Changing mcs1":
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

"Changing mcs2":
function() {

    if(typeof userData.t === undefined)
        userData.t = 0.0;

    userData.t += dt;

    if(userData.t < 3.0) return;

    // Reset timer, keeping remainder.
    userData.t -= 3.0;

    mcs2 += 1;
    if(mcs2 > mcs_max1)
        mcs2 = mcs_max1;

    return { mcs2: mcs2 };
},

"Changing mcs3":
function() {

    if(typeof userData.t === undefined)
        userData.t = 0.0;

    userData.t += dt;

    if(userData.t < 3.0) return;

    // Reset timer, keeping remainder.
    userData.t -= 3.0;

    mcs3 += 1;
    if(mcs3 > mcs_max1)
        mcs3 = mcs_max1;

    return { mcs3: mcs3 };
},

"Changing mcs4":
function() {

    if(typeof userData.t === undefined)
        userData.t = 0.0;

    userData.t += dt;

    if(userData.t < 3.0) return;

    // Reset timer, keeping remainder.
    userData.t -= 3.0;

    mcs4 += 1;
    if(mcs4 > mcs_max1)
        mcs4 = mcs_max1;

    return { mcs4: mcs4 };
},


    "Changing mcs1 with bits out":
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


    "freq1 -- Random walk frequency example":
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
