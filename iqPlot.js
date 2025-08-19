

function IQPlot(sig) {

    // options
    var f0 = sig.freq; // center frequency

    // filter semi-length, over-sampling rate, total length
    var m = 40, k=20, n = 2*k*m+1;
    var bw = 0.2, gn = 0.0;
    var xi = new Array(n), xq = new Array(n);

    // determine time and frequency scale/units
    var [scale_time,units_time] = scale_units(m/sig.bw_max);        // time scale


    // 5. X scale will use the index of our data
    var tScale = d3.scaleLinear().domain([-scale_time*m/sig.bw_max, scale_time*m/sig.bw_max]).range([0, plot.width]);

    // 6. Y scale will use the randomly generate number
    var vScale = d3.scaleLinear().domain([ -1.1,  1.1]).range([plot.height, 0]);

    // 7. d3's line generator
    var linet = d3.line()
        .x(function(d, i) { return tScale((i-k*m)/k*scale_time/sig.bw_max); })  // set the x values for the line generator
        .y(function(d)    { return vScale(d.y);       }); // set the y values for the line generator
        //.curve(d3.curveMonotoneX) // apply smoothing to the line (comment out to remove smoothing)

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var datai = {};
    var dataq = {};

    // create SVG objects
    var svgt = svg_create(tScale, vScale);

    var xlabel = "Time ("+units_time+"s)";
    var ylabel = "I,Q";
    if(sig.name.length > 0) {
        xlabel = sig.name + " Time ("+units_time+"s)";
        ylabel = sig.name + " I,Q";
    }
    // add labels
    svg_add_labels(svgt, xlabel, ylabel);


    // clip paths
    svgt.append("clipPath").
        attr("id","clipt").
        append("rect").
        attr("width",plot.width).
        attr("height",plot.height);

    // 9. Append the path, bind the data, and call the line generator
    var pathi = svgt.append("path")
        .attr("clip-path","url(#clipt)")
        .datum(datai) // 10. Binds data to the line
        .attr("class", "stroke-med no-fill stroke-green-o")
        .attr("d", linet);  // 11. Calls the line generator
    var pathq = svgt.append("path")
        .attr("clip-path","url(#clipt)")
        .datum(dataq) // 10. Binds data to the line
        .attr("class", "stroke-med no-fill stroke-green-o dashed")
        .attr("d", linet);  // 11. Calls the line generator


    function update_plot() {

        var fc = - 0.5 + (sig.freq - sig.freq_min)/(sig.freq_max - sig.freq_min);
        var bw = 0.1 + 0.8*(sig.bw - sig.bw_min)/(sig.bw_max - sig.bw_min);
        var gn = sig.gn;

        //console.log("fc=" + fc + " bw=" + bw + " gn=" + gn);


        // clear time-domain buffer and generate up-sampled time series
        clear_buffer(xi,n);
        clear_buffer(xq,n);
        add_pulse(k*m, fc/k, bw/k, gn, xi, xq);
        datai = d3.range(0,2*k*m+1).map(function(i) { return {"y":xi[i]} })
        dataq = d3.range(0,2*k*m+1).map(function(i) { return {"y":xq[i]} })
        pathi.datum(datai).attr("d", linet);
        pathq.datum(dataq).attr("d", linet);
    }

    sig.onChange("freq", update_plot);
    sig.onChange("bw", update_plot);
    sig.onChange("gn", update_plot);

    // setup initial plot
    update_plot();
}
