function constellationDiagram_Baseband(){
    document.getElementById("constellationParent").innerHTML = "";
  
    // delcared for 16 qam as signal is also declared as 16 qam
    let positiveTarget = [
                      { x: -1, y: 0 },
                  ];
    let negativeTarget = [
                    { x: -1, y: 0 },
                ];

  
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
                width = 460 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;
  
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
          .style("fill", "EBEBEB")

            
        // Add X axis
        var x = d3.scaleLinear()
          .domain([-12, 12])
          .range([ -.001, width * 1.01 ]);
        svg.append("g")
          // sends the line to the bottom
          .attr("transform", "translate(0," + height + ")")
          // make grid lines
          .call(d3.axisBottom(x).tickSize(-height*1).ticks(7))
  
        // Add Y axis
        // var y = d3.scaleLinear()
        //   .domain([-1.5, 1.5])
        //   .range([ height, 0]);
        // Create the scale
        var y = d3.scalePoint()
            .domain(["Vol"])         // This is what is written on the Axis: from 0 to 100
            .range([0, height]);       // This is where the axis is placed: from 100 px to 800px
        svg.append("g")
          // make grid lines
          .call(d3.axisLeft(y).tickSize(-width*1).ticks(7))
          // stroke lines
          svg.selectAll(".tick line").attr("stroke", "#484848")
  
          // to draw the initial targets, will be overwritten when signal scheme is changed
          // the y value is defined by a position on the graph measured in pixels
          let yVal = height/2
        svg.append('g')
          .selectAll("dot")
          .data(positiveTarget)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", yVal)
            .attr("r", 2)
            .style("fill","#00FF00")
        svg.append('g')
            .selectAll("dot")
            .data(negativeTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", yVal)
              .attr("r", 2)
              .style("fill","#00FF00")
        svg.selectAll(".tick line").attr("stroke", "#FFFFFF")
        svg.selectAll(".tick text").attr("fill", "#FFFFFF")

        

  
      // START OF LOOPING CODE
      let color = '#FF0000';
      let counter = 0;
      setInterval(() => {
      // console.log("1 second has passed");
      // const ebno = math.log10(math.abs(sig.sinr))
      const signalGainLinear = (10 ** (Math.abs(sig.gn)/10)) 
      const noisePowerLinear = (10 ** (Math.abs(sig.sinr - sig.gn)/10)) 
      // const noisePower = .1
  
      // const variance = 5
      const variance = Math.sqrt(noisePowerLinear)
      
      // console.log(sig.sinr)
      // console.log(sinrLinear)
      console.log(variance)
      
  
      // console.log(ebno);
        counter = counter + 1;
        if (counter == 9){
          counter = 0;
          d3.select("#constellationParent").selectAll("circle").remove();
          svg.append('g')
          .selectAll("dot")
          .data(positiveTarget)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy",   yVal  )
            .attr("r", 3)
            .style("fill","#00FF00")
          svg.append('g') 
            .selectAll("dot")
            .data(negativeTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy",   yVal  )
              .attr("r", 3)
              .style("fill","#00FF00")
          console.log("10 seconds has passed")
        }
      for (let i = 0; i < 10; i++) {
        
        svg.append('g')
        .selectAll("dot")
        .data(positiveTarget)
        .enter()
        .append("circle")
          .attr("cx", function (d) { 
            // console.log(d.x + randn_bm() * (1/ebno)**2)
            // creates a variable that can be edited if it goes out of bounds for x and y values

            let xVal = d.x + randn_bm() * variance;
            if(xVal<-12) xVal = -12
            
            return x(xVal); } )
          .attr("cy", yVal )
          .attr("r", 2)
          .style("fill",'#FF0000')

        svg.append('g')
          .selectAll("dot")
          .data(negativeTarget)
          .enter()
          .append("circle")
            .attr("cx", function (d) { 
              // console.log(d.x + randn_bm() * (1/ebno)**2)
              // creates a variable that can be edited if it goes out of bounds for x and y values
  
              let xVal = d.x + randn_bm() * variance;
              if(xVal<-12) xVal = -12

              
              return x(xVal); } )
            .attr("cy", yVal )
            .attr("r", 2)
            .style("fill",'#0000FF')
        svg.append('g')
          .selectAll("dot")
          .data(positiveTarget)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", yVal )
            .attr("r", 3)
            .style("fill","#00FF00")
        svg.append('g')
            .selectAll("dot")
            .data(negativeTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", yVal )
              .attr("r", 3)
              .style("fill","#00FF00")
            }

        // value below is the loop time in miliseconds
    }, 1000);
  
  
    sig.onChange("gn", update_constellation);
  
    function update_constellation(){
      let NewX = sig.gn

      if(sig.differentialMode){
        negativeTarget = [
          { x: -NewX, y: -1 },
        ]
      } else {
        negativeTarget = [
          { x: 0, y: -1 },
        ]
      }

      positiveTarget = [
        { x: NewX, y: -1 },
      ]
      // negativeTarget = [
      //   { x: -NewX, y: -1 },
      // ]
  
    // delete all dots
    d3.select("#constellationParent").selectAll("circle").remove();
  
    svg.append('g')
      .selectAll("dot")
      .data(positiveTarget)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", yVal )
        .attr("r", 3)
        .style("fill","#00FF00")
    svg.append('g')
        .selectAll("dot")
        .data(negativeTarget)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", yVal )
          .attr("r", 3)
          .style("fill","#00FF00")
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