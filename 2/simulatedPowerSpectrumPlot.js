


// parentElement is a CSS selector for the parent node that we will append
// the d3 <svg> plot element to.
//
function SimulatedPowerSpectrumPlot(sig, parentElement=null) {

    // options
    var f0 = sig.freq; // center frequency

    var m = 40, k=20, n = 2*k*m+1;  // filter semi-length, over-sampling rate, total length
    var bw = 0.2, gn = 0.0;
    var nfft = 2048, generator = new siggen(nfft);
    generator.m = m;

    // determine time and frequency scale/units
    var [scale_freq,units_freq] = scale_units(sig.freq_init+sig.bw_max*0.5,0.1); // freq scale

    // 5. X scale will use the index of our data
    var fScale = d3.scaleLinear().domain([sig.freq_plot_min*scale_freq,
        sig.freq_plot_max*scale_freq]).range([0, plot.width]);

    // 6. Y scale will use the randomly generate number
    var pScale = d3.scaleLinear().domain([-60, 20]).range([plot.height, 0]);

    const df = (sig.freq_plot_max - sig.freq_plot_min)/(nfft-1);

    // 7. d3's line generator
    var linef = d3.line()
        //.x(function(d, i) { return fScale(( (sig.freq_plot_max + sig.freq_plot_min)*0.5 +
        //    (i/nfft-0.5)*(sig.bw_max))*scale_freq); })  // map frequency
        .x(function(d, i) { return fScale( (sig.freq_plot_min + i*df)*scale_freq); })  // map frequency
        .y(function(d)    { return pScale(d.y);        }); // map PSD

    // 8. An array of objects of length N. Each object has key -> value
    // pair, the key being "y" and the value is a random number
    var dataf = d3.range(0,nfft-1).map(function(f) { return {"y": 0 } })

    // create SVG objects
    var svgf = svg_create(fScale, pScale, parentElement);

    var labelPrefix = "";
    if(sig.name.length > 0)
        labelPrefix = sig.name + " ";

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

    // set initial value
    update_plot(sig);

    function update_plot() {

        var fc = - 0.5 + (sig.freq - sig.freq_plot_min)/(sig.freq_plot_max - sig.freq_plot_min);
        var bw = 0.1 + 0.8*(sig.bw - sig.bw_min)/(sig.bw_max - sig.bw_min);
        //var bw = 0.1 + 0.8*(sig.bw - sig.bw_min)/(sig.freq_plot_max - sig.freq_plot_min);

        var gn = sig.gn;

        //console.log("fc=" + fc + " bw=" + bw + " gn=" + gn);

        // generate power spectral density
        generator.clear();
        generator.add_signal(fc,bw,gn+10*Math.log10(bw)); // generate signal
        generator.generate();
        dataf = d3.range(0,nfft-1).map(function(i) { return {"y": generator.psd[i] } })
        pathf.datum(dataf).attr("d", linef);
    }


    sig.addSetterCallback("freq", update_plot);
    sig.addSetterCallback("bw", update_plot);
    sig.addSetterCallback("gn", update_plot);

    // setup initial plot
    update_plot();

}
