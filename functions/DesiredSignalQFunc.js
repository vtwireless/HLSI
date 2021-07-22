
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
    "Interference Uses Lower Channels":

function() {

bw_margin = userData.bw_margin; 
bw_margin = 2.5e6
start_freq = freq_min2 + bw_margin;
end_freq = freq_max2 - bw_margin;
num_channels  = userData.num_channels; // Defines the number of channels; Please keep constant
num_channels = 8
console.log(num_channels)


var len = qfunc.length;
var indices = new Array(len);
for (var i = 0; i < len; ++i) indices[i] = i;

if(init){

	inteferenceIndex = createLowerInteference(num_channels)
	ind2 = getRandomInt(4)
	available_freq = makeArr(start_freq, end_freq, num_channels)


}
else{

	available_freq = makeArr(start_freq, end_freq, num_channels)
	
	ind2 = getRandomInt(4)
	available_freq = available_freq

	randomNum2 = available_freq[inteferenceIndex[ind2]];	
    freq2 = randomNum2;
}

if(freq2 > freq_max2)
    freq2 = freq_max2;
else if(freq2 < freq_min2)
    freq2 = freq_min2;


return { freq2: freq2, freq1: freq1 };
},



    "Interference Uses Upper Channels":

function() {

bw_margin = userData.bw_margin; 
bw_margin = 2.5e6
start_freq = freq_min2 + bw_margin;
end_freq = freq_max2 - bw_margin;
num_channels  = userData.num_channels; // Defines the number of channels; Please keep constant
num_channels = 8
console.log(num_channels)


var len = qfunc.length;
var indices = new Array(len);
for (var i = 0; i < len; ++i) indices[i] = i;

if(init){

	inteferenceIndex = createUpperInteference(num_channels)
	ind2 = getRandomInt(4)
	available_freq = makeArr(start_freq, end_freq, num_channels)


}
else{

	available_freq = makeArr(start_freq, end_freq, num_channels)
	
	ind2 = getRandomInt(4)
	available_freq = available_freq

	randomNum2 = available_freq[inteferenceIndex[ind2]];	
    freq2 = randomNum2;
}

if(freq2 > freq_max2)
    freq2 = freq_max2;
else if(freq2 < freq_min2)
    freq2 = freq_min2;


return { freq2: freq2, freq1: freq1 };
},



    "Interference Uses Even Channels":

function() {

bw_margin = userData.bw_margin; 
bw_margin = 2.5e6
start_freq = freq_min2 + bw_margin;
end_freq = freq_max2 - bw_margin;
num_channels  = userData.num_channels; // Defines the number of channels; Please keep constant
num_channels = 8
console.log(num_channels)


var len = qfunc.length;
var indices = new Array(len);
for (var i = 0; i < len; ++i) indices[i] = i;

if(init){

	inteferenceIndex = createEvenInteference(num_channels)
	ind2 = getRandomInt(4)
	available_freq = makeArr(start_freq, end_freq, num_channels)


}
else{

	available_freq = makeArr(start_freq, end_freq, num_channels)
	
	ind2 = getRandomInt(4)
	available_freq = available_freq

	randomNum2 = available_freq[inteferenceIndex[ind2]];	
    freq2 = randomNum2;
}

if(freq2 > freq_max2)
    freq2 = freq_max2;
else if(freq2 < freq_min2)
    freq2 = freq_min2;


return { freq2: freq2, freq1: freq1 };
},


    "":

function() {


},


};

