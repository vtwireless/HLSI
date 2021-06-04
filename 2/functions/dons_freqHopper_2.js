
// This file is used by ScriptController() in scriptController.js.
//
//
/*************************************************************
 * For example:


   new ScriptController([sig2], {
            functionFiles: "functions/dons_freqHooper_2.js",
            postfix: [ '2' ]
        });


*/
var functions = {

    // We need to convert the body of these functions to strings,
    // hence the odd text layout in these functions, they are
    // pushed to the left side.
    //
    // They are called like so:
    //
    // function callback(freq2, bw2, gn2, mcs2, bits2, dt, userData, init)
    //
    // Or something like that.
    //
    //
    "Randomly hopping freq2":

function() {

// Initialize / update userData.freq2, used to set freq2 (freq2 is in Hz)
if(init)
    freq2 = (freq_max2 + freq_min2)/2.0;
else
    // Select a random freq2.
    freq2 += -2.0e5 + 4e5*Math.random();



// Check and fix bounds of freq2.
if(freq2 > freq_max2)
    freq2 = freq_max2;
else if(freq2 < freq_min2)
    freq2 = freq_min2;

return { freq2: freq2 };
},



    "Blank":
function() {

    // Paste your code in here dummy.

}



};

