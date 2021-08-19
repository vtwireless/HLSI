// This file uses CodeMirror a client side javaScript API,
// https://codemirror.net/
//
// CodeMirror is a versatile text editor implemented in JavaScript for the
// browser, see https://codemirror.net/
//

// This globalUserData is passed to all user functions.
var globalUserData = {};


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
//            element: an HTML element or a CSS node selector string to a
//                <div> or <p>.  If this is not set a <p> will be appended
//                to the body.
//
//            postfix:  a string to append to the variable names, or
//                an array of strings to append to the variable names.
//
//            sync: scriptController
//                synchronize running with another Script Controller.
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
    //p.className = 'scriptController';

    // <p><div>editor</div><div>table</div></p>


    // We use all these wonderful variables as this runs.
    var running = false;
    var intervalId = false;
    var userFunction;
    var editor;
    var funcSelect = document.createElement('select');
    var dtSelect = document.createElement('select');
    this._dtSelect = dtSelect;
    var runCheckbox = document.createElement('input');
    var dt = 0.2; // run period in seconds
    var userData = {};
    var init = true;
    var postfix = opts.postfix;
    var argList = [];
    var editor;
    var sigByPostfix = {};

    var obj = this;

    const initDtSelectedIndex = 9;

    // Generate a unique ID for this script controller.
    var _id = this._id = ScriptController.count++;

    // We keep a list of script controllers that we run synchronously
    // with.
    obj._syncGroup = false;

    if(typeof(opts.sync) === 'object' || Array.isArray(opts.sync)) {

        if(!Array.isArray(opts.sync))
            opts.sync = [opts.sync];

        // See if the group list exists already.
        opts.sync.forEach(function(sc) {
            if(obj._syncGroup === false && sc._syncGroup !== false)
                obj._syncGroup = sc._syncGroup;
        });

        if(obj._syncGroup === false) {
            // Create a sync group object that is a list of script
            // controllers list keyed by ID.
            obj._syncGroup = {
                list /*script controller objects list*/ : {},
                /* We only handle one event at a time, so we need only
                 * one "active" event flag */
                //active: false/*not running stuff for the group*/,
                running: false,
                dtSelectedIndex: initDtSelectedIndex
            };
            opts.sync.forEach(function(sc) {
                if(typeof(obj._syncGroup.list[sc._id]) === 'undefined') {
                    obj._syncGroup.list[sc._id] = sc;

                    // All script controllers get a pointer to the group
                    // list object.
                    sc._syncGroup = obj._syncGroup;
                }
            });
            obj._syncGroup.list[_id] = this;
        } else {
            // Add this new script controller to the existing group list.
            obj._syncGroup.list[_id] = obj;
        }

        // TODO: We need to add cleanup of this sync group if we delete
        // this object.
        //
        // TODO: stop all the objects in the group.
    }


    // All the possible delta time (dt) values.  dt is the period of time
    // between user callback function calls.
    [ 10.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.75, 0.5,
        0.25, 0.1, 0.05, 0.02 ].forEach(function(ddt) {

        let opt = document.createElement('option');
        opt.value = ddt;
        opt.innerHTML = ddt.toString() + " seconds";
        dtSelect.appendChild(opt);
    });

    dtSelect.onchange = function() {

        dt = parseFloat(this.value);

        if(obj._syncGroup) {

                if(obj._syncGroup.dtSelectedIndex !== dtSelect.selectedIndex) {
                    // This is the first dt select to see the change.
                    obj._syncGroup.dtSelectedIndex = dtSelect.selectedIndex;

                    Object.keys(obj._syncGroup.list).forEach(function(i) {
                        var sc = obj._syncGroup.list[i];
                        if(sc._id == _id) return;
                        // We tell the other script controllers in the group to
                        // use this selected index for the dt value.
                        sc._dtSelect.selectedIndex = obj._syncGroup.dtSelectedIndex;
                    });
                }
        }

        if(running) {
            // We must stop and start it in order to change the interval
            // period.
            Stop();
            Start();
        }
    };

    if(obj._syncGroup)
        dtSelect.selectedIndex = obj._syncGroup.dtSelectedIndex;
    else
        dtSelect.selectedIndex = initDtSelectedIndex;

    dtSelect.onchange();

    const standArgs = [ 'freq', 'bw', 'gn', 'mcs', 'rate' ];

    // Make the arguments list: argList that is the arguments as an array
    // of strings.
    let i = 0;
    sigs.forEach(function(sig) {
        let fix = postfix[i];
        standArgs.forEach(function(a) {
            argList = argList.concat([a + fix]);
        });
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

    argList = argList.concat(['dt', 'userData', 'init', 'globalUserData']);


    runCheckbox.type = "checkbox";
    runCheckbox.checked = false;

    var editorDiv = document.createElement('div');
    editorDiv.className = 'editor';
    p.appendChild(editorDiv);


    var funcDeclareSpan = document.createElement('span');
    // TODO: add the function declaration.
    let argsStr;
    argsStr = argList.toString().replace(/\,/g , ', ');
    funcDeclareSpan.appendChild(document.createTextNode(
        "function callback(" + argsStr + "){"));
    editorDiv.appendChild(funcDeclareSpan);

    var textArea = document.createElement('textarea');
    editorDiv.appendChild(textArea);
    textArea.className = 'scriptController';

    let e = document.createElement('span');
    e.appendChild(document.createTextNode("}"));
    editorDiv.appendChild(e);

    editorDiv.appendChild(document.createElement('br'));
    editorDiv.appendChild(document.createTextNode(
        "The above function will be called once every "));
    editorDiv.appendChild(dtSelect);
    editorDiv.appendChild(document.createTextNode(" when this is checked:"));
    editorDiv.appendChild(runCheckbox);
    editorDiv.appendChild(document.createElement('br'));

    let sp = String.fromCharCode(160);
    editorDiv.appendChild(document.createTextNode("Select function "));
    //sp += String.fromCharCode(160);/*nbsp*/
    editorDiv.appendChild(document.createTextNode(sp));

    funcSelect.className = "notedited";
    editorDiv.appendChild(funcSelect);
    funcSelect.value = ""; // initialize to something.


    let argsTable = document.createElement('table');
    argsTable.className = 'argsTable';
    argsTable.setAttribute('border', '2');

    let thead = document.createElement('thead');
    argsTable.appendChild(thead);

    let tr = document.createElement('tr');
    tr.innerHTML = "<th scope=\"col\" colspan=\"2\" class=ph1>callback parameters</th>";
    thead.appendChild(tr);
    tr = document.createElement('tr');
    tr.innerHTML = "<th scope=\"col\" class=ph2>parameter</th>" +
        "</th><th scope=\"col\" class=ph3>decription</th>";
    thead.appendChild(tr);



    var tbody = document.createElement('tbody');
    argsTable.appendChild(tbody);

    i = 0;
    var tbody;
    sigs.forEach(function(sig) {
        let fix = postfix[i];

        let tr = document.createElement('tr');
        tr.innerHTML = "<td>freq" + fix +
            "</td class=p1><td class=p2>center frequency of signal in Hz" +
            fix + "</td>";
        tbody.appendChild(tr);

        tr = document.createElement('tr');
        tr.innerHTML = "<td class=p1>bw" + fix +
            "</td><td class=p2>bandwidth of signal " + fix + " in Hz</td>";
        tbody.appendChild(tr);

        tr = document.createElement('tr');
        tr.innerHTML = "<td class=p1>gn" + fix +
            "</td><td class=p2>gain of signal " + fix + " in dB</td>";
        tbody.appendChild(tr);

        tr = document.createElement('tr');
        tr.innerHTML = "<td class=p1>mcs" + fix +
            "</td><td class=p2>modulation coding scheme of signal " + fix +
            ", index 0 to 11</td>";
        tbody.appendChild(tr);

        tr = document.createElement('tr');
        tr.innerHTML = "<td class=p1>rate" + fix +
            "</td><td class=p2>rate of signal " + fix + ", read only, bits/second</td>";
        tbody.appendChild(tr);

        ++i;
    });


    /*
    argsTable.setAttribute('title', 'hide');

    argsTable.onclick = function() {
        if(tbody.style.display === "none") {
            argsTable.setAttribute('title', 'show');
            tbody.style.display = 'block';
        } else {
            tbody.style.display = 'none';
            argsTable.setAttribute('title', 'hide');

        }
    };
    */

    tr = document.createElement('tr');
    tr.innerHTML = "<td class=p1>dt</td><td class=p2>time elapsed since late call, in seconds</td>";
    tbody.appendChild(tr);

    tr = document.createElement('tr');
    tr.innerHTML = "<td class=p1>userData</td><td class=p2>object preserved between calls</td>";
    tbody.appendChild(tr);

    tr = document.createElement('tr');
    tr.innerHTML = "<td class=p1>init</td><td class=p2>true when callback is first called, false otherwise</td>";
    tbody.appendChild(tr);

    tr = document.createElement('tr');
    tr.innerHTML = "<td class=p1>globalUserData</td><td class=p2>object preserved between calls and between all code</td>";
    tbody.appendChild(tr);

    p.appendChild(argsTable);


    var clearLeft = document.createElement('div');
    clearLeft.className = 'clearLeft';
    p.appendChild(clearLeft);



    function callUserFunctions() {

        if(!running) return;

        if(obj._syncGroup) {
            // There is a group of script controllers.
            if(obj._syncGroup.running)
                Object.keys(obj._syncGroup.list).forEach(function(i) {
                    var sc = obj._syncGroup.list[i];
                    sc._callUserFunction();
                });
        } else
            // There is no group of script controllers.
            callUserFunction();
    }


    function Start() {

        if(running) return;

        //console.log("Starting " + _id);

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
            constants += "const mcs_max" + fix + " = " + sig.mcs_max + ";\n";
            constants += "const mcs_min" + fix + " = " + sig.mcs_min + ";\n";

            ++i;
        });

        //console.log("constants=\n" + constants);

        let args = argList.concat([constants + editor.getValue()]);

        userFunction = new Function(...args);
        userData = {};
        init = true;
        if(!obj._syncGroup)
            intervalId = setInterval(callUserFunction, Math.round(1000.0*dt)/*milliseconds*/);
        else if(!obj._syncGroup.running) {
            obj._syncGroup.running = true;
            // We all the start functions in this sync group.
            Object.keys(obj._syncGroup.list).forEach(function(i) {
                var sc = obj._syncGroup.list[i];
                if(sc._id === _id) return;
                // Initialize the other user functions by calling the
                // other Start functions.
                sc._Start();
            });
            obj._syncGroup.intervalId = setInterval(
                callUserFunctions, Math.round(1000.0*dt)/*milliseconds*/);
        }
        runCheckbox.checked = true;
        running = true;

    }

    // The script controllers can access each others Start().
    this._Start = Start;


    function Stop() {

        console.log("Stopping " + _id);
        runCheckbox.checked = false;
        running = false;

        if(obj._syncGroup) {

            if(obj._syncGroup.running) {
                clearInterval(obj._syncGroup.intervalId);
                obj._syncGroup.running = false;

                Object.keys(obj._syncGroup.list).forEach(function(i) {
                    var sc = obj._syncGroup.list[i];
                    if(i === _id) return;
                    sc._Stop();
                });
            }
        } else
            clearInterval(intervalId);
    }

    // The script controllers can access each others Stop().
    this._Stop = Stop;



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

/*    
 // listen for the beforeChange event, test the changed line number, and cancel
editor.on('beforeChange', function (cm, change) {
    if (~[0, editor.getDoc().size - 1].indexOf(change.from.line)) {
        change.cancel();
    }
});
*/

    function callUserFunction() {

        if(!running)
            // The timer popped after we set the flag.
            return;

        //console.log("calling sc id=" + _id);

        var args = [];
        sigs.forEach(function(sig) {
            args = args.concat([sig.freq, sig.bw, sig.gn, sig.mcs, sig.rate]);
        });
        args = args.concat([dt, userData, init, globalUserData]);

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


    this._callUserFunction = callUserFunction;

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
        //console.log("loading=" + src);
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
                //console.log("Adding function named: " + fname);

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

// Used to create unique object IDs.
ScriptController.count = 0;
