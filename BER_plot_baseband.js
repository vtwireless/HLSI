let ebno = 0.1;
function BER_plot_baseband(){

    let ebnoPoints = [
                  { x: sig.gn, y: sig.ber },
                 ];


    document.getElementById("BER_plotParent").innerHTML = "";
  
      // set the dimensions and margins of the graph
      const margin = {top: 10, right: 30, bottom: 30, left: 60},
              width = 460 - margin.left - margin.right,
              height = 400 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select("#BER_plotParent")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);
        svg.append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("height", height )
        .attr("width", width )
        .style("fill", "EBEBEB")
          
      // Add X axis
      var x = d3.scaleLinear()
        .domain([0, 10])
        .range([ -.001, width * 1.01 ]);
      svg.append("g")

        // sends the line to the bottom
        .attr("transform", "translate(0," + height + ")")
        // make grid lines
        .call(d3.axisBottom(x).tickSize(-height*1).ticks(7))
        svg.append("text")
          .attr("text-anchor", "middle")
          .attr("x", width/2)
          .attr("y", height + margin.top + 15)
          .text("Eb/No (dB)")
          .style("fill", "#cbcbcb");

      // Add Y axis
      var y = d3.scaleLog()
        .domain([10**-6, 1])
        .range([ height, 0]);
      svg.append("g")
        // make grid lines
        .call(d3.axisLeft(y).tickSize(-width*1).ticks(7))
        // stroke lines
        svg.selectAll(".tick line").attr("stroke", "#cbcbcb")
        svg.selectAll(".tick text").attr("fill", "#cbcbcb")  
      svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .text("BER")
        .style("fill", "#cbcbcb");
        
        // Plot a series of points at Eb/No values of 1-10
        const points = [];
        for (let i = 1; i <= 10; i++) {
          let linearEbno = 10**(i/10);
          let ber = 0.5 * (1 - erf_hastings(Math.sqrt(linearEbno)));
          points.push({ x: i, y: ber });
        }

        svg.append('g')
          .selectAll("dot")
          .data(points)
          .enter()
          .append("circle")
          .attr("cx", function (d) { return x(d.x); })
          .attr("cy", function (d) { return y(d.y); })
          .attr("r", 4)
          .style("fill", "#4dac26");

      setInterval(() => {
        d3.select("#BER_plotParent").selectAll("circle").style("fill", "#a3a3a3");
        svg.append('g')
          .selectAll("dot")
          .data(points)
          .enter()
          .append("circle")
          .attr("cx", function (d) { return x(d.x); })
          .attr("cy", function (d) { return y(d.y); })
          .attr("r", 4)
          .style("fill", "#4dac26");
        ebno = Math.sqrt((sig.gn)**2/((noise.gn)));
        
        ebnoDb = 10*Math.log10(ebno);
        // console.log(ebnoDb + " dB")
        if (sig.BER === 0) {
          sig.BER = 10**-6
        }
      ebnoPoints = [
                  { x: ebnoDb, y: sig.BER },
                 ];
      if ((ebnoPoints[0].x > 0)||(ebnoPoints[0].x > 10)) {

          svg.append('g')
            .selectAll("dot")
            .data(ebnoPoints)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 4)
              .style("fill","#d01c8b")
      }
              // console.log(BER_stats);
      }, 5000);

      sig.onChange("mcs", clearErrorRate);
      sig.onChange("gn", clearErrorRate);
      noise.onChange("gn", clearErrorRate);


      function clearErrorRate() {
        BER_stats.reset()
          d3.select("#iterationsLabel").text(`0`);
          d3.select("#BERLabel").text(`0%`);
          // d3.select("#ebnoLabel").text(`Eb/No (dB): ${ebnoDb}`);
        // console.log("Resetting BER stats");
        // console.log("Sent Messages: " + BER_stats.sentMessages);
        // console.log("Message Errors: " + BER_stats.messageErrors);
      }

}
  
  // helper functions

  
  // function randn_bm() {
  //     let u = 0, v = 0;
  //     while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  //     while(v === 0) v = Math.random();
  //     let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  //     num = num / 10.0 + 0.5; // Translate to 0 -> 1
  //     if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  //      num = num - 0.5; // added to center around 0
  //     return num
  //   }

// function erf_hastings(x) {
//   hastings_R1 = R([0, 0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429])
//   return Math.sign(x) * (1 - Math.exp(-x * x) * hastings_R1(1 / (1 + 0.3275911 * Math.abs(x))));
// }
// function R(P, Q = []) {
//   const l = P.length - 1, m = Q.length - 1;
//   if (l === 5 && m < 0) return R_5(P);
//   if (l === 4 && m === 4) return R_4_4(P, Q);
//   if (l === 5 && m === 4) return R_5_4(P, Q);
//   if (l === 5 && m === 5) return R_5_5(P, Q);
//   if (l === 6 && m === 5) return R_6_5(P, Q);
//   if (l === 8 && m === 7) return R_8_7(P, Q);
//   throw new Error(`unsupported degree ${l},${m}`);
// }

// function R_5([p0, p1, p2, p3, p4, p5]) {
//   return z => p0 + z * (p1 + z * (p2 + z * (p3 + z * (p4 + z * p5))));
// }
