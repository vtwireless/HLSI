/**
 * Generate display label, which updates on changes to signal variables
 * @param {Signal[]} signalArray - Array of signals related to computation of display variable
 * @param {Array[String[]]} valuesWatched - what values to add callback func onto within the signals
 * @param {String} computedElement - name of variable to compute for label
 * @param {*} [n=null] - display element
 */
function Label(signalArray, valuesWatched, computedElement, n = null) {

  if (!n) { // nullcheck
    n = document.createElement("OUTPUT");
    n.value = computedElement;
    let p = document.createElement("p");
    p.appendChild(n);
    document.body.appendChild(p);
  }


  // For each signal that needs to be watched, check what values
  // need to be watched by iterating through the string array at 
  // the index of the current signal in signalArray
  signalArray.forEach(function (signal, sigIndex) {
    // grab the str array we want, then execute on each in that array
    valuesWatched[sigIndex].forEach(function (valToWatch) {
      // add callback attached to that var
      signal.addSetterCallback(valToWatch, updateLabel);
    });
  });

  // note that argument names are nonsensical here
  function updateLabel(signal, sigIndex) {
    switch (computedElement) {
      case "SNR":
        // hardcoded to treat 2nd signal (1) as noise
        n.value = signalArray[0].computeSNR(signalArray[1]);
        break;
      default:
        break;
    }
  }
}