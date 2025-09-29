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
        


      setInterval(() => {
        ebno = Math.sqrt((sig.gn)**2/(noise.gn));
        
        ebnoDb = 10*Math.log10(ebno);
        console.log(ebnoDb + " dB")
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
      }, 1000);

      sig.onChange("mcs", clearErrorRate);
      sig.onChange("gn", clearErrorRate);
      noise.onChange("gn", clearErrorRate);


      function clearErrorRate() {
        BER_stats.reset()
        // console.log("Resetting BER stats");
        // console.log("Sent Messages: " + BER_stats.sentMessages);
        // console.log("Message Errors: " + BER_stats.messageErrors);


      }

}
  
  // helper functions

  
  function randn_bm() {
      let u = 0, v = 0;
      while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
      while(v === 0) v = Math.random();
      let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      num = num / 10.0 + 0.5; // Translate to 0 -> 1
      if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
       num = num - 0.5; // added to center around 0
      return num
    }