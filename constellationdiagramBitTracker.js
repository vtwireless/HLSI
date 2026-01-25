function constellationDiagramManualTargets(){
    document.getElementById("constellationParent").innerHTML = "";
  
    let xTarget =  0
    let yTarget = sig2.gn


    // delcared for 16 qam as signal is also declared as 16 qam
    let constellationTargets = [
                      { x: xTarget, y: yTarget }
                  ];

  
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
                width = 460 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;
  
        // append the svg object to the body of the page
        var svg = d3.select("#constellationParent")
            .append("svg")
            .attr("width", width + margin.left )
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
          svg.append("rect")
          .attr("x",0)
          .attr("y",0)
          .attr("height", height )
          .attr("width", width )
          .style("fill", "#000000")
          




            
        // Add X axis
        var x = d3.scaleLinear()
          .domain([-1.5, 1.5])
          .range([ -.001, width * 1.01 ]);
        svg.append("g")
          // sends the line to the bottom
          .attr("transform", "translate(0," + height + ")")
          // make grid lines
          .call(d3.axisBottom(x).tickSize(-height*1).ticks(7))
          .selectAll(".tick text").remove()
  
        // Add Y axis
        var y = d3.scaleLinear()
          .domain([-1.5, 1.5])
          .range([ height, 0]);
          // .attr("color","#FFF")
        svg.append("g")
          // make grid lines
          .call(d3.axisLeft(y).tickSize(-width*1).ticks(7))
          // stroke lines
          svg.selectAll(".tick line").attr("stroke", "#FFFFFF")
          svg.selectAll(".tick text").attr("fill", "#FFFFFF")

  
          // to draw the initial targets, will be overwritten when user changes targets is changed
      svg.append('g')
        .selectAll("dot")
        .data(constellationTargets)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", function (d) { return y(d.y); } )
          .attr("r", 3)
          .style("fill","#00FF00")
    
      let counter = 0;
      setInterval(() => {
        counter += 1;


        update_constellation()
        if(yTarget >= 0){
          document.getElementById("bitValue").innerText = "1";
        } else {
          document.getElementById("bitValue").innerText = "0";
        }
      }, 500);
  
    sig1.onChange("gn", update_constellation);


      function update_constellation(){
        console.log(sig1.gn)
        xTarget = 0
        yTarget =  generateNormalRandom(sig2.gn, 10**(noise.gn/10))
        constellationTargets = [
          { x: xTarget , y: yTarget  }
        ];
        // console.log(constellationTargets)
        d3.select("#constellationParent").selectAll("circle").remove();

        svg.append('g')
        .selectAll("dot")
        .data(constellationTargets)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", function (d) { return y(d.y); } )
          .attr("r", 3)
          .style("fill","#00FF00")
      }

  

  }
  
  // helper functions
function generateNormalRandom(mean = 0, stdDev = 1) {
          let u1 = Math.random();
          let u2 = Math.random();
          let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          return z0 * stdDev + mean;
      }