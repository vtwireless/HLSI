
// This file is used by ScriptController() in scriptController.js.
//
//
/*************************************************************
 * For example:


  var sig1 = new Signal(conf.sig0, '1');
  var sig2 = new Signal(conf.sig0, '2');

  new ScriptController([sig1, sig2], {
        functionFiles: "functions/dons_wambatML2000_2.js",
        postfix: [ '1', '2' ]
  });


*/


var functions = {

    // We need to convert the body of these functions to strings,
    // hence the odd text layout in these functions, they are
    // pushed to the left side.
    //
    // They are called like so:
    //
    // function callback(freq1, bw1, gn1, mcs1, bits1, freq2, bw2, gn2, mcs2, bits2, dt, userData, init)
    //

    "Changing freq1, bw1, gn1 as an example for Don, change the name of this please":
function() {


// Add more and remove code here.  This is currently just a stupid example.

// Example of using userData to add state (uaserData.df) that is
// preserved between calls.
if(init)
    // This is set in the first call.
    userData.df = 0.1e6;

freq1 += userData.df;
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



    "Blank":
function() {

    // Paste your code in here.

}



};

