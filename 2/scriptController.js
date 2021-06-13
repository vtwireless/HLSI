// This file just adds a wrapper that uses CodeMirror a client side
// javaScript API, https://codemirror.net/
//
// CodeMirror is a versatile text editor implemented in JavaScript for the
// browser, see https://codemirror.net/
//


// We combine the javaScript editor with a script selector in one thingy
// here.  This function must be called with new.
//
//
//  Arguments:
//
//     sigs:  A signal object or array of signal objects.
//
//
//     opts: {} options object:
//
//        keys:
//
//            functionFiles:  filename of array list of filenames to load
//                  Controller function objects from.
//
//            element: an HTML element or a CSS node selector string or null
//                if this is null a <p> will be appended to the body.
//
//            postfix:  a string to append to the variable names, or
//                an array of strings to append to the variable names.
//
//
function ScriptController(sigs, opts = null) {

   if(this.document !== undefined)
        // this is not a new object, this function was not called with new.
        throw("ScriptController() must be called with new.");

    if(!Array.isArray(sigs))
        sigs = [ sigs ];

    if(opts && !Array.isArray(opts.postfix))
        opts.postfix = [ ];

    function getOpts() {

        var defaultOpts = {
            functionFiles: 'functions/default_1_2.js',
            element: null,
            postfix: []
        };

        if(opts === null)
            opts = defaultOpts;

        Object.keys(defaultOpts).forEach(function(optKey) {
            if(opts[optKey] === undefined ||
                    opts[optKey] === null)
                opts[optKey] = defaultOpts[optKey];
        });

        // Set the postfixes that are not set yet.
        for(let i=opts.postfix.length; i<sigs.length; ++i)
            opts.postfix[i] = (i+1).toString();
    }

    getOpts();

    var p;

    if(typeof(opts.element) === "string")
        p = document.querySelector(opts.element);

    if(!opts.element) {
        p = document.createElement('p');
        document.body.appendChild(p);
    }


    // We use all these wonderful variables as this runs.
    var running = false;
    var intervalId = false;
    var userFunction;
    var editor;
    var funcSelect = document.createElement('select');
    var dtSelect = document.createElement('select');
    var runCheckbox = document.createElement('input');
    var dt = 0.2; // run period in seconds
    var userData = {};
    var init = true;
    var postfix = opts.postfix;
    var argList = [];
    var editor;
    var sigByPostfix = {};


    // All the possible delta time (dt) values.  dt is the period of time
    // between user callback function calls.
    [ 10.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.75, 0.5,
        0.25, 0.1, 0.05, 0.02, 0.01 ].forEach(function(ddt) {

        let opt = document.createElement('option');
        opt.value = ddt;
        opt.innerHTML = ddt.toString() + " seconds";
        dtSelect.appendChild(opt);
    });
    dtSelect.onchange = function() {
        dt = parseFloat(this.value);
        if(running) {
            // We must stop and start it in order to change the interval
            // period.
            Stop();
            Start();
        }
    };
    dtSelect.selectedIndex = 9;
    dtSelect.onchange();



    // Make the arguments list: argList that is the arguments as an array
    // of strings.
    let i = 0;
    sigs.forEach(function(sig) {
        let fix = postfix[i];
        argList = argList.concat([
            'freq' + fix,
            'bw' + fix,
            'gn' + fix,
            'mcs' + fix,
            'bits' + fix
        ]);
        ++i;

        if(sigByPostfix[fix] !== undefined) {
            let err = "We have 2 signals with the same postfix: " + fix
            alert(err);
            console.log(err);
            stop();
            throw err;
        }

        sigByPostfix[fix] = sig;
    });

    argList = argList.concat(['dt', 'userData', 'init']);


    runCheckbox.type = "checkbox";
    runCheckbox.checked = false;


    var funcDeclareSpan = document.createElement('span');
    // TODO: add the function declaration.
    funcDeclareSpan.appendChild(document.createTextNode(
        "function callback(" + argList + "){"));
    p.appendChild(funcDeclareSpan);

    var textArea = document.createElement('textarea');
    p.appendChild(textArea);

    let e = document.createElement('span');
    e.appendChild(document.createTextNode("}"));
    p.appendChild(e);

    p.appendChild(document.createElement('br'));
    p.appendChild(document.createTextNode(
        "The above function will be called once every "));
    p.appendChild(dtSelect);
    p.appendChild(document.createTextNode(" when this is checked:"));
    p.appendChild(runCheckbox);
    p.appendChild(document.createElement('br'));

    let sp = String.fromCharCode(160);
    p.appendChild(document.createTextNode("Select function "));
    //sp += String.fromCharCode(160);/*nbsp*/
    p.appendChild(document.createTextNode(sp));

    funcSelect.className = "notedited";
    p.appendChild(funcSelect);
    funcSelect.value = ""; // initialize to something.


    function Start() {

        if(running) return;

        console.log("Starting");

        var constants = "";

        // Prepend the constants to the top of the function that we run
        // for all the signals involved.
        let i = 0;
        sigs.forEach(function(sig) {
            let fix = postfix[i];

            // TODO: This is a little wonky in that we go from double to
            // string and then back to double; when we could have just
            // kept it as doubles.
            //
            constants += "const freq_min" + fix + " = " + sig.freq_min + ";\n";
            constants += "const freq_max" + fix + " = " + sig.freq_max + ";\n";
            constants += "const bw_min" + fix + " = " + sig.bw_min + ";\n";
            constants += "const bw_max" + fix + " = " + sig.bw_max + ";\n";
            constants += "const gn_min" + fix + " = " + sig.gn_min + ";\n";
            constants += "const gn_max" + fix + " = " + sig.gn_max + ";\n";
            ++i;
        });

        console.log("constants=\n" + constants);


        let args = argList.concat([constants + editor.getValue()]);

        userFunction = new Function(...args);
        userData = {};
        init = true;
        intervalId = setInterval(callUserFunction, Math.round(1000.0*dt)/*milliseconds*/);
        runCheckbox.checked = true;
        running = true;
    }


    function Stop() {

        console.log("Stopping");
        clearInterval(intervalId);
        runCheckbox.checked = false;
        running = false;
    }


    runCheckbox.onclick = function() {
        if(this.checked) {
            if(!running)
                Start();
        } else if(running)
            Stop();
    };


    funcSelect.onchange = function() {

        if(funcSelect.className !== 'notedited')
            funcSelect.className = 'notedited';

        editor.setValue(this.value);

        if(running)
            Stop();
    };


    function callUserFunction() {

        if(!running)
            // The timer popped after we set the flag.
            return;

        var args = [];
        sigs.forEach(function(sig) {
            let bits = sig.getBits(dt, sigs);
            args = args.concat([sig.freq, sig.bw, sig.gn, sig.mcs, bits]);
        });
        args = args.concat([dt, userData, init]);

        try {

            var ret = userFunction(...args);

        } catch(e) {

            if(running)
                Stop();
            alert("Can't run. Bad code\n\n" + e);
            return;
        }

        init = false;

        // example return: { freq1: 1.2*e-8 }
        // that has postfix 1 -> signal = sigByPostfix['1']

        // TODO: Triple for loop, oh boy.  Not efficient, but easy.  Would
        // more pre structuring make this faster.  We'll still have this
        // many parameters that can be set.
        if(typeof(ret) === "object")
            Object.keys(ret).forEach(function(retKey) {
                Object.keys(sigByPostfix).forEach(function(pf) {
                    [ 'freq', 'bw', 'gn', 'mcs' ].forEach(function(par) {

                        // if example: retKey === 'freq1' === 'freq' + '1'
                        if(retKey === par + pf)
                            // We got a change in a signal variable so set it
                            // now.
                            sigByPostfix[pf][par] = ret[retKey];
                    });
                });
            });
    }

    function makeWidget() {

        textArea.value = funcSelect.value;

        delete funcs;

        editor = CodeMirror.fromTextArea(
            textArea, {
                lineNumbers: true,
                theme: "blackboard",
                resize: "vertical",
                mode: {name: "javascript", globalVars: true}
            }
        );

        editor.on('change', function() {
            if(funcSelect.className !== 'edited')
                funcSelect.className = 'edited';
            if(running)
                Stop();
        });

    }


    if(!Array.isArray(opts.functionFiles))
        opts.functionFiles = [ opts.functionFiles ];

    var numFiles = opts.functionFiles.length;
    var funcs = {};

    // We load all the functions that are listed in all javascript files
    // that we load.
    //
    opts.functionFiles.forEach(function(src) {

        // TODO: This method of loading one script at a time is a little
        // slow, but for now, it beats writing more code than this.
        //
        let script = document.createElement('script');
        delete functions;
        console.log("loading=" + src);
        script.onload = function() {

            // Rip out 'functions' from the script file that just loaded.
            if(typeof(functions) === 'undefined') {
                alert('No functions found in file ' + src);
                return; // no functions list go to next.
            }
            // Copy all the functions from this script loading.
            Object.keys(functions).forEach(function(fname) {
                if(typeof(funcs[fname]) !== 'undefined') {
                    let err = 'There are at least 2 functions '+
                        'with the same name "' + fname + '"';
                    //alert(err);
                    console.log(err);
                    return;
                }
                console.log("Adding function named: " + fname);

                let opt = document.createElement('option');

                // We need to strip off the first and last line of the function.
                var func = functions[fname].toString();
                func = func.substring(func.indexOf("\n")+1);
                func = func.substring(0, func.lastIndexOf("\n"));
                opt.value = func;
                opt.innerHTML = fname;
                funcSelect.appendChild(opt);
                funcs[fname] = functions[fname];
            });
            // Remove this global variable.  We may make it again if more
            // javaScript functions files are loaded.
            delete functions;
            --numFiles;
            if(numFiles === 0)
                makeWidget();
        };
        script.src = src;
        document.body.appendChild(script);
    });


}
