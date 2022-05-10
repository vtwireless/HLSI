
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
    if(init){
        return {
          freq1: freq1,
          freq2: freq1,
          freq3: freq1,
          freq4: freq1,
        }
    }
},



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
