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
        .attr("width", width)
        .style("fill", "EBEBEB")
          
      // Add X axis
      var x = d3.scaleLinear()
        .domain([0, 10])
        .range([ -.001, width * 1 ]);
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
        

      svg.selectAll("path").remove();

        // Plot a series of points at Eb/No values of 0-10
        const points = [];
        // for (let i = 0; i <= 10; i++) {
        //   let linearEbno = 10**(i/10);
        //   let inputQfunc = Math.sqrt(2*linearEbno);
        //   // let ber = 0.5 * (1 - erf_hastings(Math.sqrt(linearEbno)));
        //   let ber = 0.5 * (1-erf_hastings(inputQfunc/Math.sqrt(2)));

        //   points.push({ x: i, y: ber });
        // }
        for (let i = 0; i <= 10; i++) {
          let linearEbno = 10**(i/10);
          let inputQfunc = Math.sqrt( 2*linearEbno);
          // let ber = 0.5 * (1 - erf_hastings(Math.sqrt(linearEbno)));
          let ber = qfunc(inputQfunc);

          points.push({ x: i, y: ber });
        }



        const line = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points)
          .attr("fill", "none")
          .attr("stroke", "#4dac26")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line)
          .attr("clip-path", "url(#clip)");

        // Define a clipping path
        svg.append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height);

      setInterval(() => {
        d3.select("#BER_plotParent").selectAll("circle").style("fill", "#a3a3a3");

        mode = document.getElementById("mode").value;
       
        if(sig.differentialMode) ebno = (((sig.gn**2)/((noise.gn**2))));
        if(!sig.differentialMode) ebno = (sig.gn)**2/((2*noise.gn**2));

        ebnoBeginner = 10*Math.log10(ebno);
        // console.log(ebnoDb + " dB")
        if (sig.BER === 0) {
          sig.BER = 10**-6
        }
      if (mode === 'beginner'){
        ebnoPoints = [
                    { x: ebnoBeginner, y: sig.BER },
                  ];
      } else {
        let ebnoAdvanced = sigPower.gn - (noisePower.gn + 10*Math.log10(1/messageRate));

        ebnoPoints = [{x: ebnoAdvanced, y: sig.BER },
                  ];
      }
      if ((ebnoPoints[0].x > 0)&&(ebnoPoints[0].x < 10)) {
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

      document.getElementById("differentialMode").addEventListener("change", (event) => {
        clearErrorRate();
        // Clear the existing path
        svg.selectAll("path").remove();


        // Plot a series of points at Eb/No values of 0-10
        const points = [];
        for (let i = 0; i <= 10; i++) {
          let linearEbno = 10**(i/10);
          let inputQfunc = Math.sqrt(linearEbno * (document.getElementById("differentialMode").checked ? 2 : 1));
          // // let ber = 0.5 * (1 - erf_hastings(Math.sqrt(linearEbno)));
          // let inputQfunc = Math.sqrt( 2*linearEbno);
          // let ber = 0.5 * (1 - erf_hastings(Math.sqrt(linearEbno)));
          let ber = qfunc(inputQfunc);
          points.push({ x: i, y: ber });
        }

        const line = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points)
          .attr("fill", "none")
          .attr("stroke", "#4dac26")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line)
          .attr("clip-path", "url(#clip)");

        // Define a clipping path
        svg.append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height);
        
      });

}
  

function qfunc(x) {
    return 0.5 * (1 - erf_hastings(x / Math.sqrt(2)));
}
  // helper functions
