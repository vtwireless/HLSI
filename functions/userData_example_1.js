
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
    // function callback(freq1, bw1, gn1, mcs1, bits1, dt, userData, init)
    //



    "userData example: second order freq change":
function() {

  if(init) {
    //// initialize the userData.
    userData.freqRate = (freq_max1 - freq_min1)/20.0;
  } else {
    // second order change
    // i.e. rate changes at constant rate adding to the last value.
    // Note since we use dt the run repeat period will not effect
    // the results so much.  What happens as time gets long?
    // Ans: A strobe effect that will drive you batty.
    //
    // We get the last value it had and we add more to it.  
    userData.freqRate += 600000.0*dt;
  }

  // freq1 is in Hz
  freq1 += userData.freqRate * dt;

  if(freq1 > freq_max1)
    freq1 = freq_min1;

// Open this page with the browser debugger to see console printing.
//
// Remove this print.
console.log("freqRate=" + userData.freqRate + " freq1=" + freq1);

  return { freq1: freq1 };
},



    "Blank":
function() {

    // Paste your code in here.

}



};

