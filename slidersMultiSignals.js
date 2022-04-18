//
// Make parameter changing sliders
//

// The layout order of the sliders depends on the html in the page.

// Arguments
//
//   sig:
//
//      is a conf.sig# thingy, a signal object.
//
//
//   parameter:
//      valid parameter values are "freq", "bw", "gn", "mcs", and "noise".
//
//   n:
//      is an HTML INPUT range element or a CSS node selector
//      or null and a HTML <p> and <input> range element are created
//      and appended to the body.

function Slider(sig, parameter, n = null, append_to_id=null) {
  {
    let gotPar = false;

    ["freq", "bw", "gn", "mcs", "noise"].forEach(function (par) {
      if (parameter === par) {
        gotPar = true;
        return;
      }
    });

    if (gotPar === false) {
      console.log("Invalid parameter type: " + parameter);
      return;
    }
  }

  if (typeof n === "string") n = document.querySelector(n);
  if (!n) {
    // make an HTML INPUT element
    n = document.createElement("INPUT");
    n.type = "range";
    let p = document.createElement("p");
    
    
    p.appendChild(n);
    
    if(append_to_id !== null){
      document.getElementById(append_to_id).appendChild(p);
    }
    else{
      document.body.appendChild(p);
    }
    
    
    
  }

  if (n.type !== "range") {
    // TODO: This is not really needed, or is it?
    console.log("Cannot setup slider of type=" + n.type);
    return;
  }

  // Example:
  //
  //   makeSlider(conf.sig1, inputNode, "Frequency", "freq", 0.1, "Hz");
  //
  //     or
  //
  //   makeSlider(conf.sig1, inputNode, "Frequency", "freq", 0.1,
  //           function(sig,val){ return "units"; });
  //
  // This adds html labels to the input range slider and sets up it's
  // limits base on its' signal limits, and adds callbacks for when the
  // value changes from the slider being moved or the slider value is
  // changed from outside the slider.
  //
  function makeSlider(
    sig,
    n,
    labelText,
    par,
    unitScale,
    unit /*string or callback that returns a string*/
  ) {
    if (sig.name.length > 0) labelText = sig.name + " " + labelText;

    // set range INPUT limit attributes
    n.min = sig[par + "_min"]; // example: sig.freq_min
    n.max = sig[par + "_max"];
    n.step = sig[par + "_step"];
    n.value = sig[par];

    // Prefix this input with a label.
    let label = document.createElement("label");
    // We do not care what the node id was, we just need it to be
    // unique for this page.
    if (n.id.length < 1) n.id = par + "__SiLder_zx_" + Slider.nodeCount++;
    //console.log("      nod ID=" + n.id);

    label.setAttribute("for", n.id);
    label.appendChild(document.createTextNode(labelText));
    n.parentNode.prepend(label);

    // Suffix this input with a output label.
    let output = document.createElement("output");
    output.setAttribute("for", n.id);
    n._output = output;
    n.parentNode.append(output);

    n.className = "slider_bw";

    var parseValue = parseFloat;
    if (par === "mcs") parseValue = parseInt;

    // When this slider moves we must update.
    // TODO: make this a more generic interface.
    n.oninput = function () {
      // Set the varying parameter.  For example: sig.freq
      // This calls the parameter setter.
      sig[par] = parseValue(n.value);
    };

    if (typeof unit === "string") {
      var [scale, units] = scale_units(sig[par + "_init"], unitScale);
      units = " " + units + unit;

      if (sig[par + "_scale"] !== undefined) {
        scale = sig[par + "_scale"];
        units = " " + unit;
      }

      var outputUnitsCallback = function (sig, val) {
        return d3.format(".2f")(val * scale) + units;
      };
    }
    // In this case unit is a function.
    else var outputUnitsCallback = unit;

    sig.onChange(par, function (sig, val) {
      n.value = val;
      output.value = outputUnitsCallback(sig, val);
    });

    // Initialize.
    n.oninput();
    output.value = outputUnitsCallback(sig, sig[par]);

    //console.log("Made slider id=" + n.id + " :\n" + n.parentNode.innerHTML);
  }

  switch (parameter) {
    case "freq": // signal frequency - input range slider
      makeSlider(sig, n, "Frequency", parameter, 0.1, "Hz");
      break;
    case "bw": // signal bandwidth - input range slider
      makeSlider(sig, n, "Bandwidth", parameter, 1.0, "Hz");
      break;
    case "gn": // signal gain - input range slider
      makeSlider(sig, n, "Gain", parameter, 1.0, "dB");
      break;
    case "mcs": // modulation scheme - input range slider
      makeSlider(sig, n, "Mod Code", parameter, 1.0, function (sig, val) {
        //console.log("val=" + val);
        return (
            conf.schemes[val].name + " (" +
            d3.format(".2f")(conf.schemes[val].rate) + " b/s/Hz)"
        );
      });
      break;
    case "noise": // noise floor 'volume' - emulated by gain value
      makeSlider(sig, n, "Noise", "gn", 0.1, " dB/Hz");
      break;
    default:
      // This should not happen.
      console.log("Cannot setup slider of kind name=" + parameter);
      break;
  }
}

Slider.nodeCount = 0;
