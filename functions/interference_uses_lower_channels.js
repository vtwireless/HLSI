
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

function createInteference(length) {
  var arr = [];

	for (var i = 0; i < length; i++) {
		//if(i % 2 === 0) { // index is even
	    if(i < (length/2)) { // interferer uses the first half of the set of available channels
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
    "Interference Uses Upper Channels":

function() {

const start_freq = freq_min2 + 2.5e6;
const end_freq = freq_max2 - 2.5e6;
num_channels  = userData.num_channels; // Defines the number of channels; Please keep constant

decaying_constant  = userData.decaying_constant;  // 
epsilon  = userData.epsilon;  
// Epsilon - Value from zero to one
// This helps decide if the user should use the current optimal channels or 
// Explore for better channels
minimum_epsilon  = userData.minimum_epsilon;
minimum_epsilon = 0.25;
// minimum_epsilon - Value from zero to one
// After this threshold is exceeded, the user only selects the optimal channels.

decaying_constant = 0.99;  
//decaying_constant - Value from zero to one
// At every time interval, the epsilon is updated as follows
// epsilon = epsilon^decaying_constant;
//decaying_constant

var len = qfunc.length;
var indices = new Array(len);
for (var i = 0; i < len; ++i) indices[i] = i;
//indices.sort(function (a, b) { return qfunc[a] > qfunc[b] ? -1 : qfunc[a] > qfunc[b] ? 1 : 0; }); 
// Qlearning Sort - Rank the channels with best qvalues in ascending order 
//console.log(indices);

//
//arr = makeArr(startValue, stopValue, cardinality)
//ind = getRandomInt(cardinality)
	
//randomNum2 = getRandomArbitrary(start_freq,end_freq,2);
//randomNum1 = getRandomArbitrary(start_freq,end_freq,4);







//getRandomArbitrary(start_freq,end_freq,num_channels);
//qfunc[1] = qfunc[1] +1;
// Initialize / update userData.freq2, used to set freq2 (freq2 is in Hz)
if(init){
	//    freq2 = (freq_max2 + freq_min2)/2.0;
    //freq2 = randomNum2;
    //freq1 = randomNum1;
	//console.log("if"+epsilon)
 	epsilon  = decaying_constant;
	num_channels =8;
	countNumberOfIterations = 0
	arr1 = makeArr(start_freq, end_freq, num_channels)
	inteferenceIndex = createInteference(num_channels)
	ind1 = 0;
	ind2 = getRandomInt(4)
	randomNum2 = arr1[inteferenceIndex[ind2]];
	checkIfStopped = 1

	//arr2 = makeArr(start_freq, end_freq, 2)

	//randomNum2 = arr2[ind2]
}
else{
	//console.log(start_freq)
    // Select a random freq2.
    //freq2 += -2.0e5 + 4e5*Math.random();
	//console.log("else"+epsilon)
	
	//ind2 = getRandomInt(4)
	//randomNum2 = arr2[ind2]
	
	ind2 = getRandomInt(4)
	randomNum2 = arr1[inteferenceIndex[ind2]];	
	
	prob_epsilon = Math.random();

	//console.log(epsilon)
	//if ((epsilon > minimum_epsilon ) & (prob_epsilon < epsilon )){
	if ((epsilon > minimum_epsilon ) ){

		arr1 = makeArr(start_freq, end_freq, num_channels)
		ind1 = getRandomInt(num_channels)
		randomNum1 = arr1[ind1]	


		// At every time interval, the epsilon is updated as follows
		// epsilon = epsilon^decaying_constant;
 	}
	else{
		indices.sort(function (a, b) { return (qfunc[a] > qfunc[b]) ? -1 : ((qfunc[a] < qfunc[b]) ? 1 : 0); });
		slicedQfunc = indices.slice(0,4)
		len_slicedQfunc = slicedQfunc.length
		ind1slicedQfunc = slicedQfunc[getRandomInt(len_slicedQfunc)]
		randomNum1 = arr1[ind1slicedQfunc]	
		epsilon = decaying_constant*epsilon;

		//console.log(len_slicedQfunc)
		//console.log("SlicedWrong" + randomNum1)

		//console.log("Wrong" + slicedQfunc)

		//sorted = qfunc.slice().sort(function(a,b){return b-a})
		//ranks = qfunc.map(function(v){ return sorted.indexOf(v)+1 });
	}
	if ((epsilon <= minimum_epsilon )  & (checkIfStopped == 1) ){
		checkIfStopped = 0
		console.log("Exploring Stopped")
		console.log(countNumberOfIterations)
		alert("Exploring Stopped");


	}
	console.log("Q function" + qfunc)

	epsilon = decaying_constant**countNumberOfIterations;
	countNumberOfIterations = countNumberOfIterations +1
    freq2 = randomNum2;
    freq1 = randomNum1;
}
		//console.log(randomNum)

if (freq1 == freq2){
	qfunc[ind1] = qfunc[ind1] +0.9*(-1 + qfunc[ind1] );
}
	
userData.qfunc = qfunc;
userData.epsilon = epsilon;
userData.num_channels = num_channels;

//console.log(qfunc.slice(0,2))


// Check and fix bounds of freq2.
if(freq2 > freq_max2)
    freq2 = freq_max2;
else if(freq2 < freq_min2)
    freq2 = freq_min2;

if(freq1 > freq_max1)
    freq1 = freq_max1;
else if(freq1 < freq_min1)
    freq1 = freq_min1;

return { freq2: freq2, freq1: freq1 };
},



    "Blank":
function() {

    // Paste your code in here dummy.

}



};

