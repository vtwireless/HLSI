'use strict';


//
// sig:
//
//   is the signal that we are getting the Spectral Efficiency Plot for
//
//
//
//
function SpectralEfficiencyPlot(sig) {


    // channel capacity (b/s/Hz) given SNR in dB
    function efficiency(snr) {
        return Math.log2(1.0 + Math.pow(10,snr/10));
    }


    let width = plot.width;
    let height = plot.height;
    let margin = plot.margin;
    var schemes = conf.schemes;


    // capacity curve
    // (-10, 4 Mb/s, 0.1375 b/s/Hz), (40 dB, 382 Mb/s, 13.288 b/s/Hz)
    //
    //
    var datac = d3.range(-10,40+0.01).map(function(d,i) {
        return {"x":d, "y":efficiency(d)} });

    // We need a unique DOM HTML element ID.
    var svg_id = "svg-capaciZty_" + SpectralEfficiencyPlot.plotId++;

    var svgc = d3.select("body")
        .append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top +  margin.bottom)
        .attr("style", "margin-left:1%;")
        .attr("id", svg_id)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create scale
    const snrMax = 40, snrMin = -10, snrMaxEdge = 40.7, snrMinEdge = -10.7;
    var sscale = d3.scaleLinear().domain([snrMin,snrMax]).range([0, width]); // snr (Eb/N0?)
    var cscale = d3.scaleLog   ().domain([0.5, 8]).range([height, 0]); // capacity (b/s/Hz)
    //.domain([schemes[0].rate, schemes[schemes.length-1].rate])

    svgc.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    svgc.append("rect")
        .attr("width", "86.2%")
	.attr("height", "81%")
	.attr("fill", "black");

    svgc.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(sscale));

    //var yTickValues = [0.1,0.2,0.5,1,2,5,10,20]
    var yTickValues = [];
    conf.schemes.forEach(function(d,i) { yTickValues.push(d.rate); });

    svgc.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(cscale)
        .tickValues(yTickValues)
        .tickFormat(function(d) { return d3.format(".2f")(d); } ))

    // grid lines
    svgc.append("g").attr("class","grid")
        .call(d3.axisBottom(sscale)
        .tickFormat("")
        .tickSize(height));
    svgc.append("g")
        .attr("class","grid")
        .call(d3.axisLeft  (cscale).tickFormat("")
        .tickSize(-width)
        .tickValues(yTickValues));

    let pre = "";
    if(sig.name)
        pre = sig.name + " ";

    // create x-axis axis label
    svgc.append("text")
        .attr("transform","translate("+(width/2)+","+(height + 0.75*margin.bottom)+")")
        .attr("dy","-0.3em")
        .style("text-anchor","middle")
   	.attr("fill", "white")
        .text(pre + sig.snrLabel + " (dB)")

    // create y-axis label
    svgc.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .style("text-anchor","middle")
   	.attr("fill", "white")
        .text(pre + "Spectral Efficiency (bits/second/Hz)")

    // clip paths
    svgc.append("clipPath")
        .attr("id","clipf")
        .append("rect")
        .attr("width",width)
        .attr("height",height);

    // line generator for capacity, mod/cod curves
    var linec = d3.line()
        .x(function(d) { return sscale(d.x); })  // map SNR
        .y(function(d) { return cscale(d.y); }); // map capacity

    // 9. Append the path, bind the data, and call the line generator
    var pathc = svgc.append("path")
        .attr("clip-path","url(#clipf)")
        .datum(datac)
        .attr("class", "stroke-light no-fill stroke-green-o")
        .attr("d", linec);

    // ?? 9. Append the path, bind the data, and call the line generator
    var datam = d3.range(schemes.length)
        .map(function(d,i) { return {"x":schemes[i].SNR, "y":schemes[i].rate} });

    var pathc = svgc.append("path")
        .attr("clip-path","url(#clipf)")
        .datum(datam)
        .attr("class", "stroke-light no-fill stroke-green-o dashed")
        .attr("d", linec);

    // add operating point
    svgc.append('g')
        .selectAll("dot")
        .data( [{"x":0, "y":efficiency(0)}] )
        .enter()
        .append("circle")
        .attr("cx", function (d) { return sscale(d.x); } )
        .attr("cy", function (d) { return cscale(d.y); } )
        .attr("r", 5)
        .attr("class", "stroke-lightstroke-med stroke-green-o")
        .style("fill", "#66ff00");


    function update_plot() {

        //console.log("update_plot   rate=" + sig.rate);

	    let SNRdB = sig.sinr;

        // We constrain it to be in view.
        if(SNRdB > snrMaxEdge)
            SNRdB = snrMaxEdge;
        else if(SNRdB < snrMinEdge)
            SNRdB = snrMinEdge;

        let R = schemes[sig.mcs].rate;

        console.log(R, cscale(R));

        // update capacity value
        d3.selectAll('#' + svg_id + ' circle')
            .data( [{"x": SNRdB, "y":R}] )
            .attr("cx", function(d) { return sscale(d.x); })
            .attr("cy", function(d) { return cscale(R); })
            .attr("class", (sig.rate > 0.0) ?
                "stroke-med stroke-green" :"stroke-med stroke-red")
            .style("fill",  (sig.rate > 0.0) ? "#00FF00": "#FF0000");

    }

    sig.onChange("rate", update_plot);
    sig.onChange("sinr", update_plot);
    sig.onChange("mcs", update_plot);

    update_plot();
}


SpectralEfficiencyPlot.plotId = 0;
