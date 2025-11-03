let voltageLimit = 7;
let iterations = 1;

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
                height = 240 - margin.top - margin.bottom;
  
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

        
        var y = d3.scaleLinear()
            .domain([1, 5])         // This is what is written on the Axis: from 0 to 100
            .range([0, height]);       // This is where the axis is placed: from 100 px to 800px
        svg.append("g")
          // make grid lines
          .call(d3.axisLeft(y).tickSize(-width*1).ticks(5))
          // stroke lines
          svg.selectAll(".tick line").attr("stroke", "#484848")
        // Add Y axis label
        svg.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", `rotate(-90)`)
          .attr("x", -height / 2)
          .attr("y", -margin.left + 25)
          .text("Samples")
          .style("fill", "#FFFFFF");
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
      let variance = noise.gn;
      // let variance = noise.gn;

      // console.log(sig.sinr)
      // console.log(sinrLinear)
      // console.log(variance)
      
      // console.log(ebno);
        if (counter == 5){
          counter = 0;
          d3.select("#constellationParent").selectAll("circle").remove();
          d3.select("#constellationParent").selectAll("path").remove();

          updateBER(sig.BER);

          // console.log("10 seconds has passed")

        }

      for (let i = 0; i < messageRate; i++) {

        BER_stats.sentMessages = BER_stats.sentMessages + 2; // two bits sent per iteration
        let yValRand = (height/4)*(counter); // random y value within a band around center

        svg.append('g')
        .selectAll("dot")
        .data(positiveTarget)
        .enter()
        .append("circle")
          .attr("cx", function (d) { 
            let xVal = d.x + generateNormalRandom() * variance;
            if(xVal<thresholdTarget[0].x) {
              BER_stats.messageErrors += 1;
            }
            if(xVal<-voltageLimit) xVal = -voltageLimit
            
            return x(xVal); } )
          .attr("cy", yValRand )
          .attr("r", 3)
          .style("fill", "none") // Makes the circle open
          .style("stroke", '#ef8a62') // Adds a border color
          .style("stroke-width", 1); // Sets the border width

        svg.append('g')
          .selectAll("dot")
          .data(negativeTarget)
          .enter()
          .append("path")
            .attr("d", d3.symbol().type(d3.symbolCross).size(30)) // Use a times symbol
            .attr("transform", function (d) { 
                let xVal = d.x + variance* generateNormalRandom();

                let rotation = 45; // Rotation angle in degrees
              if (xVal > thresholdTarget[0].x) {
                BER_stats.messageErrors += 1;
              }
              if (xVal < -voltageLimit) xVal = -voltageLimit;

              return `translate(${x(xVal)}, ${yValRand}) rotate(${rotation})`; 
            })
            .style("fill", '#67a9cf');


        svg.append('g')
          .selectAll("dot")
          .data(positiveTarget)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", yVal )
            .attr("r", 3)
            .style("fill","#f7f7f7")
        svg.append('g')
            .selectAll("dot")
            .data(negativeTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", yVal )
              .attr("r", 3)
              .style("fill","#f7f7f7")
        svg.append('g')
            .selectAll("dot")
            .data(thresholdTarget)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", yVal )
              .attr("r", 3)
              .style("fill","#f7f7f7")
            }
        sig.BER = BER_stats.messageErrors/BER_stats.sentMessages;

        // console.log("Errors: " + errors);
        // console.log("Total Bits: " + totalBits);
        // console.log("BER: " + sig.BER);
        // console.log(thresholdTarget[0].x)
        // value below is the loop time in miliseconds
        counter = counter + 1;
    }, 1000);
    

        // Function to update BER value
    function updateBER(value) {

          d3.select("#iterationsLabel").text(`${iterations}`);
          iterations = iterations + 1;
          d3.select("#BERLabel").text(`${value.toFixed(6)}`);
        }

  
    sig.onChange("gn", update_constellation);
    noise.onChange("gn", update_constellation);

    function update_constellation(){

      // let ebno = ((sig.gn)/(noise.gn));
      // let ebnoDb = 10*Math.log10(ebno);

      let offset = 1;
      if(!sig.differentialMode) offset = .5;
      let ebno = ((sig.gn*offset)**2/(noise.gn)**2);
      let ebnoDb = 10*Math.log10((ebno));
      d3.select("#ebnoLabel").text(`${ebnoDb.toFixed(2)} dB`);
      console.log(ebno + " linear")
      let tBER = .5 * (1-erf_hastings(Math.sqrt(ebno)/Math.sqrt(2)));
      d3.select("#tBERLabel").text(`${tBER.toFixed(6)}`);

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
    d3.select("#constellationParent").selectAll("path").remove();

    svg.append('g')
      .selectAll("dot")
      .data(positiveTarget)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", yVal )
        .attr("r", 3)
        .style("fill","#f7f7f7")
    svg.append('g')
        .selectAll("dot")
        .data(negativeTarget)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", yVal )
          .attr("r", 3)
          .style("fill","#f7f7f7")
    svg.append('g')
        .selectAll("dot")
        .data(thresholdTarget)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", yVal )
          .attr("r", 3)
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

function generateNormalRandom(mean = 0, stdDev = 1) {
          let u1 = Math.random();
          let u2 = Math.random();
          let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          return z0 * stdDev + mean;
      }

function erf_hastings(x) {
  hastings_R1 = R([0, 0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429])
  return Math.sign(x) * (1 - Math.exp(-x * x) * hastings_R1(1 / (1 + 0.3275911 * Math.abs(x))));
}
function R(P, Q = []) {
  const l = P.length - 1, m = Q.length - 1;
  if (l === 5 && m < 0) return R_5(P);
  if (l === 4 && m === 4) return R_4_4(P, Q);
  if (l === 5 && m === 4) return R_5_4(P, Q);
  if (l === 5 && m === 5) return R_5_5(P, Q);
  if (l === 6 && m === 5) return R_6_5(P, Q);
  if (l === 8 && m === 7) return R_8_7(P, Q);
  throw new Error(`unsupported degree ${l},${m}`);
}

function R_5([p0, p1, p2, p3, p4, p5]) {
  return z => p0 + z * (p1 + z * (p2 + z * (p3 + z * (p4 + z * p5))));
}

