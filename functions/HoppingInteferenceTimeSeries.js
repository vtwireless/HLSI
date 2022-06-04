
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
}//

function createLowerInteference(length) {
  var arr = [];

	for (var i = 0; i < length; i++) {
		//if(i % 2 === 0) { // index is even
	    if(i < (length/2)) { // interferer uses the first half of the set of available channels
			arr.push(i);
		}
	}
	return arr;
}

function createUpperInteference(length) {
  var arr = [];

	for (var i = 0; i < length; i++) {
		//if(i % 2 === 0) { // index is even
	    if(i >= (length/2)) { // interferer uses the first half of the set of available channels
			arr.push(i);
		}
	}
	return arr;
}

function createOddInteference(length) {
  var arr = [];

	for (var i = 0; i < length; i++) {
		if(i % 2 === 0) { // index is even
	    //if(i < (length/2)) { // interferer uses the first half of the set of available channels
			arr.push(i);
		}
	}
	return arr;
}

function createEvenInteference(length) {
  var arr = [];

	for (var i = 0; i < length; i++) {
		if(i % 2 != 0) { // index is even
	    //if(i < (length/2)) { // interferer uses the first half of the set of available channels
			arr.push(i);
		}
	}
	return arr;
}

function randomChoice(p) {
    let rnd = p.reduce( (a, b) => a + b ) * Math.random();
    return p.findIndex( a => (rnd -= a) < 0 );
}

//var sorted = qfunc.slice().sort(function(a,b){return b-a})
//var ranks = qfunc.map(function(v){ return sorted.indexOf(v)+1 });

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



    "Frequency hopping Interference with Periodic Hopping Sequence":

function() {
bw_margin = globalUserData.bw_margin;  //Defines the bandwidth margin; Please Keep Constant
start_freq = freq_min2 + bw_margin;   //Defines the eligible range of frequencies; Please Keep Constant
end_freq = freq_max2 - bw_margin;  //Defines the eligible range of frequencies; Please Keep Constant
num_channels  = globalUserData.num_channels; // Defines the number of channels; Please keep constant
available_freq = makeArr(start_freq, end_freq, num_channels) // Create Channels

globalUserData['timeForML'] = globalUserData['timeForML'] + 1 // Update Current Time
timeForML = globalUserData['timeForML'] // Get current Time

timeScaleForML = 8 // Set Time scale
globalUserData['timeScaleForML'] = timeScaleForML; // Get Time scale


hoppingVector = [0,1,2,3,4,5,6,7] // Frequency channels to be occupied during consecutive time slots


if(init){
               qfunc = Array(globalUserData['timeScaleForML']).fill(0).map(x => Array(num_channels).fill(0))
               globalUserData['qfunc'] = qfunc;
}
 

ind2 = hoppingVector[Math.round(timeForML % timeScaleForML)];
globalUserData["ind2"] = ind2
freq2 = available_freq[ind2];


if(freq2 > freq_max2)
    freq2 = freq_max2;
else if(freq2 < freq_min2)
    freq2 = freq_min2;
 

return { freq2: freq2, freq1: freq1 };
},


    "Probabilistic Frequency-hopping Interference":

function() {



bw_margin = globalUserData.bw_margin;  //Defines the bandwidth margin; Please Keep Constant
start_freq = freq_min2 + bw_margin;   //Defines the eligible range of frequencies; Please Keep Constant
end_freq = freq_max2 - bw_margin;  //Defines the eligible range of frequencies; Please Keep Constant
num_channels  = globalUserData.num_channels; // Defines the number of channels; Please keep constant
available_freq = makeArr(start_freq, end_freq, num_channels) // Create Channels

globalUserData['timeForML'] = globalUserData['timeForML'] + 1 // Update Current Time
timeForML = globalUserData['timeForML'] // Get current Time
timeScaleForML = 8 // Set Time scale
globalUserData['timeScaleForML'] = timeScaleForML; // Get Time scale


hoppingVector = [0.1/6, 0.1/6, 0.1/6, 0.4, 0.5, 0.1/6, 0.1/6,0.1/6]
hoppingVector = [0, .5, 0, 0, .5, 0, 0, 0];


if(init){
	qfunc = Array(globalUserData['timeScaleForML']).fill(0).map(x => Array(num_channels).fill(0))
	globalUserData['qfunc'] = qfunc;

	ind2 = randomChoice(hoppingVector)
	
	available_freq = makeArr(start_freq, end_freq, num_channels)
	globalUserData["ind2"] = ind2

}
else{

	ind2 = randomChoice(hoppingVector)	

	randomNum2 = available_freq[ind2];
	globalUserData["ind2"] = [ind2];
    freq2 = randomNum2;
}

if(freq2 > freq_max2)
    freq2 = freq_max2;
else if(freq2 < freq_min2)
    freq2 = freq_min2;


return { freq2: freq2, freq1: freq1 };

},

};

