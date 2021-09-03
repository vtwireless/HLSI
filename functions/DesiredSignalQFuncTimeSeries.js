
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

const deepCopyFunction = (inObject) => {
  let outObject, value, key

  if (typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopyFunction(value)
  }

  return outObject
}



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
qfunc = globalUserData.qfunc;  // Define Qfunction
available_freq = makeArr(start_freq, end_freq, num_channels) // Create Channels


timeForML = globalUserData['timeForML'] // Get current Time
timeScaleForML = globalUserData['timeScaleForML']; // Get Time scale


if ((timeForML % timeScaleForML  ) === 1){	
	currentTimeForML=  0;
	console.log("Desired Multiple of 1")
	console.log("Channel 2 " + globalUserData["ind2"])

}
else if ((timeForML % timeScaleForML ) === 2){	
	currentTimeForML=  1;
	console.log("Desired Multiple of 2")
	console.log("Channel 2 " + globalUserData["ind2"])
}
else if ((timeForML % timeScaleForML ) === 3){	
	currentTimeForML=  2;
	console.log("Desired Multiple of 3")
	console.log("Channel 2 " + globalUserData["ind2"])
}
else if ((timeForML % timeScaleForML ) === 0){	
	if (timeScaleForML === 8){
		currentTimeForML=  7;
	}
	else {
		currentTimeForML=  3;
	}
	
	console.log("Desired Multiple of 4")
	console.log("Channel 2 " + globalUserData["ind2"])

}
else if ((timeForML % timeScaleForML  ) === 4){	
	currentTimeForML=  3;
	console.log("Desired Multiple of 1")
	console.log("Channel 2 " + globalUserData["ind2"])

}
else if ((timeForML % timeScaleForML ) === 5){	
	currentTimeForML=  4;
	console.log("Desired Multiple of 2")
	console.log("Channel 2 " + globalUserData["ind2"])
}
else if ((timeForML % timeScaleForML ) === 6){	
	currentTimeForML=  5;
	console.log("Desired Multiple of 3")
	console.log("Channel 2 " + globalUserData["ind2"])
}
else if ((timeForML % timeScaleForML ) === 7){	
	currentTimeForML=  6;
	console.log("Desired Multiple of 3")
	console.log("Channel 2 " + globalUserData["ind2"])
}

else	
{
	alert("Error")
}
	

qfunc = globalUserData.qfunc; 
currentQfunc = deepCopyFunction(qfunc[currentTimeForML]);
//num_channels = 8
//console.log(num_channels)


var len = currentQfunc.length;
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
	randomNum2 = available_freq[ind2];
	checkIfStopped = 1



}
else{

	ind2 = globalUserData["ind2"]
	randomNum2 = available_freq[ind2];
	prob_epsilon = Math.random();

	
	if ((epsilon > minimum_epsilon ) ){

		ind1 = getRandomInt(num_channels)
		randomNum1 = available_freq[ind1]	

 	}
	else{
		indices.sort(function (a, b) { return (currentQfunc[a] > currentQfunc[b]) ? -1 : ((currentQfunc[a] < currentQfunc[b]) ? 1 : 0); });// Sort the Q-values
		slicedQfunc = indices.slice(0,4)  // Get the best channels
		len_slicedQfunc = slicedQfunc.length // Get the number of best channels
		ind1slicedQfunc = slicedQfunc[getRandomInt(len_slicedQfunc)] // Randomly select a channel from the best channels
		randomNum1 = available_freq[ind1slicedQfunc]	 // Randomly select a channel from the best channels
		epsilon = decaying_constant*epsilon; //decay epsilon value

	}
	if ((epsilon <= minimum_epsilon )  & (check // Stop ExplorationIfStopped == 1) ){
		checkIfStopped = 0
		//console.log("Exploring Stopped")
		//console.log(countNumberOfIterations)
		alert("Exploring Stopped");
	}
	
	console.log("Q function" + currentQfunc)

	epsilon = decaying_constant**countNumberOfIterations; //decay epsilon value
	countNumberOfIterations = countNumberOfIterations +1 // Count Number of iterations
    freq2 = randomNum2;
    freq1 = randomNum1;
	
}

if (freq1 == freq2){
	currentQfunc[ind1] = currentQfunc[ind1] +0.9*(-1 + currentQfunc[ind1] );
}

qfunc[currentTimeForML] = deepCopyFunction(currentQfunc)
globalUserData.qfunc = qfunc; // Pass qfunction

console.log(qfunc[3])
return {  freq1: freq1 };
},



    "Normal Q-Function - Contiguous Bandwidth":

function() {

bw_margin = globalUserData.bw_margin; 
//bw_margin = 2.5e6
start_freq = freq_min2 + bw_margin;
end_freq = freq_max2 - bw_margin;
num_channels  = globalUserData.num_channels; // Defines the number of channels; Please keep constant
timeForML = globalUserData['timeForML']
timeScaleForML = globalUserData['timeScaleForML'];


if ((timeForML % timeScaleForML  ) === 1){	
	currentTimeForML=  0;
	//console.log("Desired Multiple of 1")
	//console.log("Channel 2 " + globalUserData["ind2"])

}
else if ((timeForML % timeScaleForML ) === 2){	
	currentTimeForML=  1;
	//console.log("Desired Multiple of 2")
	//console.log("Channel 2 " + globalUserData["ind2"])
}
else if ((timeForML % timeScaleForML ) === 3){	
	currentTimeForML=  2;
	//console.log("Desired Multiple of 3")
	//console.log("Channel 2 " + globalUserData["ind2"])
}
else if ((timeForML % timeScaleForML ) === 0){	
	if (timeScaleForML === 8){
		currentTimeForML=  7;
	}
	else {
		currentTimeForML=  3;
	}
	
	//console.log("Desired Multiple of 4")
	//console.log("Channel 2 " + globalUserData["ind2"])

}
else if ((timeForML % timeScaleForML  ) === 4){	
	currentTimeForML=  3;
	//console.log("Desired Multiple of 1")
	//console.log("Channel 2 " + globalUserData["ind2"])

}
else if ((timeForML % timeScaleForML ) === 5){	
	currentTimeForML=  4;
	//console.log("Desired Multiple of 2")
	//console.log("Channel 2 " + globalUserData["ind2"])
}
else if ((timeForML % timeScaleForML ) === 6){	
	currentTimeForML=  5;
	//console.log("Desired Multiple of 3")
	//console.log("Channel 2 " + globalUserData["ind2"])
}
else if ((timeForML % timeScaleForML ) === 7){	
	currentTimeForML=  6;
	//console.log("Desired Multiple of 3")
	//console.log("Channel 2 " + globalUserData["ind2"])
}

else	
{
	alert("Error")
}
	

qfunc = globalUserData.qfunc; 
currentQfunc = deepCopyFunction(qfunc[currentTimeForML]);
//num_channels = 8
//console.log(num_channels)


var len = currentQfunc.length;
var indices = new Array(len);
for (var i = 0; i < len; ++i) indices[i] = i;


decaying_constant  = globalUserData.decaying_constant;  // 
//epsilon  = globalUserData.epsilon;  
minimum_epsilon  = globalUserData.minimum_epsilon;

//minimum_epsilon = 0.25;
//decaying_constant = 0.99;  





if(init){



 	epsilon  = decaying_constant;
	countNumberOfIterations = 0
	ind1 = 0;
	ind2 = globalUserData["ind2"]
	randomNum2 = available_freq[ind2];
	var saveIndArr = new Array(num_channels).fill(0);

	checkIfStopped = 1
	storeBw1 = bw1;



}
else{

	ind2 = globalUserData["ind2"]
	randomNum2 = available_freq[ind2];
	prob_epsilon = Math.random();

	
	if ((epsilon > minimum_epsilon ) ){
		ind1 = getRandomInt(num_channels)
		randomNum1 = available_freq[ind1]	
 	}
	else{
		currentQfunc = deepCopyFunction(qfunc[currentTimeForML]);
		indices.sort(function (a, b) { return (currentQfunc[a] > currentQfunc[b]) ? -1 : ((currentQfunc[a] < currentQfunc[b]) ? 1 : 0); });
		slicedQfunc = indices.slice(0,4)

		saveInd = slicedQfunc[0];
		for (var indSliced = 1; indSliced < 4; ++indSliced){

			if (Math.abs(slicedQfunc[indSliced] - saveInd) == 1 ){
				console.log("Previous: " + saveInd + " Next: " + indSliced )

				break;
			}
			else
				saveInd = slicedQfunc[indSliced]
		}
		len_slicedQfunc = slicedQfunc.length
		ind1slicedQfunc = slicedQfunc[getRandomInt(len_slicedQfunc)]
		
		ind1slicedQfunc1 = slicedQfunc[saveInd]; 
		ind1slicedQfunc2 = slicedQfunc[saveInd+1]; 
		randomNum1_1 = available_freq[ind1slicedQfunc1]	
		randomNum1_2 = available_freq[ind1slicedQfunc2]
		randomNum1 = (randomNum1_1 + randomNum1_2)/2;
		//console.log("Log Indices" + slicedQfunc)
		//console.log("Log ind1slicedQfunc1" + ind1slicedQfunc1)

		//randomNum1 = available_freq[ind1slicedQfunc]
		//bw1 =  storeBw1 *10;
		bw1 =  storeBw1 *54.2;
		//console.log("Bandwidth" + bw1)

		
		epsilon = decaying_constant*epsilon;

	}
	if ((epsilon <= minimum_epsilon )  & (checkIfStopped == 1) ){
		checkIfStopped = 0
		//console.log("Exploring Stopped")
		//console.log(countNumberOfIterations)
		alert("Exploring Stopped");
	}
	
	//console.log("Q function" + currentQfunc)

	epsilon = decaying_constant**countNumberOfIterations;
	countNumberOfIterations = countNumberOfIterations +1
    freq2 = randomNum2;
    freq1 = randomNum1;
	
}

if (freq1 == freq2){
	currentQfunc[ind1] = currentQfunc[ind1] +0.9*(-1 + currentQfunc[ind1] );
}

qfunc[currentTimeForML] = deepCopyFunction(currentQfunc)
globalUserData.qfunc = qfunc;

console.log(qfunc[3])
return {  freq1: freq1, bw1:bw1 };
},



};

