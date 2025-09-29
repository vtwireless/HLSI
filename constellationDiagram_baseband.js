let voltageLimit = 7;

function constellationDiagram_Baseband(){
    document.getElementById("constellationParent").innerHTML = "";
  
        
    let positiveTarget = [
                      { x: -1, y: 0 },
                  ];
    let negativeTarget = [
                    { x: -1, y: 0 },
                ];

    let thresholdTarget = [
                    { x: 0, y: 0 },
                ];

  
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
                width = 460 - margin.left - margin.right,
                height = 160 - margin.top - margin.bottom;
  
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
          .domain([-voltageLimit, voltageLimit])
          .range([ -.001, width * 1.01 ]);
        svg.append("g")
          // sends the line to the bottom
          .attr("transform", "translate(0," + height + ")")
          // make grid lines
          .call(d3.axisBottom(x).tickSize(-height*1).ticks(7))
        // Add X axis label
        svg.append("text")
          .attr("text-anchor", "middle")
          .attr("x", width/2)
          .attr("y", height + margin.top + 15)
          .text("Voltage (V)")
          .style("fill", "#FFFFFF");
        // Add Y axis
        // var y = d3.scaleLinear()
        //   .domain([-1.5, 1.5])
        //   .range([ height, 0]);
        // Create the scale
        var y = d3.scalePoint()
            .domain([""])         // This is what is written on the Axis: from 0 to 100
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
            .style("fill","#f7f7f7")
        svg.append('g')
            .selectAll("dot")
            .data(negativeTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", yVal)
              .attr("r", 2)
              .style("fill","#f7f7f7")
        svg.selectAll(".tick line").attr("stroke", "#FFFFFF")
        svg.selectAll(".tick text").attr("fill", "#FFFFFF")

        // Add a label for BER output
        d3.select("#BERParent")
          .append("div")
          .attr("id", "BERLabel")
          .style("color", "#FFFFFF")
          .style("font-size", "14px")
          .style("margin-top", "10px")
          .text("Bit Error Rate (BER): 0");


  
      // START OF LOOPING CODE
      let counter = 0;
      setInterval(() => {
      // console.log("1 second has passed");
      // const ebno = math.log10(math.abs(sig.sinr))
      // let signalGainLinear = (10 ** (Math.abs(sig.gn)/10)) 
      // let noisePowerLinear = (10 ** (Math.abs(noise.gn)/10));
      // let noisePowerDb = sig.sinr - sig.gn;
      // const noisePower = .1

  
      // const variance = 5
      let variance = noise.gn + 2.34;
      
      // console.log(sig.sinr)
      // console.log(sinrLinear)
      // console.log(variance)
      
  
      // console.log(ebno);
        counter = counter + 1;
        if (counter == 9){
          counter = 0;
          d3.select("#constellationParent").selectAll("circle").remove();

          console.log("10 seconds has passed")
        }
      for (let i = 0; i < 100; i++) {
        BER_stats.sentMessages = BER_stats.sentMessages + 2; // two bits sent per iteration

        svg.append('g')
        .selectAll("dot")
        .data(positiveTarget)
        .enter()
        .append("circle")
          .attr("cx", function (d) { 
            // console.log(d.x + randn_bm() * (1/ebno)**2)
            // creates a variable that can be edited if it goes out of bounds for x and y values
            let xVal = d.x + randn_bm() * (variance);
            // console.log(xVal)
            // console.log(1 + randn_bm() * variance)
            if(xVal<thresholdTarget[0].x) {
              BER_stats.messageErrors += 1;
              console.log("Error!")
            }
            if(xVal<-voltageLimit) xVal = -voltageLimit
            
            return x(xVal); } )
          .attr("cy", yVal )
          .attr("r", 3)
          .style("fill",'#ef8a62')

        svg.append('g')
          .selectAll("dot")
          .data(negativeTarget)
          .enter()
          .append("circle")
            .attr("cx", function (d) { 
              // console.log(d.x + randn_bm() * (1/ebno)**2)
              // creates a variable that can be edited if it goes out of bounds for x and y values
              let xVal = d.x + randn_bm() * variance;
              if(xVal>thresholdTarget[0].x) {
                BER_stats.messageErrors += 1;
                console.log("Error!")
              }
              if(xVal<-voltageLimit) xVal = -voltageLimit

              
              return x(xVal); } )
            .attr("cy", yVal )
            .attr("r", 3)
            .style("fill",'#67a9cf')
        svg.append('g')
          .selectAll("dot")
          .data(positiveTarget)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", yVal )
            .attr("r", 4)
            .style("fill","#f7f7f7")
        svg.append('g')
            .selectAll("dot")
            .data(negativeTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", yVal )
              .attr("r", 4)
              .style("fill","#f7f7f7")
        svg.append('g')
            .selectAll("dot")
            .data(thresholdTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", yVal )
              .attr("r", 4)
              .style("fill","#f7f7f7")
            }

        sig.BER = BER_stats.messageErrors/BER_stats.sentMessages;
        updateBER(sig.BER);
        // console.log("Errors: " + errors);
        // console.log("Total Bits: " + totalBits);
        // console.log("BER: " + sig.BER);
        // console.log(thresholdTarget[0].x)
        // value below is the loop time in miliseconds
    }, 1000);
    

        // Function to update BER value
    function updateBER(value) {
          d3.select("#BERLabel").text(`Bit Error Rate (BER): ${value.toFixed(6)}`);
        }

  
    sig.onChange("gn", update_constellation);
    noise.onChange("gn", update_constellation);

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
      let thresholdTemp = (positiveTarget[0].x + negativeTarget[0].x)/2; 
      thresholdTarget = [
        { x: thresholdTemp, y: -1 },
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
        .attr("r", 4)
        .style("fill","#f7f7f7")
    svg.append('g')
        .selectAll("dot")
        .data(negativeTarget)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", yVal )
          .attr("r", 4)
          .style("fill","#f7f7f7")
    svg.append('g')
        .selectAll("dot")
        .data(thresholdTarget)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", yVal )
          .attr("r", 4)
          .style("fill","#f7f7f7")
    }


  }
  
  // helper functions

  // function randn_bm() {
  //     let u = 0, v = 0;
  //     u = 1- Math.random(); 
  //     v = Math.random();
  //     let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  //     // num = num / 10.0 + 0.5; // Translate to 0 -> 1
  //     // if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  //     //  num = num - 0.5; // added to center around 0
  //     return num
  //   }

  function randn_bm(mean = 0, stdDev = 1) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
}