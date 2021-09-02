'use strict';

// We expose just one global configuration object called "conf"
//
// There are a lot of parameters, and there is no way around that.  For
// example you say we can remove parameters by scaling, but that just
// exchanges a physical parameter for a scale parameter, and since the end
// audience are in need to physical parameters we will not lose parameters
// by doing that.  These are real physical things, not relative abstract
// things.  We keep these values so they can be used in both javaScript
// simulated devices, and in real USRP (Universal Software Radio
// Peripheral) hardware devices without FCC problems; so we hope.
//
// Don't get me wrong, I'm a big fan of parametric scaling of physical
// models, Reynolds number in fluid flow being the most famous example of
// scaling of physical models.  We could scale things like that here but
// since the end of this is presented to the user needs real physical
// parameters, and all of them, hence we don't scale the parameters.  We
// stick to unscaled measurable physical quantities.
//
// If you never studied dimensional analysis do it now:
// https://en.wikipedia.org/wiki/Dimensional_analysis.  There's a lot more
// to it than that, if you want to understand the scaling of physical
// models.
//
// Test example: under what conditions can a sine wave have all it's
// parameters scaled away: start with 3 parameters, A, w, a in S(t) = A
// sin(w t + a) where t is time, and scale them all away.
//

// This conf object defines all the signals that we can have from this
// thing.  The variables, keyed by: "freq", "bw", "gn", and "mcs" are
// setup in the Signal() object/function constructor like for example in:
//
//    var sig = Signal(conf.sig1);
//
//
// See Signal() below.
//
var conf = {


    // Modulation schemes that are available for all the signals.  The
    // "signal" (mcs) can pick one modulation scheme at a time via index
    // into this array, mcs = 0 to 11 (including 11).
    schemes: [
        { rate: 0.5,     SNR: 3.979,  name: "r1/2 BPSK" },      //  0
        { rate: 0.66667, SNR: 5.703,  name: "r2/3 BPSK" },      //  1
        { rate: 1.0,     SNR: 7.109,  name: "r1/2 QPSK" },      //  2
        { rate: 1.33333, SNR: 8.782,  name: "r2/3 QPSK" },      //  3
        { rate: 1.77778, SNR: 10.202, name: "r8/9 QPSK" },      //  4
        { rate: 2.66667, SNR: 15.036, name: "r2/3 16-QAM" },    //  5
        { rate: 3.55556, SNR: 16.747, name: "r8/9 16-QAM" },    //  6
        { rate: 4.44444, SNR: 20.97,  name: "r8/9 32-QAM" },    //  7
        { rate: 5.33333, SNR: 22.92,  name: "r8/9 64-QAM" },    //  8
        { rate: 6.22222, SNR: 26.797, name: "r8/9 128-QAM" },   //  9
        { rate: 7.11111, SNR: 28.57,  name: "r8/9 256-QAM" },   // 10
        { rate: 8.0,     SNR: 31.05,  name: "uncoded 256-QAM" },// 11
    ],

    // This signal (sig0) is from an old code that we started with but we
    // migrated away from.  We needed this to test/write this code.  See
    // sig1 for comments for these parameters.
    //
    // TODO: This case/signal can be removed, assuming this code works and
    // this case/signal is no longer in use.
    sig0: {
        mcs_init: 2,

        freq_min: 1780.0e6,
        freq_max: 1820.0e6,
        freq_plot_min: 1780.0e6,
        freq_plot_max: 1820.0e6,
        freq_step: 0.01e6,
        freq_init: 1800.0e6,

        bw_min: 0.10e6,
        bw_max: 36.0e6,
        bw_step: 0.01e6,
        bw_init: 0.150e6,

        gn_min: -30.0,
        gn_max: 0.0,
        gn_step: 0.01,
        gn_scale: 1.0,
        gn_init: -14.0,
    },

    sigIC_05: {
        // Used in exercise 5 & 6
        mcs_init: 2,

        freq_min: 1780.0e6,
        freq_max: 1820.0e6,
        freq_plot_min: 1780.0e6,
        freq_plot_max: 1820.0e6,
        freq_step: 0.01e6,
        freq_init: 1800.0e6,

        bw_min: 0.10e6,
        bw_max: 36.0e6,
        bw_step: 0.01e6,
        bw_init: 0.150e6,

        gn_min: -30.0,
        gn_max: 0.0,
        gn_step: 0.01,
        gn_scale: 1.0,
        gn_init: -25.0,
    },

    sigEx_06: {
        // Used in exercise 6
        mcs_init: 2,

        freq_min: 1785.0e6,
        freq_max: 1815.0e6,
        freq_plot_min: 1780.0e6,
        freq_plot_max: 1820.0e6,
        freq_step: 0.01e6,
        freq_init: 1797.0e6,

        bw_min: 0.5e6,
        bw_max: 36.0e6,
        bw_step: 0.01e6,
        bw_init: 1.8e6,

        gn_min: -20.0,
        gn_max: 20.0,
        gn_step: 0.01,
        gn_scale: 1.0,
        gn_init: 0.0,
    },

    noiseIC_05: {

        mcs_init: 2, // unused

        freq_min: 1785.0e6, // unused
        freq_max: 1815.0e6, // unused
        freq_plot_min: 1780.0e6, // unused
        freq_plot_max: 1820.0e6, // unused
        freq_step: 0.01e6, // unused
        freq_init: 1800.0e6, // unused

        bw_min: 400.0e6, // unused
        bw_max: 4000.0e6, // unused
        bw_step: 0.01e6, // unused
        bw_init: 4000.0e6, // unused

        // Gain represents noise level
        gn_min: -60.0,
        gn_max: 0.0,
        gn_step: 0.01,
        gn_scale: 1.0,
        gn_init: -30.0,

        // bool that lets you know this is a special noise signal.
        is_noise: true
        // Other non-noise signals with get this bool set to false in the
        // Signal() constructor.
    },


    // We figure there will not be more than 8 or so signals, so names
    // have one number digit in them, not two as in sig01.
    sig1: {
        // The parameters that are associated with signal 1, sig1, or
        // conf.sig1.
        //
        // It's not likely you can change one value and not change many
        // others.  There are a lot of natural constraint relations
        // between these constant parameter values.

        /////////////////////////////////////////////////////////////////
        //
        // Modulation Scheme - index into schemes[]
        //
        mcs_init: 1,
        //

        /////////////////////////////////////////////////////////////////
        // Center frequency constants in Hz.
        //
        // Min and max center frequency of this sig1 signal in Hz that the
        // user is allowed to set; be it changed by slider or user code.
        freq_min: 914.0e6,
        freq_max: 917.0e6,
        //
        // Power spectrum plot frequency limits that would be "good" for
        // this signal.  These 2 limits may need to be combined with other
        // signals like limits.  For example if we wish to show two
        // signals in the same power spectrum plot, we would need to find
        // the minimum of the freq_plot_min and the maximum of the
        // freq_plot_max of the two signals.
        freq_plot_min: 913.5e6,
        freq_plot_max: 917.5e6,
        //
        // The step size that we allow the user to change the sig1 center
        // frequency with the slider.
        freq_step: 0.01e6,
        // If the signal needed to be initialized, we let its center
        // frequency be initialized to this value.
        freq_init: 915.5e6,

        /////////////////////////////////////////////////////////////////
        // Signal bandwidth constants, measured in Hz.
        //
        // We let the user change the bandwidth between these two values;
        // be it changed by slider or user code.
        bw_min: 0.4e6,
        bw_max: 3.6e6,
        //
        // The step size that we allow the user to change the sig1
        // signal bandwidth with the slider.
        bw_step: 0.01e6,
        // initial bandwidth variable value
        bw_init: 1.0e6,

        /////////////////////////////////////////////////////////////////
        // Gain in dB
        //
        // We let the user change the gain between these two values;
        // be it changed by slider or user code.
        gn_min: 0.0,
        gn_max: 31.5,
        //
        // The step size that we allow the user to change the sig1 gain
        // with the slider.
        gn_step: 0.1,
        // gn_scale is used to display the value of the "gn" variable.
        gn_scale: 1.0,
        // initial gain variable value
        gn_init: 0.0,
    },


    // A "noise" signal just uses the gn (gain) variable/parameters.  If
    // this "noise" model is usable, then we can get away with only one
    // "noise" like signal.  The user can make any number of noise
    // objects.   The only variable of interest, gn, in it can be set by
    // the user.  There may be a need for a different "noise" like signal
    // for when the user needs to limit the gn (gain) values, as in
    // setting the constants, gn_min, gn_max, gn_step, and gn_init.
    //
    noise: {

        // TODO: We might be able to get away with not having the unused
        // parameters set here.  Testing all uses needs to confirm this.
        // These unused dummy variables/parameters could be auto-generated
        // in the Signal() constructor.  Maybe make them javaScript
        // getters that throw an exception if a user tries to use them;
        // but that complexity may be not a great help.  A use case study
        // is needed.
        //
        // Dummy signal to act as noise floor
        // ? should this be a global noise floor
        // ? if used globally, freq and bw must be changed to
        //   cover the entire spectrum
        mcs_init: 2, // unused

        freq_min: 1780.0e6, // unused
        freq_max: 1820.0e6, // unused
        freq_plot_min: 1780.0e6, // unused
        freq_plot_max: 1820.0e6, // unused
        freq_step: 0.01e6, // unused
        freq_init: 1800.0e6, // unused

        bw_min: 400.0e6, // unused
        bw_max: 4000.0e6, // unused
        bw_step: 0.01e6, // unused
        bw_init: 4000.0e6, // unused

        // Gain represents noise level
        gn_min: -60.0,
        gn_max: 0.0,
        gn_step: 0.01,
        gn_scale: 1.0,
        gn_init: -30.0,

        // bool that lets you know this is a special noise signal.
        is_noise: true
        // Other non-noise signals with get this bool set to false in the
        // Signal() constructor.
    },
};

// We'll make sure we keep all conf data constant.
Object.freeze(conf.freeze);


// TODO: We are not considering destroying signals yet.  We just let the
// page run and closing the page will cleanup signals.  Removing signals
// is not considered yet.  The environment object with cause a crash if
// signals are removed.  We can only add signals.

//
// This function can create an object via "new" or without "new".
//
// Calling for example: "obj = new Signal(conf.sig1);" will create a new
// sig1 signal object, always.  Calling "obj = Signal(conf.sig1);" will
// return an existing "sig1" object if there is one, or make a new one if
// one does not exist yet.  It's kind of flexible that way...
//
// Recap: using new makes a new one always, just calling the function will
// return the same object if it has been created before.
//
//
//  sig:
//
//     is like conf.sig0, conf.sig1, conf.sig2 and etc ...
//     The "sig" argument is constant from the conf object above.
//
//
//  name:
//
//     is an optional prefix string added to slider labels and plot labels.
//
//
//  opts:  options object
//
//     signal conf constant to change example:
//
//        Signal(sig, "2", { bw_max: 30.0e6, freq_min: 515.0e6 });
//
//
// Please do not access the variables that start with "_" from outside
// this function.   We'd like to make them private, but we are too lazy.
//
function Signal(sig, name = "", opts = null) {

    if(sig.freq_min === undefined) {
        alert("Signal(sig) sig is not a conf.sig object");
        stop();
        return;
    }

    var obj = false;
    var called_with_new = false;

    try {
        if(typeof(this) !== "undefined") {
            // This was called with new.
            //console.log("Made Signal with new");
            obj = this;
            called_with_new = true;
            Signal.objects.set(sig, obj);
        }
    } catch(e) {
        console.log("Signal() not called with new");
    };


    if(obj === false) {
        // this function was called without new.
        if(Signal.objects.has(sig)) {
            // We already created a signal object with sig.
            obj = Signal.objects.get(sig);
            //console.log("returning old Signal with id " + obj.id);
            return obj;
        }
        // Make the first and new Signal object from sig.
        obj = new Object(); // Should be same as: obj = {};
        // Add to the list of Signal objects
        Signal.objects.set(sig, obj);
        //console.log("returning a new Signal object");
    }

    // Label prefix and postfix, or the name we give the signal.
    obj.name = name;
    // We'll be freezing much of this object (obj) so we can debug this
    // code.
    Object.freeze(obj.name);

    // obj.is_noise will be a bool, no matter what.
    if(typeof(obj.is_noise) === 'undefined')
        obj.is_noise = false;
    else
        // fix stupid code.
        obj.is_noise = true;
    Object.freeze(obj.is_noise);

    // This is a new object with a new id.
    // We only get to here once per object, obj.
    obj.id = Signal.createCount++;
    // All existing signals in the environment are interferers, be they
    // noise or otherwise.  This will be the obj list of interferer
    // signals.  obj.interferers is just all other signals in the
    // environment.
    obj.interferers = [];

    // 1) Add this object to the environment of all other signals as
    // an interferer, and 2) add the other signals to this ones' list
    // of interferers.
    Object.keys(Signal.env).forEach(function(id/*other signal id*/) {

        let signal = Signal.env[id];

        // 1. This signal obj is an interferer to this other signal.
        signal.interferers.push(obj);

        // 2. append list of interferers for this obj.
        obj.interferers.push(signal);
    });

    // Now we can add this new signal object (obj) to the list of signals
    // in the environment, via the unique signal id.
    Signal.env[obj.id.toString()] = obj;

    //console.log("Signals.env = " + Object.keys(Signal.env));



    // Theses are just indexes into conf.schemes[]
    obj.mcs_min = 0;
    obj.mcs_max = conf.schemes.length - 1;
    obj.mcs_step = 1;
    Object.freeze(obj.mcs_min);
    Object.freeze(obj.mcs_max);
    Object.freeze(obj.mcs_step);


    // We copy the constant values in sig to this object (obj).
    Object.keys(sig).forEach(function(key) {
        obj[key] = sig[key];
    });

    if(opts !== null)
        // Optionally set constants from the users opts object:
        Object.keys(opts).forEach(function(key) {
            // User option to override signal parameter.
            obj[key] = opts[key];
        });

    // We copy the constant values in sig to this object (obj).
    Object.keys(sig).forEach(function(key) {
        // keep it as a constant from here out.
        Object.freeze(obj[key]);
    });




    // We copy the constant values in sig to this object (obj).
    Object.keys(sig).forEach(function(key) {
        // We don't add it if the users opts object had it already.
        if(!(key in obj))
            // this[key] does not work, but we can use obj[key] in its
            // place.
            obj[key] = sig[key];
        // keep it as a constant from here out.
        Object.freeze(obj[key]);
    });


    //console.log("sig" + obj.name + ".is_noise=" + obj.is_noise);

    // TODO: We need to remove more code for the obj.is_noise = true case.
    // For the obj.is_noise case we only have one independent parameter
    // "gn" (gain).

    // freq, bw, gn, mcs, and _rate are the dynamical variables that
    // the user may set (not rate) or get using the setter and getter
    // functions that we define next.  The user will think of them are
    // parameters that change; so keep in mind that this nomenclature is
    // depends on prospective.  In some cases they are called parameters
    // and in a truer more functional sense they are variables.  Unlike
    // freq, bw, gn, and mcs, rate is dependent on other variables and
    // variables in other signals too.  freq, bw, gn, and mcs manifest
    // themselves are independent variables with values that have
    // non-hollonomic constraints that depend on the constants selected
    // from the constant conf objects this is passed to this constructor,
    // function Signal().
    //
    // TODO: How do we make these effectively private?  So that we know
    // when the getter is called.
    //
    obj._freq = obj.freq_init; // same as obj['_freq'] = obj.freq_init
    obj._bw = obj.bw_init;
    obj._gn = obj.gn_init;
    obj._mcs = obj.mcs_init;
    //
    // rate is a dependent variable that we must calculate to initialize
    // now to a value that is not possible, so it gets set when we call
    // checkSetRate() to initialize it, far below here.
    obj._rate = -1.0;
    obj._sinr = -1.0;


    // list of user callbacks that are called when one of the "values"
    // changes happen from a setter being set, or in the case of the
    // parameter/variable "rate" a parameter/variable in one of the
    // dependency signals independent parameter/variables changing.
    obj._callbacks = { 
        // These are independent variables:
        freq: [], bw: [], gn: [], mcs: [],
        // These are dependent variables.
        rate: [ ], sinr: [] };
    if(obj.is_noise)
        // Noise signals only have gain (gn).
        obj._callbacks = { gn: [] };


    // This tries to change the "rate", due to a change in a dependency.
    // This rate is based on conf.scheme and sinr.  With other schemes not
    // in conf.scheme this rate will differ from this.
    //
    // Also tries to change the "sinr" (signal to interferer & noise ratio
    // in dB), due to a change in a dependency variable/parameter.
    //
    // If changes are found the parameter ("rate" and/or "sinr") callbacks
    // are called, that is what we mean by "tries".  If there are no
    // changes than no callbacks are called.  If not for this "trying"
    // we'd could get infinite callbacks looping do to loops in the
    // callback chains.
    //
    function checkSetRate() {

        // "obj" is the signal object of interest.
        //
        // Magic reference bandwidth.  In order for our Power Spectral
        // Density plot to be consistent with an older version of the code
        // we use this magic number as a factor to get
        // PowerSpectralDensity.  This is not correct and neither is the
        // older version of the code.  These numbers are used to make the
        // power spectrum display, and have nothing to do with the signal
        // model.  Even if we calculate the width of all signals that
        // would still be arbitrary.  I think there may be a missing
        // independent parameter/variable in the signal model, maybe
        // sample rate.
        var bw_max = obj.freq_plot_max - obj.freq_plot_min;

        // A noise signal does not have a rate.
        if(obj.is_noise) return;

        // We will calculate the next/new rate:
        var new_rate = 0.0;
        // and sinr:
        var new_sinr = 0.0;

        // The end points of the obj signal band.
        var bmin = obj._freq - 0.5 * obj._bw;
        var bmax = obj._freq + 0.5 * obj._bw;

        function PowerSpectralDensity(gn) {
            // There is an arbitrary multiplicative constant that will
            // divide out later, so we don't need it.
            //
            // Return some kind of relative power.
            return Math.pow(10.0, gn/10.0);
        }

        // sum the power of all overlapping signals.
        // Call it ip (interferer power) is a sum of linear power.
        var ip = 0.0;
        //
        obj.interferers.forEach(function(i) {

            //
            // i is interferer signal.
            if(!i.is_noise &&
                (
                    // Do they NOT overlap?
                    (obj._freq - 0.5*obj._bw) >= (i._freq + 0.5*i._bw) ||
                    (obj._freq + 0.5*obj._bw) <= (i._freq - 0.5*i._bw)
                ))
                // This interferer (i) is not currently interfering.  It
                // does not overlap the signal (obj).
                return;

            // The power (of interest) is proportional to the overlap in
            // frequency space.  Call it "b".  More overlap, more
            // interfering power.
            //
            // They overlap (b in Hz), so add to interferer power (ip), be
            // it noise with full overlap or regular signal with partial
            // overlap.  This is power within a multiplicative constant.
            // We assume it's the same constant for all signals.
            //
            // Compute the band overlap in Hz, b.
            if(i.is_noise) {
                // Noise overlaps the whole signal.  This is wrong.  The
                // bw_max number is a fug.
                ip += obj._bw * PowerSpectralDensity(i._gn)/bw_max;
            } else {
                let min = i._freq - 0.5 * i._bw;
                if(min < bmin)
                    min = bmin;
                let max = i._freq + 0.5 * i._bw;
                if(max > bmax)
                    max = bmax;
                // partial overlap for non-noise.
                let b = max - min;

                ip += b * PowerSpectralDensity(i._gn)/i._bw;
            }
        });

        // ip is now the current interferer power summed for all
        // interferers including any noise interferers.

        // sinr (signal to interferer and noise ratio) in dB.
        //
        new_sinr = obj._gn - 10*Math.log10(ip);

        //console.log(" ip=" + ip + " sinr=" + new_sinr);


        if(new_sinr >= conf.schemes[obj._mcs].SNR)
            new_rate = obj._bw * conf.schemes[obj._mcs].rate;

        // Tricky:
        let have_change = (obj._sinr !== new_sinr);
        // We need to set obj._sinr in case the users "rate" onChange
        // callback gets that value.
        if(have_change)
            obj._sinr = new_sinr;

        // if the new rate and old rate are the same we do not
        // trigger rate events. 
        if(obj._rate !== new_rate) {

            obj._rate = new_rate;

            // trigger "rate" change callbacks:
            obj._callbacks.rate.forEach(function(callback) {
                //console.log("CALLING: " + callback);
                callback(obj, obj._rate);
            });
        }

        // Now this is way we needed that stupid have_change flag:
        if(have_change) {

            //console.log("sinr=" + new_sinr);

            // trigger "sinr" change callbacks:
            obj._callbacks.sinr.forEach(function(callback) {
                //console.log("CALLING: " + callback);
                callback(obj, obj._sinr);
            });
        }
    }


    // We need to access this checkSetRate() function from other signals
    // as we create more signals, so we can have the other signals effect
    // this "rate" and "sinr".
    obj.checkSetRate = checkSetRate;


    // Set up setters for the 3 independent varying variables/parameters,
    // "freq", "bw", "gn", and "mcs".  "rate" is dependent variable so
    // it can't have a setter.
    //
    let independentParameters = ["freq", "bw", "gn", "mcs" ];
    if(obj.is_noise)
        independentParameters = [ "gn" ];

    independentParameters.forEach(function (key) {
        Object.defineProperty(obj, key, {
            // Define a parameter setter for this key/parameter.
            set: function(val) {
                if(isNaN(val)) return;

                //console.log("min=" + obj[key + '_min'] +
                //" max=" + obj[key + '_max']);
                if(val < obj[key + "_min"]) val = obj[key + "_min"];
                else if(val > obj[key + "_max"]) val = obj[key + "_max"];

                if(obj["_" + key] === val)
                    // No change, so we do nothing.
                    return;

                obj["_" + key] = val;

                // Call any callbacks that the user set for this setter.
                obj._callbacks[key].forEach(function(callback) {
                    //console.log("CALLING: " + callback);
                    callback(obj, val);
                });
            },

            // Make a getter:
            get: function() {
                return obj["_" + key];
            }
        });
    });


    // Add a callback that is called when the value of parameter, par
    // ("freq", "bw", "gn", "mcs" or "rate") changes.
    obj.onChange = function(par, callback) {
        if(typeof obj._callbacks[par] !== "undefined") {
            obj._callbacks[par].push(callback);
            // Trigger the first call.  Clearly there is a change in value
            // from an "unknown" that the user of this had before the
            // onChange() call.
            callback(obj, obj['_' + par]);
        } else
            console.log("ERROR: you can't add a '" + par +
                "' callback to signal " + obj.name);
    };


    if(!obj.is_noise) {

        // Let "rate" have a setter that makes an error.
        //
        // TODO: We can add other dependent variables to this array:
        ["rate", "sinr" ].forEach(function (key) {
            Object.defineProperty(obj, key, {

                // Make a setter that is broken:
                set: function(val) {
                    let msg = "Code ERROR: signal " + name +
                        " cannot set " + key + " (" + val + ")";
                    alert(msg);
                    console.log(msg);
                },

                // Make a getter:
                get: function() {
                    return obj["_" + key];
                }
            });
        });

        // All signal onChange callbacks that trigger "rate" changes.
        //
        // First interferers effect "rate":
        obj.interferers.forEach(function(interferer) {
            if(interferer.is_noise)
                // Only the noise gain has an effect on this signal
                // rate.
                var parameters = [ "gn" ];
            else
                var parameters = ["freq", "bw", "gn"];

            // For all parameters that can effect the rate we set a
            // callback that will get triggered if the one of the
            // parameters changes.
            parameters.forEach(function(par) {
                interferer.onChange(par, checkSetRate);
            });
        });
        // And this signals "freq", "bw", "gn", and "mcs" effect this
        // signals "rate":
        ["freq", "bw", "gn", "mcs"].forEach(function(par) {
            obj.onChange(par, checkSetRate);
        });

        // Initialize the rate based on all the initial parameter/variable
        // values:
        checkSetRate();
    }

    // Adds getter sig.snrLabel returns a string that is either "SINR" or
    // "SNR" depending on whither there are any interferer (other)
    // signals in the environment, or just noise.
    //
    Object.defineProperty(obj, "snrLabel", {
        // Make a getter:
        get: function() {
            var snrLabel = 'SNR';
            obj.interferers.some(function(signal) {
                if(signal.id = obj.id) return false;
                if(signal.is_noise) return false;
                // There is at least one interferer signal.
                snrLabel = 'SINR';
                // Break out of some() call.
                return true;
            });
            return snrLabel;
        }
    });


    // Add a 'rate' callback checkSetRate() trigger to all other signals
    // that are not noise.
    obj.interferers.forEach(function(signal) {
        if(signal.is_noise)
            // noise has no "rate"
            return;
        // trigger the signal.checkSetRate call if gain (gn) changes in
        // this obj signal.
        obj.onChange("gn", signal.checkSetRate);
        if(obj.is_noise)
            // noise only has parameter gain (gn).
            return;

        // trigger the signal.checkSetRate call if freq changes in
        // this obj signal.
        obj.onChange("freq", signal.checkSetRate);
        // trigger the signal.checkSetRate call if bandwidth (bw) changes
        // in this obj signal.
        obj.onChange("bw", signal.checkSetRate);
    });


    if(called_with_new)
        // This was called with new so we cannot return anything.
        return;

    return obj;
}


// We keep a list of signal objects that are created.
Signal.objects = new Map();


// This counter only increases.  It is used to ID the signals.
//
// This should be private to Signal, but module support in client side
// javaScript sucks (year 2021), so what can ya do.
Signal.createCount = 0;


// This is the default signals environment object.  It may be the only
// one, but one can imagine more then one environment (TODO make more).
// It defines all interacting signals that are in the environment.
// Signals may only be in one environment.  The environment (env) is a
// list of signal objects.
//
// List of signals keyed by signal id:
Signal.env = {};
