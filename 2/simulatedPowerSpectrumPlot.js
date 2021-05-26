'use strict';


// TODO: 
//
//   1. We need to draw a "noise floor".  Currently there is none.
//
//   2. We need to find the axis vertical scale based on all the signals
//      gn_min and gn_max.
//


//
//  Function Parameters
//
//
//   sig: is a signal or array of signals
//
//   parentElement: is a CSS selector for the parent node that we will append
//        the d3 <svg> plot element to.

//
function SimulatedPowerSpectrumPlot(sigs, parentElement=null) {

    if(!Array.isArray(sigs))
        sigs = [ sigs ];
    if(sigs.length < 1)
        return;

    var freq_plot_min = sigs[0].freq_plot_min;
    var freq_plot_max = sigs[0].freq_plot_max;
    // Find the freq_plot_min and freq_plot_max for all signals.
    sigs.forEach(function(sig) {
        // TODO: Note we are doing sigs element 0 twice.
        if(freq_plot_min > sig.freq_plot_min)
            freq_plot_min = sig.freq_plot_min;
        if(freq_plot_max < sig.freq_plot_max)
            freq_plot_max = sig.freq_plot_max;


        // Setup the plot to be updated when signals change.
        //
        // TODO: How do we keep the update_plot() from being called to
        // often?
        sig.addSetterCallback("freq", update_plot);
        sig.addSetterCallback("bw", update_plot);
        sig.addSetterCallback("gn", update_plot);
    });


    // options
    const m = 40, k=20, n = 2*k*m+1;  // filter semi-length, over-sampling rate, total length
    var bw = 0.2, gn = 0.0;
    var nfft = 2048, generator = new siggen(nfft);
    generator.m = m;

    // determine time and frequency scale/units
    var [scale_freq,units_freq] = scale_units(sigs[0].freq_init+sigs[0].bw_max*0.5,0.1); // freq scale

    // 5. X scale will use the index of our data
    var fScale = d3.scaleLinear().domain([freq_plot_min*scale_freq,
        freq_plot_max*scale_freq]).range([0, plot.width]);

    // 6. Y scale will use the randomly generate number
    var pScale = d3.scaleLinear().domain([-60, 20]).range([plot.height, 0]);

    const df = (freq_plot_max - freq_plot_min)/(nfft-1);

    // 7. d3's line generator
    var linef = d3.line()
        .x(function(d, i) { return fScale( (freq_plot_min + i*df)*scale_freq); })  // map frequency
        .y(function(d)    { return pScale(d.y);        }); // map PSD

    // 8. An array of objects of length N. Each object has key -> value
    // pair, the key being "y" and the value is a random number
    var dataf = d3.range(0,nfft-1).map(function(f) { return {"y": 0 } })

    // create SVG objects
    var svgf = svg_create(fScale, pScale, parentElement);

    var labelPrefix = "";
    // TODO: This prefix label needs fixing so it works well for all the
    // signals in "sigs'
    //if(sigs[0].name.length > 0)
    //    labelPrefix = sigs[0].name + " ";

    // add labels
    svg_add_labels(svgf,
            labelPrefix + "Frequency ("+units_freq+"Hz)",
            labelPrefix + "Power Spectral Density (dB)");

    // clip paths
    svgf.append("clipPath").attr("id","clipf").append("rect").attr("width",plot.width).attr("height",plot.height);

    // 9. Append the path, bind the data, and call the line generator
    var pathf = svgf.append("path")
        .attr("clip-path","url(#clipf)")
        .datum(dataf)
        .attr("class", "stroke-med no-fill stroke-yellow")
        .attr("d", linef);


    function update_plot() {

        generator.clear();

        sigs.forEach(function(sig) {
            var fc = - 0.5 + (sig.freq - sig.freq_plot_min)/(sig.freq_plot_max - sig.freq_plot_min);
            var bw = 0.1 + 0.8*(sig.bw - sig.bw_min)/(sig.bw_max - sig.bw_min);
            var gn = sig.gn;
            //console.log("fc=" + fc + " bw=" + bw + " gn=" + gn);
            // generate power spectral density
            generator.add_signal(fc,bw,gn+10*Math.log10(bw)); // generate signal
        });

        generator.generate();
        dataf = d3.range(0,nfft-1).map(function(i) { return {"y": generator.psd[i] } })
        pathf.datum(dataf).attr("d", linef);
    }


    // setup initial plot
    update_plot();

}
