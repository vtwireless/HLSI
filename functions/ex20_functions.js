
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


    "Naive 1":
function() {
    function reset() {
    
    }

    if(init){
        reset();
    }
},



    "RFFE-Aware 1":
function() {
    function reset() {
    
    }

    if(init){
        reset();
    }
},

    "RFFE-Aware 2":
function() {
    function reset() {
    
    }

    if(init){
        reset();
    }
},
    

    "Naive 2":
function() {
    function reset() {
    
    }

    if(init){
        reset();
    }
},
    



    "Blank":
function() {

    // Paste your code in here.
    return{
        freq1: freq1 + (Math.random()-0.5)*3e6,
        freq2: freq2 + (Math.random()-0.5)*3e6,
        freq3: freq3 + (Math.random()-0.5)*3e6,
        freq4: freq4 + (Math.random()-0.5)*3e6,
        bw1: bw1 + (Math.random()-0.5)*1e6,
        bw2: bw2 + (Math.random()-0.5)*1e6,
        bw3: bw3 + (Math.random()-0.5)*1e6,
        bw4: bw4 + (Math.random()-0.5)*1e6,
    }

}



};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
