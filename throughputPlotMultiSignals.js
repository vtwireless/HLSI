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
var signal_list = [];
// var total_data_rate_signal = {rate: 0.0};

var total_data_rate_signal = Signal(JSON.parse(JSON.stringify(conf.signal_multi)), '', {
    'name': 'total_rate'
});

for (let key in Signal.env) {
    if(Signal.env[key]['name']=="total_rate"){
        delete Signal.env[key];
        break;
    }
}


total_data_rate_signal.onChange = function(par, callback) {
    if(typeof total_data_rate_signal._callbacks[par] !== "undefined") {
        total_data_rate_signal._callbacks[par].push(callback);
        // Trigger the first call.  Clearly there is a change in value
        // from an "unknown" that the user of this had before the
        // onChange() call.
        callback(total_data_rate_signal, total_data_rate_signal['_' + par]);
    } else
        console.log("ERROR: you can't add a '" + par +
            "' callback to signal " + total_data_rate_signal.name);
};
// var total_data_rate_signal = Signal(JSON.parse(JSON.stringify(conf.signal_multi)), '', {
//     bw_max: 0, // Hz
//     bw_min: 0,  // Hz
//     bw_init: 0, // Hz
//     gn_init: 0, // dB
//     gn_min: 0, // dB
//     mcs_init: 0, // array index int
//     freq_init: 0
// });

function ThroughputPlot(signals, interferers=[]) {
    
    
    // if(!Array.isArray(interferers))
    //     interferers = [ interferers ];
    // if(interferers.length < 1)
    //     Object.keys(Signal.env).forEach(function(id) {
    //         let signal = Signal.env[id];
    //         if(signal.id === sig.id)
    //             // skip the signal we are getting throughput for.
    //             return;
    //         interferers.push(signal);
    //     });
    signal_list = signals;
    let sig = signal_list[0];

    // Current rate in bits/second.  Changes as time goes on.
    // var rate = sig.rate;

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
    
    var svgr = d3.select("body")
        .append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top +  margin.bottom)
        .attr("style", "margin-left:1%;")
        .append("g")
        .attr("transform", "translate(" +
            margin.left + "," + margin.top + ")");

    var tscale = d3.scaleLinear().domain([-plot_period*(num_steps), 0])
        .range([0, width]);
    var rscale = d3.scaleLog().domain([100e3, 400e6]).range([height, 0]);
    // var liner = d3.line()
    //     .x(function(d, i) { return tscale(-plot_period*(num_steps-i));   })
    //     .y(function(d, i) { return rscale(d.y); });

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
        20e6,40e6,100e6,200e6,400e6];
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
    
    // let stroke_colors = ["#f00", "#0f0", "#00f", "#fff"];
    var signal_colors_stroke = ["rgba(163,36,36)", "rgba(0,176,240)", "rgba(36,124,76)", "rgba(255,192,0)", "rgba(255,255,255)"];
    for(let i=0; i<signal_list.length; i++){
        signal_list[i].datar = d3.range(0,num_steps).map(function(f) { return {"y":1} });
        signal_list[i].liner = d3.line()
        .x(function(d, i) { return tscale(-plot_period*(num_steps-i));   })
        .y(function(d, i) { return rscale(d.y); });
        // 9. Append the path, bind the data, and call the line generator
        signal_list[i].pathr = svgr.append("path")
            .attr("clip-path",`url(#clipr)`)
            .datum(signal_list[i].datar)
            .attr("class", "stroke-med no-fill stroke-red")
            .attr("style", `stroke:${signal_colors_stroke[i]};`)
            .attr("d", signal_list[i].liner);
    }
    total_data_rate_signal.datar = d3.range(0,num_steps).map(function(f) { return {"y":1} });
    total_data_rate_signal.liner = d3.line()
    .x(function(d, i) { return tscale(-plot_period*(num_steps-i));   })
    .y(function(d, i) { return rscale(d.y); });
    total_data_rate_signal.pathr = svgr.append("path")
        .attr("clip-path",`url(#clipr)`)
        .datum(total_data_rate_signal.datar)
        .attr("class", "stroke-med no-fill stroke-red")
        .attr("style", `stroke:${signal_colors_stroke[signal_colors_stroke.length-1]};`)
        .attr("d", total_data_rate_signal.liner);
    


    // function reset() {

    //     datar = d3.range(0,num_steps-1).map(function(f) { return {"y":1} });
    //     pathr.datum(datar).attr("d", liner);
    // }

    var count = 0;

    function update_plot() {
        let total_rate = 0.0;
        for(let i=0; i<signal_list.length; i++){
            // A rate of 0 is not something we can plot on a log scale.
            // Log10(0) is minus infinity, and it makes all other values
            // in the Y array invalid too.
            let r = signal_list[i].rate;
            if(r < 0.1)
                // The rate is not this, but it's not plotted anyway.
                r = 0.1;
            
            total_rate += r;

            // update historical plot
            // console.log(r);
            signal_list[i].datar.push({"y": r});
            // console.log("here");
            signal_list[i].datar.shift();
            signal_list[i].pathr.datum(signal_list[i].datar).attr("d", signal_list[i].liner);
        }
        total_data_rate_signal.datar.push({"y": total_rate});
        total_data_rate_signal.datar.shift();
        total_data_rate_signal.pathr.datum(total_data_rate_signal.datar).attr("d", total_data_rate_signal.liner);
        
    }


    // setup initial plot
    //reset();
    for(let i=0; i<signal_list.length; i++){
        signal_list[i].onChange('rate', function(obj, r) {
            // We got a new rate in bits/second (bits/s).
            signal_list[i].rate = r;
        });
    }
    total_data_rate_signal.onChange('rate', function(obj, r) {
        // We got a new rate in bits/second (bits/s).
        total_data_rate_signal.rate = r;
    });
}
