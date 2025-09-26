function eyeDiagram(){
    document.getElementById("constellationParent").innerHTML = "";
  


  
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
                width = 250 - margin.left - margin.right,
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
          .attr("height", height  )
          .attr("width", width )
          .style("fill", "EBEBEB")

        // Add X axis
        var x = d3.scaleLinear()
            .domain([-1.2, 1.2])         
            .range([-.001, width * 1.01]);
        svg.append("g")
          // sends the line to the bottom
          .attr("transform", "translate(0," + height +")")
          // make grid lines
          .call(d3.axisBottom(x).tickSize(-height*1).ticks(4))
          .select(".domain").remove
  

        // Add Y axis 
        var y = d3.scaleLinear()
            // .domain(["Vol"])         
            // .range([0, height]);       
            .domain([-6, 6])
            .range([ -.001, height]);
        svg.append("g")
          // make grid lines
          .call(d3.axisLeft(y).tickSize(-height*1).ticks(7))
          // stroke lines
          svg.selectAll(".tick line").attr("stroke", "#484848")
  
  // TODO ADD A TIME TO TEXT THATS SAME COLOR AS AXIS
        // svg.append("text")
        //   .attr("text-anchor", "end")
        //   .attr("x", width/2 + 12)
        //   .attr("y", height + margin.top + 14)
        //   .text("time");
        // svg.selectall("text").attr("stroke","#FFFFFF")
          // to draw the initial targets, will be overwritten when signal scheme is changed
          // the y value is defined by a position on the graph measured in pixels
          let positiveTarget = [
            { x: 1, y: -1 },
            { x: -1, y: -1 },
        ];
          let negativeTarget = [
                    { x: 1, y: 1 },
                    { x: -1, y: 1 },
        ];
        svg.append('g')
          .selectAll("dot")
          .data(positiveTarget)
          .enter()
          .append("circle")
            .attr("cy", function (d) { return y(d.y); } )
            .attr("cx", function (d) { return x(d.x); } )
            .attr("r", 2)
            .style("fill","#00FF00")
        svg.append('g')
            .selectAll("dot")
            .data(negativeTarget)
            .enter()
            .append("circle")
              .attr("cy", function (d) { return y(d.y); })
              .attr("cx", function (d) { return x(d.x); } )
              .attr("r", 2)
              .style("fill","#00FF00")
        svg.selectAll(".tick line").attr("stroke", "#FFFFFF")
        svg.selectAll(".tick text").attr("fill", "#FFFFFF")

        

  
      // START OF LOOPING CODE
      let counter = 0;
      setInterval(() => {
      // console.log("1 second has passed");
      // const ebno = math.log10(math.abs(sig.sinr))
      const signalGainLinear = (10 ** (Math.abs(sig.gn)/10)) 
      const noisePowerLinear = (10 ** (Math.abs(sig.sinr - sig.gn)/10)) 

      const variance = Math.sqrt(noisePowerLinear)
      


      let varPosTarget = [];
      for (let i = 0; i < 32; i++) {
        let xValue = 1 - (i * (2 / 31)); // Distribute 32 points evenly between 1 and -1
        varPosTarget.push({ x: xValue, y: positiveTarget[0].y + randn_bm() * variance });
      }
      for (let i = 0; i < varPosTarget.length; i++) {
        if (varPosTarget[i].y > 6) varPosTarget[i].y = 6
        if (varPosTarget[i].y < -6) varPosTarget[i].y = -6
      }
      let varNegTarget = [];
      for (let i = 0; i < 32; i++) {
        let xValue = 1 - (i * (2 / 31)); // Distribute 32 points evenly between 1 and -1
        varNegTarget.push({ x: xValue, y: negativeTarget[0].y + randn_bm() * variance });
      }

      for (let i = 0; i < varNegTarget.length; i++) {
        

        if (varNegTarget[i].y > 6) varNegTarget[i].y = 6
        if (varNegTarget[i].y < -6) varNegTarget[i].y = -6
      }

      console.log(varPosTarget)
  
      // console.log(ebno);
        counter = counter + 1;
        if (counter == 9){
          counter = 0;
          d3.select("#constellationParent").selectAll("circle").remove();
          d3.select("#constellationParent").selectAll("path").remove();

          svg.append('g')
          .selectAll("dot")
          .data(positiveTarget)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", function (d) { return y(d.y); } )
            .attr("r", 1)
            .style("fill","#00FF00")
          svg.append('g') 
            .selectAll("dot")
            .data(negativeTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 1)
              .style("fill","#00FF00")
          console.log("10 seconds has passed")
        }
      for (let i = 0; i < 10; i++) {
        
        svg.append('g')
        .selectAll("dot")
        .data(varPosTarget)
        .enter()
        .append("circle")
          .attr("cy", function (d) { 
            // console.log(d.x + randn_bm() * (1/ebno)**2)
            // creates a variable that can be edited if it goes out of bounds for x and y values

            let yVal = d.y;
            if(yVal<-6) yVal = -6
            if(yVal>6) yVal = -6
            
            return y(yVal); } )
          .attr("cx", function (d) { return x(d.x); } )
          .attr("r", 1)
          .style("fill",'#FF0000')

        svg.append('g')
          .selectAll("dot")
          .data(varNegTarget)
          .enter()
          .append("circle")
            .attr("cy", function (d) { 
              // console.log(d.x + randn_bm() * (1/ebno)**2)
              // creates a variable that can be edited if it goes out of bounds for x and y values
  
              let yVal = d.y ;
              if(yVal<-6) yVal = -6
              if(yVal>6) yVal = 6

              
              return y(yVal); } )
            .attr("cx", function (d) { return x(d.x); } )
            .attr("r", 1)
            .style("fill",'#0000FF')
        svg.append('g')
          .selectAll("dot")
          .data(positiveTarget)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", function (d) { return y(d.y); } )
            .attr("r", 3)
            .style("fill","#00FF00")
        svg.append('g')
            .selectAll("dot")
            .data(negativeTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 3)
              .style("fill","#00FF00")
            }

        svg.append("path")
        .datum(varPosTarget)
        .attr("fill", "none")
        .attr("stroke", "#FF0000")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
          .x(function(d) { return x(d.x) })
          .y(function(d) { return y(d.y) })
          )
          svg.append("path")
          .datum(varNegTarget)
          .attr("fill", "none")
          .attr("stroke", "#0000FF")
          .attr("stroke-width", 3)
          .attr("d", d3.line()
            .x(function(d) { return x(d.x) })
            .y(function(d) { return y(d.y) })
            )

        // value below is the loop time in miliseconds
    }, 1000);
  
  





    sig.onChange("gn", update_constellation);
    sig.onChange("differentialMode", update_constellation);
    
  
    function update_constellation(){
      let NewY = sig.gn
      if(sig.differentialMode){
      positiveTarget = [
        { x: 1, y: NewY },
        { x: -1, y: NewY },
      ]
    } else {
      positiveTarget = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
      ]
    }
      negativeTarget = [
        { x: 1, y: -NewY },
        { x: -1, y: -NewY },
      ]
  
    // delete all dots
    d3.select("#constellationParent").selectAll("circle").remove();
    d3.select("#constellationParent").selectAll("path").remove();


    // svg.append("path")
    // .datum(positiveTarget)
    // .attr("fill", "none")
    // .attr("stroke", "#00FF00")
    // .attr("stroke-width", 5)
    // .attr("d", d3.line()
    //   .x(function(d) { return x(d.x) })
    //   .y(function(d) { return y(d.y) })
    //   )
    //   svg.append("path")
    //   .datum(negativeTarget)
    //   .attr("fill", "none")
    //   .attr("stroke", "#00FF00")
    //   .attr("stroke-width", 5)
    //   .attr("d", d3.line()
    //     .x(function(d) { return x(d.x) })
    //     .y(function(d) { return y(d.y) })
    //     )

    svg.append('g')
      .selectAll("dot")
      .data(positiveTarget)
      .enter()
      .append("circle")
        .attr("cy", function (d) { return y(d.y); } )
        .attr("cx", function (d) { return x(d.x); } )
        .attr("r", 3)
        .style("fill","#00FF00")
    svg.append('g')
        .selectAll("dot")
        .data(negativeTarget)
        .enter()
        .append("circle")
          .attr("cy", function (d) { return y(d.y); } ) 
          .attr("cx", function (d) { return x(d.x); } )
          .attr("r", 1)
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