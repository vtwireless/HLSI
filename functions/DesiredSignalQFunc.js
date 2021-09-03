
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
    "Normal Q-Function":

function() {

bw_margin = globalUserData.bw_margin;  //Defines the bandwidth margin; Please Keep Constant
start_freq = freq_min2 + bw_margin;   //Defines the eligible range of frequencies; Please Keep Constant
end_freq = freq_max2 - bw_margin;  //Defines the eligible range of frequencies; Please Keep Constant
num_channels  = globalUserData.num_channels; // Defines the number of channels; Please keep constant
qfunc = globalUserData.qfunc; 
available_freq = makeArr(start_freq, end_freq, num_channels) // Create Channels
numberOfBestChannelsToUse = 4; //Number of channels to seelct as best channels

//console.log(num_channels)


var len = qfunc.length; // Number of channels - It is fixed at 8
var indices = new Array(len);
for (var i = 0; i < len; ++i) indices[i] = i;


decaying_constant  = globalUserData.decaying_constant;  // 
minimum_epsilon  = globalUserData.minimum_epsilon;

minimum_epsilon = 0.25; // This is the cut-off point. After this point, the Algo selects the best channels
decaying_constant = 0.99;  // How fast should the exploration decay.
learning_rate = 0.9; // How fast should we learn
// At every time step  - epsilon = decaying_constant**countNumberOfIterations
// When epsilon < minimum_epsilon; exploration stops


if(init){

 	epsilon  = decaying_constant;
	countNumberOfIterations = 0
	ind1 = 0;
	ind2 = globalUserData["ind2"]
	nextFreq2 = available_freq[ind2];
	checkIfStopped = 1
}
else{

	ind2 = globalUserData["ind2"]
	nextFreq2 = available_freq[ind2];
	prob_epsilon = Math.random();

	
	if ((epsilon > minimum_epsilon ) ){

		//available_freq = makeArr(start_freq, end_freq, num_channels)
		ind1 = getRandomInt(num_channels)
		nextFreq1 = available_freq[ind1]	

 	}
	else{
		indices.sort(function (a, b) { return (qfunc[a] > qfunc[b]) ? -1 : ((qfunc[a] < qfunc[b]) ? 1 : 0); }); // Sort the Q-values
		slicedQfunc = indices.slice(0,numberOfBestChannelsToUse) // Get the best channels
		len_slicedQfunc = slicedQfunc.length // Get the number of best channels
		ind1slicedQfunc = slicedQfunc[getRandomInt(len_slicedQfunc)] // Randomly select a channel from the best channels
		nextFreq1 = available_freq[ind1slicedQfunc]	// Randomly select a channel from the best channels
		epsilon = decaying_constant*epsilon; //decay epsilon value

	}
	if ((epsilon <= minimum_epsilon )  & (checkIfStopped == 1) ){
		checkIfStopped = 0 // Stop Exploration
		//console.log("Exploring Stopped")
		//console.log(countNumberOfIterations)
		alert("Exploring Stopped");
	}
	
	console.log("Q function" + qfunc)

	epsilon = decaying_constant**countNumberOfIterations; //decay epsilon value
	countNumberOfIterations = countNumberOfIterations +1 // Count Number of iterations
    freq2 = nextFreq2;
    freq1 = nextFreq1;
	
}

if (freq1 == freq2){
	qfunc[ind1] = qfunc[ind1] +learning_rate*(-1 + qfunc[ind1] ); // Update Q-Value Function
}
	
globalUserData.qfunc = qfunc;


return {  freq1: freq1 };
},



    "":

function() {


},


};

