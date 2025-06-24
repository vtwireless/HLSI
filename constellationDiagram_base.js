function constellationDiagram(){
    document.getElementById("constellationParent").innerHTML = "";
    let distance = 2/2;
    // delcared for 16 qam as signal is also declared as 16 qam
    let constellationTargets = [
                      { x: 1, y: 1 },
                      { x: 1, y: -1 },
                      { x: -1, y: 1 },
                      { x: -1, y: -1 },
                  ];
    // need a bpsk flag so noise doesn't add phase noise in the BPSK version
    // let bpskFlag = false;
  
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
                width = 460 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;
  
        // append the svg object to the body of the page
        var svg = d3.select("#constellationParent")
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
          .domain([-1.5, 1.5])
          .range([ -.001, width * 1.01 ]);
        svg.append("g")
          // sends the line to the bottom
          .attr("transform", "translate(0," + height + ")")
          // make grid lines
          .call(d3.axisBottom(x).tickSize(-height*1).ticks(7))
  
        // Add Y axis
        var y = d3.scaleLinear()
          .domain([-1.5, 1.5])
          .range([ height, 0]);
        svg.append("g")
          // make grid lines
          .call(d3.axisLeft(y).tickSize(-width*1).ticks(7))
          // stroke lines
          svg.selectAll(".tick line").attr("stroke", "#FFFFFF")
          svg.selectAll(".tick text").attr("fill", "#FFFFFF")          

  
          // to draw the initial targets, will be overwritten when signal scheme is changed
      svg.append('g')
        .selectAll("dot")
        .data(constellationTargets)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", function (d) { return y(d.y); } )
          .attr("r", 1.5)
          .style("fill","#1b9e77")
  
  
        // console.log(sig)

        // UNCOMMENT out to add a slider
        Slider(noise, 'gn', null, "noiseSlider");
        Label(sig, 'sinr', {
        prefix: "Signal-to-Noise Ratio: SNR = "
        }, "noiseSlider");
  
      // console.log(sig.sinr)
  
      // START OF LOOPING CODE
      let counter = 0;
      setInterval(() => {
      // console.log("1 second has passed");
      // const ebno = math.log10(math.abs(sig.sinr))
      const ebno = (10 ** (sig.sinr/10)) 
      const noisePower = 1/ebno
      // const noisePower = .1
  
      const variance = Math.sqrt(noisePower) 


    


      // console.log(ebno);
        counter = counter + 1;
        if (counter == 24){
          counter = 0;
          d3.select("#constellationParent").selectAll("circle").remove();
          svg.append('g')
          .selectAll("dot")
          .data(constellationTargets)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", function (d) { return y(d.y); } )
            .attr("r", 3)
            .style("fill","#1b9e77")
          console.log("10 seconds has passed")
        }
      for (let i = 0; i < 99; i++) {
        // creates a variable that can be edited if it goes out of bounds for x and y values
        let translatedTargets = constellationTargets.map(point => ({
          x: point.x + variance * randn_bm(),
          y: point.y + variance * randn_bm()
        }));
        for (let i = 0; i < constellationTargets.length; i++) {
          // console.log(translatedTargets[i])
          // console.log(translatedTargets)

          let xErrorDist = Math.abs(translatedTargets[i].x - constellationTargets[i].x); 
          let yErrorDist = Math.abs(translatedTargets[i].y - constellationTargets[i].y); 

          let = printObject = [translatedTargets[i]]

          if ( (xErrorDist > distance) || (yErrorDist > distance) ){
            // console.log("I am called!")
            svg.append('g')
            .selectAll("dot")
            .data(printObject)
            .enter()
            .append("circle")
              .attr("cx", function (d) { 
                let xVal = d.x
                if (xVal> 1.5){
                  xVal = 1.5 
                } else if(xVal < -1.5){
                  xVal = -1.5
                }
                return x(xVal); } )
              .attr("cy", function (d) {
                let yVal = d.y      
                if (yVal> 1.5){
                  yVal = 1.5
                } else if (yVal < -1.5){
                  yVal = -1.5
                }
                return y(yVal); } )
              .attr("r", 2)
              .style("fill","#d95f02")
          } else {
            svg.append('g')
            .selectAll("dot")
            .data(printObject)
            .enter()
            .append("circle")
            .attr("cx", function (d) { 
              let xVal = d.x
              if (xVal> 1.5){
                xVal = 1.5 
              } else if(xVal < -1.5){
                xVal = -1.5
              }
              return x(xVal); } )
            .attr("cy", function (d) {
              let yVal = d.y      
              if (yVal> 1.5){
                yVal = 1.5
              } else if (yVal < -1.5){
                yVal = -1.5
              }
              return y(yVal); } )
              .attr("r", 2)
              .style("fill","#7570b3")
          }
        }

        svg.append('g')
          .selectAll("dot")
          .data(constellationTargets)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", function (d) { return y(d.y); } )
            .attr("r", 1.5)
            .style("fill","#1b9e77")
            }
        // value below is the loop time in miliseconds
    }, 1000);
  
  
    sig.onChange("mcs", update_constellation);
  
    function update_constellation(){
      // console.log(sig.mcs)
      // console.log("The modulation code has changed")
      bpskFlag = false;
      if(sig.mcs>1 && sig.mcs <5 ){
        // 4 QAM
      constellationTargets = [{ x: 1, y: 1 }, { x: 1, y: -1 },{ x: -1, y: 1 },{ x: -1, y: -1 },];
      distance = 2/2;
    } else if(sig.mcs <2){
        // BPSK
      bpskFlag = true;
      constellationTargets = [{ x: 1, y: 0 },{ x: -1, y: 0 } ];
      distance = 2/2;
    } else if (sig.mcs >=5 && sig.mcs <7 ){
        // 16 QAM
      constellationTargets = [ { x: -1.000, y: -1.000 }, { x: -1.000, y: -0.333 }, { x: -1.000, y: 0.333 }, { x: -1.000, y: 1.000 }, { x: -0.333, y: -1.000 }, { x: -0.333, y: -0.333 }, { x: -0.333, y: 0.333 }, { x: -0.333, y: 1.000 }, { x: 0.333, y: -1.000 }, { x: 0.333, y: -0.333 }, { x: 0.333, y: 0.333 }, { x: 0.333, y: 1.000 }, { x: 1.000, y: -1.000 }, { x: 1.000, y: -0.333 }, { x: 1.000, y: 0.333 }, { x: 1.000, y: 1.000 } ];
      distance = .666/2;
    } else if (sig.mcs == 7){
        // 32 QAM
    constellationTargets = [ { x: -1,y: -0.6 },{ x: -1,y: -0.2 },{ x: -1,y: 0.2 },{ x: -1,y: 0.6 },{ x: -0.6,y: -1 },{ x: -0.6,y: -0.6 },{ x: -0.6,y: -0.2 },{ x: -0.6,y: 0.2 },{ x: -0.6,y: 0.6 },{ x: -0.6,y: 1 },{ x: -0.2,y: -1 },{ x: -0.2,y: -0.6 },{ x: -0.2,y: -0.2 },{ x: -0.2,y: 0.2 },{ x: -0.2,y: 0.6 },{ x: -0.2,y: 1 },{ x: 0.2,y: -1 },{ x: 0.2,y: -0.6 },{ x: 0.2,y: -0.2 },{ x: 0.2,y: 0.2 },{ x: 0.2,y: 0.6 },{ x: 0.2,y: 1 },{ x: 0.6,y: -1 },{ x: 0.6,y: -0.6 },{ x: 0.6,y: -0.2 },{ x: 0.6,y: 0.2 },{ x: 0.6,y: 0.6 },{ x: 0.6,y: 1 },{ x: 1,y: -0.6 },{ x: 1,y: -0.2 },{ x: 1,y: 0.2 },{ x: 1,y: 0.6 }]
    distance = .4/2;
    } else if(sig.mcs ==8){
    constellationTargets = [{ x: -1,y: -1 },{ x: -1,y: -0.714 },{ x: -1,y: -0.429 },{ x: -1,y: -0.143 },{ x: -1,y: 0.143 },{ x: -1,y: 0.429 },{ x: -1,y: 0.714 },{ x: -1,y: 1 },{ x: -0.714,y: -1 },{ x: -0.714,y: -0.714 },{ x: -0.714,y: -0.429 },{ x: -0.714,y: -0.143 },{ x: -0.714,y: 0.143 },{ x: -0.714,y: 0.429 },{ x: -0.714,y: 0.714 },{ x: -0.714,y: 1 },{ x: -0.429,y: -1 },{ x: -0.429,y: -0.714 },{ x: -0.429,y: -0.429 },{ x: -0.429,y: -0.143 },{ x: -0.429,y: 0.143 },{ x: -0.429,y: 0.429 },{ x: -0.429,y: 0.714 },{ x: -0.429,y: 1 },{ x: -0.143,y: -1 },{ x: -0.143,y: -0.714 },{ x: -0.143,y: -0.429 },{ x: -0.143,y: -0.143 },{ x: -0.143,y: 0.143 },{ x: -0.143,y: 0.429 },{ x: -0.143,y: 0.714 },{ x: -0.143,y: 1 },{ x: 0.143,y: -1 },{ x: 0.143,y: -0.714 },{ x: 0.143,y: -0.429 },{ x: 0.143,y: -0.143 },{ x: 0.143,y: 0.143 },{ x: 0.143,y: 0.429 },{ x: 0.143,y: 0.714 },{ x: 0.143,y: 1 },{ x: 0.429,y: -1 },{ x: 0.429,y: -0.714 },{ x: 0.429,y: -0.429 },{ x: 0.429,y: -0.143 },{ x: 0.429,y: 0.143 },{ x: 0.429,y: 0.429 },{ x: 0.429,y: 0.714 },{ x: 0.429,y: 1 },{ x: 0.714,y: -1 },{ x: 0.714,y: -0.714 },{ x: 0.714,y: -0.429 },{ x: 0.714,y: -0.143 },{ x: 0.714,y: 0.143 },{ x: 0.714,y: 0.429 },{ x: 0.714,y: 0.714 },{ x: 0.714,y: 1 },{ x: 1,y: -1 },{ x: 1,y: -0.714 },{ x: 1,y: -0.429 },{ x: 1,y: -0.143 },{ x: 1,y: 0.143 },{ x: 1,y: 0.429 },{ x: 1,y: 0.714 },{ x: 1,y: 1 }]
    distance = .286/2;  
    } else if (sig.mcs == 9){
    constellationTargets = [{ x: -1,y: -0.636 },{ x: -1,y: -0.455 },{ x: -1,y: -0.273 },{ x: -1,y: -0.091 },{ x: -1,y: 0.091 },{ x: -1,y: 0.273 },{ x: -1,y: 0.455 },{ x: -1,y: 0.636 },{ x: -0.818,y: -0.636 },{ x: -0.818,y: -0.455 },{ x: -0.818,y: -0.273 },{ x: -0.818,y: -0.091 },{ x: -0.818,y: 0.091 },{ x: -0.818,y: 0.273 },{ x: -0.818,y: 0.455 },{ x: -0.818,y: 0.636 },{ x: -0.636,y: -1 },{ x: -0.636,y: -0.818 },{ x: -0.636,y: -0.636 },{ x: -0.636,y: -0.455 },{ x: -0.636,y: -0.273 },{ x: -0.636,y: -0.091 },{ x: -0.636,y: 0.091 },{ x: -0.636,y: 0.273 },{ x: -0.636,y: 0.455 },{ x: -0.636,y: 0.636 },{ x: -0.636,y: 0.818 },{ x: -0.636,y: 1 },{ x: -0.455,y: -1 },{ x: -0.455,y: -0.818 },{ x: -0.455,y: -0.636 },{ x: -0.455,y: -0.455 },{ x: -0.455,y: -0.273 },{ x: -0.455,y: -0.091 },{ x: -0.455,y: 0.091 },{ x: -0.455,y: 0.273 },{ x: -0.455,y: 0.455 },{ x: -0.455,y: 0.636 },{ x: -0.455,y: 0.818 },{ x: -0.455,y: 1 },{ x: -0.273,y: -1 },{ x: -0.273,y: -0.818 },{ x: -0.273,y: -0.636 },{ x: -0.273,y: -0.455 },{ x: -0.273,y: -0.273 },{ x: -0.273,y: -0.091 },{ x: -0.273,y: 0.091 },{ x: -0.273,y: 0.273 },{ x: -0.273,y: 0.455 },{ x: -0.273,y: 0.636 },{ x: -0.273,y: 0.818 },{ x: -0.273,y: 1 },{ x: -0.091,y: -1 },{ x: -0.091,y: -0.818 },{ x: -0.091,y: -0.636 },{ x: -0.091,y: -0.455 },{ x: -0.091,y: -0.273 },{ x: -0.091,y: -0.091 },{ x: -0.091,y: 0.091 },{ x: -0.091,y: 0.273 },{ x: -0.091,y: 0.455 },{ x: -0.091,y: 0.636 },{ x: -0.091,y: 0.818 },{ x: -0.091,y: 1 },{ x: 0.091,y: -1 },{ x: 0.091,y: -0.818 },{ x: 0.091,y: -0.636 },{ x: 0.091,y: -0.455 },{ x: 0.091,y: -0.273 },{ x: 0.091,y: -0.091 },{ x: 0.091,y: 0.091 },{ x: 0.091,y: 0.273 },{ x: 0.091,y: 0.455 },{ x: 0.091,y: 0.636 },{ x: 0.091,y: 0.818 },{ x: 0.091,y: 1 },{ x: 0.273,y: -1 },{ x: 0.273,y: -0.818 },{ x: 0.273,y: -0.636 },{ x: 0.273,y: -0.455 },{ x: 0.273,y: -0.273 },{ x: 0.273,y: -0.091 },{ x: 0.273,y: 0.091 },{ x: 0.273,y: 0.273 },{ x: 0.273,y: 0.455 },{ x: 0.273,y: 0.636 },{ x: 0.273,y: 0.818 },{ x: 0.273,y: 1 },{ x: 0.455,y: -1 },{ x: 0.455,y: -0.818 },{ x: 0.455,y: -0.636 },{ x: 0.455,y: -0.455 },{ x: 0.455,y: -0.273 },{ x: 0.455,y: -0.091 },{ x: 0.455,y: 0.091 },{ x: 0.455,y: 0.273 },{ x: 0.455,y: 0.455 },{ x: 0.455,y: 0.636 },{ x: 0.455,y: 0.818 },{ x: 0.455,y: 1 },{ x: 0.636,y: -1 },{ x: 0.636,y: -0.818 },{ x: 0.636,y: -0.636 },{ x: 0.636,y: -0.455 },{ x: 0.636,y: -0.273 },{ x: 0.636,y: -0.091 },{ x: 0.636,y: 0.091 },{ x: 0.636,y: 0.273 },{ x: 0.636,y: 0.455 },{ x: 0.636,y: 0.636 },{ x: 0.636,y: 0.818 },{ x: 0.636,y: 1 },{ x: 0.818,y: -0.636 },{ x: 0.818,y: -0.455 },{ x: 0.818,y: -0.273 },{ x: 0.818,y: -0.091 },{ x: 0.818,y: 0.091 },{ x: 0.818,y: 0.273 },{ x: 0.818,y: 0.455 },{ x: 0.818,y: 0.636 },{ x: 1,y: -0.636 },{ x: 1,y: -0.455 },{ x: 1,y: -0.273 },{ x: 1,y: -0.091 },{ x: 1,y: 0.091 },{ x: 1,y: 0.273 },{ x: 1,y: 0.455 },{ x: 1,y: 0.636 }]       
    distance = .181/2;  
    } else if(sig.mcs >9) {
    constellationTargets = [ { x: -1,y: -1 },{ x: -1,y: -0.867 },{ x: -1,y: -0.733 },{ x: -1,y: -0.6 },{ x: -1,y: -0.467 },{ x: -1,y: -0.333 },{ x: -1,y: -0.2 },{ x: -1,y: -0.067 },{ x: -1,y: 0.067 },{ x: -1,y: 0.2 },{ x: -1,y: 0.333 },{ x: -1,y: 0.467 },{ x: -1,y: 0.6 },{ x: -1,y: 0.733 },{ x: -1,y: 0.867 },{ x: -1,y: 1 },{ x: -0.867,y: -1 },{ x: -0.867,y: -0.867 },{ x: -0.867,y: -0.733 },{ x: -0.867,y: -0.6 },{ x: -0.867,y: -0.467 },{ x: -0.867,y: -0.333 },{ x: -0.867,y: -0.2 },{ x: -0.867,y: -0.067 },{ x: -0.867,y: 0.067 },{ x: -0.867,y: 0.2 },{ x: -0.867,y: 0.333 },{ x: -0.867,y: 0.467 },{ x: -0.867,y: 0.6 },{ x: -0.867,y: 0.733 },{ x: -0.867,y: 0.867 },{ x: -0.867,y: 1 },{ x: -0.733,y: -1 },{ x: -0.733,y: -0.867 },{ x: -0.733,y: -0.733 },{ x: -0.733,y: -0.6 },{ x: -0.733,y: -0.467 },{ x: -0.733,y: -0.333 },{ x: -0.733,y: -0.2 },{ x: -0.733,y: -0.067 },{ x: -0.733,y: 0.067 },{ x: -0.733,y: 0.2 },{ x: -0.733,y: 0.333 },{ x: -0.733,y: 0.467 },{ x: -0.733,y: 0.6 },{ x: -0.733,y: 0.733 },{ x: -0.733,y: 0.867 },{ x: -0.733,y: 1 },{ x: -0.6,y: -1 },{ x: -0.6,y: -0.867 },{ x: -0.6,y: -0.733 },{ x: -0.6,y: -0.6 },{ x: -0.6,y: -0.467 },{ x: -0.6,y: -0.333 },{ x: -0.6,y: -0.2 },{ x: -0.6,y: -0.067 },{ x: -0.6,y: 0.067 },{ x: -0.6,y: 0.2 },{ x: -0.6,y: 0.333 },{ x: -0.6,y: 0.467 },{ x: -0.6,y: 0.6 },{ x: -0.6,y: 0.733 },{ x: -0.6,y: 0.867 },{ x: -0.6,y: 1 },{ x: -0.467,y: -1 },{ x: -0.467,y: -0.867 },{ x: -0.467,y: -0.733 },{ x: -0.467,y: -0.6 },{ x: -0.467,y: -0.467 },{ x: -0.467,y: -0.333 },{ x: -0.467,y: -0.2 },{ x: -0.467,y: -0.067 },{ x: -0.467,y: 0.067 },{ x: -0.467,y: 0.2 },{ x: -0.467,y: 0.333 },{ x: -0.467,y: 0.467 },{ x: -0.467,y: 0.6 },{ x: -0.467,y: 0.733 },{ x: -0.467,y: 0.867 },{ x: -0.467,y: 1 },{ x: -0.333,y: -1 },{ x: -0.333,y: -0.867 },{ x: -0.333,y: -0.733 },{ x: -0.333,y: -0.6 },{ x: -0.333,y: -0.467 },{ x: -0.333,y: -0.333 },{ x: -0.333,y: -0.2 },{ x: -0.333,y: -0.067 },{ x: -0.333,y: 0.067 },{ x: -0.333,y: 0.2 },{ x: -0.333,y: 0.333 },{ x: -0.333,y: 0.467 },{ x: -0.333,y: 0.6 },{ x: -0.333,y: 0.733 },{ x: -0.333,y: 0.867 },{ x: -0.333,y: 1 },{ x: -0.2,y: -1 },{ x: -0.2,y: -0.867 },{ x: -0.2,y: -0.733 },{ x: -0.2,y: -0.6 },{ x: -0.2,y: -0.467 },{ x: -0.2,y: -0.333 },{ x: -0.2,y: -0.2 },{ x: -0.2,y: -0.067 },{ x: -0.2,y: 0.067 },{ x: -0.2,y: 0.2 },{ x: -0.2,y: 0.333 },{ x: -0.2,y: 0.467 },{ x: -0.2,y: 0.6 },{ x: -0.2,y: 0.733 },{ x: -0.2,y: 0.867 },{ x: -0.2,y: 1 },{ x: -0.067,y: -1 },{ x: -0.067,y: -0.867 },{ x: -0.067,y: -0.733 },{ x: -0.067,y: -0.6 },{ x: -0.067,y: -0.467 },{ x: -0.067,y: -0.333 },{ x: -0.067,y: -0.2 },{ x: -0.067,y: -0.067 },{ x: -0.067,y: 0.067 },{ x: -0.067,y: 0.2 },{ x: -0.067,y: 0.333 },{ x: -0.067,y: 0.467 },{ x: -0.067,y: 0.6 },{ x: -0.067,y: 0.733 },{ x: -0.067,y: 0.867 },{ x: -0.067,y: 1 },{ x: 0.067,y: -1 },{ x: 0.067,y: -0.867 },{ x: 0.067,y: -0.733 },{ x: 0.067,y: -0.6 },{ x: 0.067,y: -0.467 },{ x: 0.067,y: -0.333 },{ x: 0.067,y: -0.2 },{ x: 0.067,y: -0.067 },{ x: 0.067,y: 0.067 },{ x: 0.067,y: 0.2 },{ x: 0.067,y: 0.333 },{ x: 0.067,y: 0.467 },{ x: 0.067,y: 0.6 },{ x: 0.067,y: 0.733 },{ x: 0.067,y: 0.867 },{ x: 0.067,y: 1 },{ x: 0.2,y: -1 },{ x: 0.2,y: -0.867 },{ x: 0.2,y: -0.733 },{ x: 0.2,y: -0.6 },{ x: 0.2,y: -0.467 },{ x: 0.2,y: -0.333 },{ x: 0.2,y: -0.2 },{ x: 0.2,y: -0.067 },{ x: 0.2,y: 0.067 },{ x: 0.2,y: 0.2 },{ x: 0.2,y: 0.333 },{ x: 0.2,y: 0.467 },{ x: 0.2,y: 0.6 },{ x: 0.2,y: 0.733 },{ x: 0.2,y: 0.867 },{ x: 0.2,y: 1 },{ x: 0.333,y: -1 },{ x: 0.333,y: -0.867 },{ x: 0.333,y: -0.733 },{ x: 0.333,y: -0.6 },{ x: 0.333,y: -0.467 },{ x: 0.333,y: -0.333 },{ x: 0.333,y: -0.2 },{ x: 0.333,y: -0.067 },{ x: 0.333,y: 0.067 },{ x: 0.333,y: 0.2 },{ x: 0.333,y: 0.333 },{ x: 0.333,y: 0.467 },{ x: 0.333,y: 0.6 },{ x: 0.333,y: 0.733 },{ x: 0.333,y: 0.867 },{ x: 0.333,y: 1 },{ x: 0.467,y: -1 },{ x: 0.467,y: -0.867 },{ x: 0.467,y: -0.733 },{ x: 0.467,y: -0.6 },{ x: 0.467,y: -0.467 },{ x: 0.467,y: -0.333 },{ x: 0.467,y: -0.2 },{ x: 0.467,y: -0.067 },{ x: 0.467,y: 0.067 },{ x: 0.467,y: 0.2 },{ x: 0.467,y: 0.333 },{ x: 0.467,y: 0.467 },{ x: 0.467,y: 0.6 },{ x: 0.467,y: 0.733 },{ x: 0.467,y: 0.867 },{ x: 0.467,y: 1 },{ x: 0.6,y: -1 },{ x: 0.6,y: -0.867 },{ x: 0.6,y: -0.733 },{ x: 0.6,y: -0.6 },{ x: 0.6,y: -0.467 },{ x: 0.6,y: -0.333 },{ x: 0.6,y: -0.2 },{ x: 0.6,y: -0.067 },{ x: 0.6,y: 0.067 },{ x: 0.6,y: 0.2 },{ x: 0.6,y: 0.333 },{ x: 0.6,y: 0.467 },{ x: 0.6,y: 0.6 },{ x: 0.6,y: 0.733 },{ x: 0.6,y: 0.867 },{ x: 0.6,y: 1 },{ x: 0.733,y: -1 },{ x: 0.733,y: -0.867 },{ x: 0.733,y: -0.733 },{ x: 0.733,y: -0.6 },{ x: 0.733,y: -0.467 },{ x: 0.733,y: -0.333 },{ x: 0.733,y: -0.2 },{ x: 0.733,y: -0.067 },{ x: 0.733,y: 0.067 },{ x: 0.733,y: 0.2 },{ x: 0.733,y: 0.333 },{ x: 0.733,y: 0.467 },{ x: 0.733,y: 0.6 },{ x: 0.733,y: 0.733 },{ x: 0.733,y: 0.867 },{ x: 0.733,y: 1 },{ x: 0.867,y: -1 },{ x: 0.867,y: -0.867 },{ x: 0.867,y: -0.733 },{ x: 0.867,y: -0.6 },{ x: 0.867,y: -0.467 },{ x: 0.867,y: -0.333 },{ x: 0.867,y: -0.2 },{ x: 0.867,y: -0.067 },{ x: 0.867,y: 0.067 },{ x: 0.867,y: 0.2 },{ x: 0.867,y: 0.333 },{ x: 0.867,y: 0.467 },{ x: 0.867,y: 0.6 },{ x: 0.867,y: 0.733 },{ x: 0.867,y: 0.867 },{ x: 0.867,y: 1 },{ x: 1,y: -1 },{ x: 1,y: -0.867 },{ x: 1,y: -0.733 },{ x: 1,y: -0.6 },{ x: 1,y: -0.467 },{ x: 1,y: -0.333 },{ x: 1,y: -0.2 },{ x: 1,y: -0.067 },{ x: 1,y: 0.067 },{ x: 1,y: 0.2 },{ x: 1,y: 0.333 },{ x: 1,y: 0.467 },{ x: 1,y: 0.6 },{ x: 1,y: 0.733 },{ x: 1,y: 0.867 },{ x: 1,y: 1 }]
    distance = .133/2;
    }
  
    // delete all dots
    d3.select("#constellationParent").selectAll("circle").remove();
  
    svg.append('g')
      .selectAll("dot")
      .data(constellationTargets)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .attr("r", 1.5)
        .style("fill","#1b9e77")
    }

  }
  
  // helper functions

  // }
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