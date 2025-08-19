'use strict';

// This makes a plot that when "running" is (mostly) always changing over
// time so long as there is a change in the input signal (sig) or a change
// in an interferer signal over the time of the time length of the
// x-axis.
//
// Throughput Plot is a plot of the Integral of signal 'rate' over time
// verses time.
//
//
// ARGUMENTS:
//
// sig:
//
//   is the signal that we are getting the Throughput Plot for
//
// interferers:
//
//   is one or an array of signals that are interfering.
//
//   If not set than the Signal.env will be used.
//
//
function ThroughputPlot(sig, interferers=[]) {


    if(!Array.isArray(interferers))
        interferers = [ interferers ];
    if(interferers.length < 1)
        Object.keys(Signal.env).forEach(function(id) {
            let signal = Signal.env[id];
            if(signal.id === sig.id)
                // skip the signal we are getting throughput for.
                return;
            interferers.push(signal);
        });

    // Current rate in bits/second.  Changes as time goes on.
    var rate = sig.rate;

    var width = plot.width;
    var height = plot.height;
    var margin = plot.margin;

    // Time between plotting points:
    var plot_period = 0.1; // in seconds

    var interval = setInterval(update_plot, plot_period * 1000);

    // length of x-axis (time) for whole plot:
    var plot_time_length = 90.0; // seconds


    var num_steps = plot_time_length / plot_period;

    //
    // historical rate plot
    //
    var datar = d3.range(0,num_steps).map(function(f) { return {"y":1} })
    var svgr = d3.select("#throughput_history_parent")
        .append("svg")
        .attr("id", "throughput_history")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top +  margin.bottom)
        .attr("style", "margin-left:1%;")
        .append("g")
        .attr("transform", "translate(" +
            margin.left + "," + margin.top + ")");

    var tscale = d3.scaleLinear().domain([-plot_period*(num_steps), 0])
        .range([0, width]);
    var rscale = d3.scaleLog().domain([100e3, 400e6]).range([height, 0]);
    var liner = d3.line()
        .x(function(d, i) { return tscale(-plot_period*(num_steps-i));   })
        .y(function(d, i) { return rscale(d.y); });

    svgr.append("defs").append("clipPath")
        .attr("id", "clipr")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    svgr.append("rect")
	.attr("width", "86.2%")
	.attr("height", "81%")
	.attr("fill", "black");

    svgr.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(tscale));

    var rtickvalues = [ 100e3, 400e3,1e6,2e6,4e6,10e6,
        20e6,40e6,100e6,200e6,400e6]
    svgr.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(rscale)
        .tickValues(rtickvalues)
        .tickFormat(function(d, i) {
            let [s,u] = scale_units(d);
            return d*s + u;
        }));

    // grid lines
    svgr.append("g")
        .attr("class","grid")
        .call(d3.axisBottom(tscale)
            .tickFormat("").tickSize(height));

    svgr.append("g").attr("class","grid")
        .call(d3.axisLeft(rscale).tickFormat("")
            .tickSize(-width).tickValues(rtickvalues));

    // create x-axis axis label
    svgr.append("text")
        .attr("transform","translate("+(width/2)+","+
            (height + 0.75*margin.bottom)+")")
        .attr("dy","-0.3em")
        .style("text-anchor","middle")
   	.attr("fill", "white")
        .text("Time (seconds)");

    let pre = sig.name;
    if(pre.length > 0)
        pre += " ";

    // create y-axis label
    svgr.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .style("text-anchor","middle")
   	.attr("fill", "white")
        .text(pre + "Data Rate (bits/second)");

    // 9. Append the path, bind the data, and call the line generator
    var pathr = svgr.append("path")
        .attr("clip-path","url(#clipr)")
        .datum(datar)
        .attr("class", "stroke-med no-fill stroke-orange")
        .attr("d", liner);


    function reset() {

        datar = d3.range(0,num_steps-1).map(function(f) { return {"y":1} });
        pathr.datum(datar).attr("d", liner);
    }

    var count = 0;

    function update_plot() {

        // A rate of 0 is not something we can plot on a log scale.
        // Log10(0) is minus infinity, and it makes all other values
        // in the Y array invalid too.
        let r = rate;
        if(r < 0.1)
            // The rate is not this, but it's not plotted anyway.
            r = 0.1;

        // update historical plot
        datar.push({"y": r});
        datar.shift();
        pathr.datum(datar).attr("d", liner);
    }


    // setup initial plot
    //reset();

    sig.onChange('rate', function(obj, r) {
        // We got a new rate in bits/second (bits/s).
        rate = r;
    });
}
