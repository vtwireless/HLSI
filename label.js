/**
 * Generate a signal HTML display label
 *
 * @param {Signal Object}
 * @param {String} signal par - name of variable or method to compute for label;
 *                        example "freq".  May be 'freq', 'bw', 'gn', 'mcs' and 'rate'
 * @param {Object options}
 *
 *     element:  CSS node selector as a string or
 *               HTML element output node
 *
 *     prefix:  prefix String. You may want to have a space on the end.
 *
 *     suffix:  suffix String. You may want to have a space in the first
 *              character.
 *
 *     func:    user custom function(val) to change the string in the
 *              element.
 *
 */
function Label(sig, par, opts = null, append_to_id=null) {

    var output; // The HTML element that has a value to display
    var scale,
        unitPrefix, // example: scale = 1000  unitPrefix = 'M'
        unit; // example: "Hz"
    var prefix = "", suffix = "";

    var func = null;
    if(opts && opts.func !== undefined)
        func = opts.func;


    // This parseValue() get values turned into a string for most
    // types of par (parameters), but for "mcs" we change it below.
    //
    var parseValue = function(val) {
        return d3.format(".2f")(val * scale);
    };

    //////////////////////////////////////////////////////////
    //   Parse options (opts):
    //////////////////////////////////////////////////////////
    if(!opts)
        // Setup default options:
        opts = {};

    if(opts.element !== undefined) {
        if(typeof(opts.element) === "string") {
            output = document.querySelector(opts.element);
            if(output === null) {
                let msg = "Failed to get element with selector: " +
                    opts.element;
                console.log(msg);
                alert(msg);
                return;
            }
        } else
            output = opts.element;
    } else {
        output = document.createElement("OUTPUT");
        let p = document.createElement("p");
        p.appendChild(output);
        // document.body.appendChild(p);

        if(append_to_id !== null){
            document.getElementById(append_to_id).appendChild(p);
        }
        else{
            document.body.appendChild(p);
        }
    }

    if(opts.prefix !== undefined)
        prefix = opts.prefix;
    if(opts.suffix !== undefined)
        suffix = opts.suffix;
    //
    // opts done.
    //////////////////////////////////////////////////////////


    if(func) {

        // We let par be an array of parameters if the user passed in a
        // user custom string generator function.

        if(!Array.isArray(par))
            // This called a user custom string generator with one
            // signal parameter.
            sig.onChange(par, function(s, val) {
                output.value = prefix + func(val) + suffix;
            });
        else
            par.forEach(function(p) {
                sig.onChange(p, function(s, val) {
                    output.value = prefix + func(val) + suffix;
                });
            });

        return;
    }

    
    // TODO: This shares some code with sliders.js.  Merge it into common
    // code.
    switch(par) {
        case 'freq':
            [scale, unitPrefix] = scale_units(sig[par + "_init"], 0.1);
            unit = 'Hz';
            break;
        case 'bw':
            [scale, unitPrefix] = scale_units(sig[par + "_init"], 1.0);
            unit = 'Hz';
            break;
        case 'mcs':
            scale = 1.0;
            unitPrefix = '';
            unit = '';
            parseValue = function(val) {
                if(val < 0)
                    val = 0;
                else if(val > 11)
                    val = 11;
                return conf.schemes[parseInt(val)].name;
            };
            break;
        case 'gn':
            scale = 1.0;
            unitPrefix = '';
            unit = 'dB';
            break;
        case 'sinr':
            unitPrefix = '';
            scale = 1.0;
            unit = 'dB';
            break;
        case 'rate':
            // For 'rate' scale and unitPrefix can change as we go, so
            // we finish it here, because this case is not like the
            // others.
            sig.onChange(par, onChange = function(s, val) {
                [scale, unitPrefix] = scale_units(val, 1.0);
                output.value = prefix + parseValue(val) + " " +
                    unitPrefix + 'bits/s' + suffix;
            });
            return;
    }

    // Mung the strings into one suffix string.
    suffix = " " + unitPrefix + unit + suffix;

    // add callback attached to that variable/parameter
    sig.onChange(par, onChange = function(s, val) {
        output.value = prefix + parseValue(val) + suffix;
    });
}
