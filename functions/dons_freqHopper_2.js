
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


function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomArbitrary(startValue, stopValue, cardinality){
	arr = makeArr(startValue, stopValue, cardinality)
	ind = getRandomInt(cardinality)
	return arr[ind]
}

function getRandomArbitrary_(startValue, stopValue, cardinality){
	arr = makeArr(startValue, stopValue, cardinality)
	ind = getRandomInt(cardinality)
	return arr[ind]
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}



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

const start_freq = freq_min2 + 5e6;
const end_freq = freq_max2 - 5e6;
randomNum = getRandomArbitrary(start_freq,end_freq,2);

// Initialize / update userData.freq2, used to set freq2 (freq2 is in Hz)
if(init)
//    freq2 = (freq_max2 + freq_min2)/2.0; m
    freq2 = randomNum;

else
    // Select a random freq2.
    //freq2 += -2.0e5 + 4e5*Math.random();
    freq2 = randomNum;
		//console.log(randomNum)




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

