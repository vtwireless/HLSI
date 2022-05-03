"use strict"; // A must for debugging code.

// TODO:
//
//   1. We need to find the axis vertical scale based on all the signals
//      gn_min and gn_max (and etc).
//
//   2. Optional HTML element to place the plot on, like in Slider() and
//      Label().  Now it just appends the plot at the end of the <body>.
//      This may be okay for all 15 starting exercises.
//

// This function does not expose/return any object or other functions.
// Yes, it's magic.
//
// Generates a Power Spectrum Plot with one or more signals that are in
// the environment Signal.env
//
//
// opts:  options object
//
//    yMax:  maximum y plot values in dB
//    yMin:  manimum y plot values in dB
///
//
function PowerSpectrumPlot_2D(opts = {}, has_signal=true, has_interferer=true) {
    document.getElementById("psd_svg_figure_parent").innerHTML = "";

    if(typeof(opts.yMax) === 'undefined')
        opts.yMax = 20;
    if(typeof(opts.yMin) === 'undefined')
        opts.yMin = -60;

    var sigs = [];
    var noises = []; // We can only have one noise.

    var freq_plot_min = 1.0e32; // large number that we change
    var freq_plot_max = -1.0;   // small number that we change

    // We'll display spectrum from all signals in Signal.env;
    


    Object.keys(Signal.env).forEach(function(key) {

        let sig = Signal.env[key];

        // Setup the plot to be updated when sig parameters change.

        if(sig.is_noise) {
            noises.push(sig);
            return;
        }

        // sig is not noise, so we add it to the list of signals.
        sigs.push(sig);

        // Get the limits freq_plot_min and freq_plot_max
        if(freq_plot_min > sig.freq_plot_min)
            freq_plot_min = sig.freq_plot_min;
        if(freq_plot_max < sig.freq_plot_max)
            freq_plot_max = sig.freq_plot_max;
    });


    // filter semi-length(m), over-sampling rate(k), total length
    const m = 80, // ! increasing this value squares off the signal
        k = 20,
        n = 2 * k * m + 1;
    var bw = 0.2, // bw
        gn = 0.0; // gain
    var nfft = 2048;

    var generator = new siggen(nfft);
    generator.m = m;

    // determine time and frequency scale/units
    var [scale_freq, units_freq] = scale_units(
        sigs[0].freq_init + sigs[0].bw_max * 0.5,
        0.1
    ); // freq scale

    // 5. X scale will use the index of our data
    var fScale = d3
        .scaleLinear()
        .domain([freq_plot_min * scale_freq, freq_plot_max * scale_freq])
        .range([0, plot.width]);

    // 6. Y scale will use the randomly generate number
    var pScale = d3.scaleLinear().domain([opts.yMin, opts.yMax]).range([plot.height, 0]);

    const df = (freq_plot_max - freq_plot_min) / (nfft - 1);

    // 7. d3's line generator
    var linef = d3
        .line()
        .x(function (d, i) {
            return fScale((freq_plot_min + i * df) * scale_freq);
        }) // map frequency
        .y(function (d) {
            return pScale(d.y);
        }); // map PSD
    
    

    // 8. An array of objects of length N. Each object has key -> value
    // pair, the key being "y" and the value is a random number
    var dataf = d3.range(0, nfft - 1).map(function (f) {
        return { y: 0 };
    });

    // create SVG objects
    // var svgf = svg_create(fScale, pScale, null, "psd_svg_figure"); // ! null was formerly parentElement
    var svgf = svg_create(fScale, pScale, "#psd_svg_figure_parent"); // ! null was formerly parentElement

    var labelPrefix = "";
    // TODO: This prefix label needs fixing so it works well for all the
    // signals in "sigs'
    //if(sigs[0].name.length > 0)
    //    labelPrefix = sigs[0].name + " ";

    // add labels
    svg_add_labels(
        svgf,
        labelPrefix + "Frequency (" + units_freq + "Hz)",
        labelPrefix + "Power Spectral Density (dB)"
    );


    // clip paths
    svgf
        .append("clipPath")
        .attr("id", "clipf")
        .append("rect")
        .attr("width", plot.width)
        .attr("height", plot.height);


    // 9. Append the path, bind the data, and call the line generator
    var pathf = svgf
        .append("path")
        .attr("clip-path", "url(#clipf)")
        .datum(dataf)
        .attr("class", "stroke-med no-fill stroke-yellow")
        .attr("d", linef);
    
    // 10. Add labels to signals in the graph
    // var interferer_label_f = svgf
    //     .append("text")
    //     .attr("clip-path", "url(#clipf)")
    //     .attr("x", "200")
    //     .attr("y", "50")
    //     .attr("fill", "rgb(255, 161, 93)")
    //     .attr("id", "interferer_label")
    //     .text(`Interferer (${0.0}Hz)`);
    
    // var signal_label_f = svgf
    //     .append("text")
    //     .attr("clip-path", "url(#clipf)")
    //     .attr("x", "200")
    //     .attr("y", "50")
    //     .attr("fill", "rgb(216, 194, 255)")
    //     .attr("id", "signal_label")
    //     .text(`Signal (${0.0}Hz)`);

    // 11. Add signal bounding boxes
    // var interferer_box_f = svgf
    //     .append("rect")
    //     .attr("clip-path", "url(#clipf)")
    //     .attr("x", "200")
    //     .attr("y", "50")
    //     .attr("width", "100")
    //     .attr("height", "200")
    //     .attr("fill", "rgba(230,97,0, 0.35)")
    //     .attr("stroke-width", "2")
    //     .attr("stroke", "rgba(230, 97, 0)")
    //     .attr("id", "interferer_bounding_box");

    // var signal_box_f = svgf
    //     .append("rect")
    //     .attr("clip-path", "url(#clipf)")
    //     .attr("x", "200")
    //     .attr("y", "50")
    //     .attr("width", "100")
    //     .attr("height", "200")
    //     .attr("fill", "rgba(93, 58, 155, 0.35)")
    //     .attr("stroke-width", "2")
    //     .attr("stroke", "rgba(93, 58, 155)")
    //     .attr("id", "signal_bounding_box");
    
    // if(has_interferer === false){
    //     interferer_label_f.attr("style", "display:none;");
    //     interferer_box_f.attr("style", "display:none;");
    // }
    var signal_colors_fill = ["rgba(163,36,36, 0.35)", "rgba(0,176,240, 0.35)", "rgba(36,124,76, 0.35)", "rgba(255,192,0, 0.35)"];
    var signal_colors_stroke = ["rgba(163,36,36)", "rgba(0,176,240)", "rgba(36,124,76)", "rgba(255,192,0)"];
    var signal_colors_label = ["rgba(263,136,136)", "rgba(100,236,250)", "rgba(136,224,176)", "rgba(255,192,100)"];
    
    var interferer_colors_fill = "rgba(255, 148,192, 0.35)";
    var interferer_colors_stroke = "rgba(255, 148, 192)";
    var interferer_colors_label = "rgba(255, 148, 192, 0.0)";

    let signal_color_i = 0;
    Object.keys(Signal.env).forEach(function(key) {
        let color_fill = signal_colors_fill[signal_color_i%signal_colors_fill.length];
        let color_stroke = signal_colors_stroke[signal_color_i%signal_colors_stroke.length];
        let color_label = signal_colors_label[signal_color_i%signal_colors_stroke.length];
        let sig = Signal.env[key];
        var signal_box_f = svgf
        .append("rect")
        .attr("clip-path", "url(#clipf)")
        .attr("x", "200")
        .attr("y", "50")
        .attr("width", "100")
        .attr("height", "200")
        .attr("fill", color_fill)
        .attr("stroke-width", "2")
        .attr("stroke", color_stroke);
        // .attr("id", "signal_bounding_box");

        sig.signal_box_f = signal_box_f;

        var signal_label_f = svgf
            .append("text")
            .attr("clip-path", "url(#clipf)")
            .attr("x", "200")
            .attr("y", "50")
            .attr("fill", color_label)
            // .attr("id", "signal_label")
            .text(`Signal (${0.0}Hz)`);

        sig.signal_label_f = signal_label_f;

        if(sig['name']=='interferer'){
            signal_box_f.attr("fill", interferer_colors_fill).attr("stroke", interferer_colors_stroke);
            signal_label_f.attr("fill", interferer_colors_label)
            return;
        }
        
        signal_color_i+=1;
    });
    
    

    function update_plot() {
        generator.clear();
        // Iterate through signal array, calc values and pass to generator
        let sig_i=0;
        sigs.forEach(function (sig) {
            let df = sig.freq_plot_max - sig.freq_plot_min;
            let fc = -0.5 + (sig.freq - sig.freq_plot_min) / df;
            let bw = sig.bw / df;
            let gn = sig.gn;

            
            sig.cur_signal_freq = fc;
            sig.cur_signal_bw = bw;
            sig.cur_signal_freq_exact = sig._freq;
            
            

            //console.log("fc=" + fc + " bw=" + bw + " gn=" + gn);
            // ! bw (slider %) is limited to 90% range, as log(0) == inf
            generator.add_signal(fc, bw, gn + 10 * Math.log10(bw));
            //generator.add_signal(fc, bw, gn);

            let signal_bounding_box_new_coordinates = get_bounding_box_coordinates(750, 320, sig.cur_signal_freq, sig.cur_signal_bw);
            sig.signal_box_f.attr("x", signal_bounding_box_new_coordinates['x']);
            sig.signal_box_f.attr("y", signal_bounding_box_new_coordinates['y']);
            sig.signal_box_f.attr("width", signal_bounding_box_new_coordinates['width']);
            sig.signal_box_f.attr("height", signal_bounding_box_new_coordinates['height']);

            sig.cur_signal_freq_exact = Math.round(sig.cur_signal_freq_exact/1000000);
            let signal_label_new_coordinates = get_graph_label_coordinates(720, 320, sig.cur_signal_freq);
            sig.signal_label_f.attr("x", signal_label_new_coordinates['x']+8*sig_i);
            sig.signal_label_f.attr("y", signal_label_new_coordinates['y']-8);
            // sig.signal_label_f.text(`Comm Link ${sig_i+1} (${sig.cur_signal_freq_exact}MHz)`);
            sig.signal_label_f.text(`${sig.cur_signal_freq_exact}MHz`);

            sig_i+=1;
        });

        // use custom noise floor if given

        if(noises.length > 0) {
            let n_gn = 0.0; // total noise gain will be summed to n_gn.
            //
            // Having more than one noise is odd, but nothing says we can't.
            // We sum the noise gains this way:
            noises.forEach(function(noise) {
                // Sum the power.
                n_gn += Math.pow(10, noise.gn/10.0);
            });
            // Now make it be in dB.
            n_gn = 10 * Math.log10(n_gn);
            //
            // Note: if there was just one noise than n_gn is just that
            // one (noise.gn).
            generator.generate(n_gn);
        } else 
            // else default noise floor is used (-120db, see generator src)
            generator.generate();

        // console.log(generator);


        dataf = d3.range(0, nfft - 1).map(function (i) {
            // console.log(generator.psd[i])
            // return { y: generator.psd[i] };
            return { y: Math.max(generator.psd[i], -40) };
        });

        pathf.datum(dataf).attr("d", linef);

        // let interferer_bounding_box_new_coordinates = get_bounding_box_coordinates(750, 320, cur_interferer_freq, cur_interferer_bw);
        // interferer_box_f.attr("x", interferer_bounding_box_new_coordinates['x']);
        // interferer_box_f.attr("y", interferer_bounding_box_new_coordinates['y']);
        // interferer_box_f.attr("width", interferer_bounding_box_new_coordinates['width']);
        // interferer_box_f.attr("height", interferer_bounding_box_new_coordinates['height']);

        // let signal_bounding_box_new_coordinates = get_bounding_box_coordinates(750, 320, cur_signal_freq, cur_signal_bw);
        // signal_box_f.attr("x", signal_bounding_box_new_coordinates['x']);
        // signal_box_f.attr("y", signal_bounding_box_new_coordinates['y']);
        // signal_box_f.attr("width", signal_bounding_box_new_coordinates['width']);
        // signal_box_f.attr("height", signal_bounding_box_new_coordinates['height']);


        // cur_interferer_freq_exact = Math.round(cur_interferer_freq_exact/1000000);
        // let interferer_label_new_coordinates = get_graph_label_coordinates(720, 320, cur_interferer_freq);
        // interferer_label_f.attr("x", interferer_label_new_coordinates['x'])
        // interferer_label_f.attr("y", interferer_label_new_coordinates['y']+5)
        // interferer_label_f.text(`Interferer (${cur_interferer_freq_exact}MHz)`);

        // cur_signal_freq_exact = Math.round(cur_signal_freq_exact/1000000);
        // let signal_label_new_coordinates = get_graph_label_coordinates(720, 320, cur_signal_freq);
        // signal_label_f.attr("x", signal_label_new_coordinates['x'])
        // signal_label_f.attr("y", signal_label_new_coordinates['y']-8)
        // signal_label_f.text(`Signal (${cur_signal_freq_exact}MHz)`);
    }

    function get_graph_label_coordinates(graph_width, graph_height, fc){
        graph_width = graph_width-40-100;
        graph_height = graph_height*0.6;
        
        let fc_added = 0.5+fc;
        let new_x = -20 + graph_width*fc_added;

        
        let label_coordinates = {x:new_x, y:240};
        return label_coordinates;
    }

    function get_bounding_box_coordinates(graph_width, graph_height, fc, signal_bw){
        graph_width = graph_width-40-100;
        graph_height = graph_height*0.6;
        
        let bw_offset = graph_width*signal_bw;
        let fc_added = 0.5+fc;
        let new_x = -5 + graph_width*fc_added - (bw_offset/2);
        let new_width = bw_offset+20;
        
        let bounding_box_coordinates = {x:new_x, y:50, width:new_width, height:200};
        return bounding_box_coordinates;
    }

    // Add the update_plot callback to all the signals callbacks.

    noises.forEach(function(noise) {
        noise.onChange("gn", update_plot);
    });

    sigs.forEach(function(sig) {
        // Setup the plot to be updated when sig parameters change.
        sig.onChange("freq", update_plot);
        sig.onChange("bw", update_plot);
        sig.onChange("gn", update_plot);
    });

    // update_plot() will be called by the callbacks that are set just
    // above.
}
