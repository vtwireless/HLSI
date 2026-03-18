let voltageLimit = 7;
let iterations = 1;
let miniCircuitsFreq = 0;
let miniCircuitsGain = 0;
let miniCircuitsPhase = 0;

function constellationDiagram_Baseband(){

    document.getElementById("constellationParentBaseband").innerHTML = "";
  
            
    fetch("minicircuitsLNA.json")
      .then(response => response.json())
      .then(data => {
        miniCircuitsFreq = data.map(d => d.frequency_Hz);
        miniCircuitsGain = data.map(d => d.gain_dB);
        miniCircuitsPhase = data.map(d => d.phase);
        // console.log(miniCircuitsFreq);
        // console.log(miniCircuitsGain);
        // console.log(miniCircuitsPhase);
        // example analysis
      })


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
        var svg = d3.select("#constellationParentBaseband")
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
          .attr("id", "xAxisLabel")
          .attr("text-anchor", "middle")
          .attr("x", width/2)
          .attr("y", height + margin.top + 16)
          .text("Voltage (Vrms)")
          .style("fill", "#FFFFFF");

        
        var y = d3.scaleLinear()
            .domain([-2, 2])         // This is what is written on the Axis: from 0 to 100
            .range([0, height]);       // This is where the axis is placed: from 100 px to 800px
        svg.append("g")
          // make grid lines
          .call(d3.axisLeft(y).tickSize(-width*1).ticks(5))
          // .call(d3.axisLeft(y).tickValues([1, 2, 3, 4, 5]));
          .selectAll(".tick text").remove()
          svg.selectAll(".tick line").attr("stroke", "#484848")
        // Add Y axis label

          svg.append("text")
            .attr("id", "yAxisLabel")
            .attr("text-anchor", "middle")
            .attr("transform", `rotate(-90)`)
            .attr("x", -height / 2)
            .attr("y", -margin.left + 40)
            .text("tests")
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
      let yValCounter = (height/4)*(counter); // random y value within a band around center


      svg.select("#yAxisLabel")
        .style("font-size", "16px");
      svg.select("#xAxisLabel")
        .style("font-size", "16px");

      setInterval(() => {

      let variance = noise.gn/2;
      if(document.getElementById("mode").value === "advanced"){

        let noisePSD = ((10**(noisePower.gn/10))/2)*(messageRate); // noise PSD
        let physicsVariance = noisePSD /(10**((sigPower.gn + LNAGain)/10)); 
        variance = physicsVariance/positiveTarget[0].x; 


      }
      // console.log(ebno);
        if (counter == 5){
          counter = 0;
          d3.select("#constellationParentBaseband").selectAll("circle").remove();
          d3.select("#constellationParentBaseband").selectAll("path").remove();

          updateBER(sig.BER);

          // console.log("10 seconds has passed")

        }
      for (let i = 0; i < messageRate; i++) {


        BER_stats.sentMessages = BER_stats.sentMessages + 2; // two bits sent per iteration
        if(document.getElementById("mode").value !== "advanced"){
        yValCounter = (height/4)*(counter); //  
        } else {
          // do when in advanced mode
          let freqIndex = miniCircuitsFreq.findIndex(miniCircuitsFreq => Math.abs(miniCircuitsFreq-frequency) <1 );
          phaseShift = miniCircuitsPhase[freqIndex];
          LNAGain = miniCircuitsGain[freqIndex];


        }
        
        svg.append('g')
        .selectAll("dot")
        .data(positiveTarget)
        .enter()
        .append("circle")
          .attr("cx", function (d) { 
            let xVal = d.x + generateNormalRandom() * variance;
            if(mode === "advanced"){

              xVal =  d.x*Math.cos(( phaseShift + correlatorPhase*1)*(Math.PI/180)) + variance* generateNormalRandom();
              yValCounter = d.x*Math.sin(( phaseShift + correlatorPhase*1)*(Math.PI/180)) + variance* generateNormalRandom();

            } else{
              yValCounter = counter-2; // random y value within a band around center
            }
            if(xVal<thresholdTarget[0].x) {
              BER_stats.messageErrors += 1;
            }

              if (!(Math.abs(xVal) < voltageLimit)) xVal = 2*(xVal/Math.abs(xVal)); 

              if (!(Math.abs(yValCounter) < 2)) yValCounter = 2*(yValCounter/Math.abs(yValCounter)); 

            return x(xVal); } )
          .attr("cy", function () { 
            
            return y(yValCounter);})
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
            if(mode === "advanced"){
              

              // yValCounter = distOffset;
              // xVal = xVal * Math.cos(phaseShift*(Math.PI/180))
              xVal =  d.x*Math.cos((phaseShift+correlatorPhase*1)*(Math.PI/180)) + variance* generateNormalRandom();
              yValCounter = d.x*Math.sin((phaseShift + correlatorPhase*1)*(Math.PI/180)) + variance* generateNormalRandom();
            
            } else{
              yValCounter = counter -2; 
            }

              if (xVal > thresholdTarget[0].x) {
                BER_stats.messageErrors += 1;
              }

              if (!(Math.abs(xVal) < voltageLimit)) xVal = 2*(xVal/Math.abs(xVal)); 

              if (!(Math.abs(yValCounter) < 2)) yValCounter = 2*(yValCounter/Math.abs(yValCounter)); 

              return `translate(${x(xVal)}, ${y(yValCounter)}) rotate(${45})`; // turns the plus into a cross
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
    sigPower.onChange("gn", update_constellation);
    noisePower.onChange("gn", update_constellation);
    
    document.getElementById("rateSlider").addEventListener("change", update_constellation);

    document.getElementById("mode").addEventListener("change", update_constellation);
    
    function update_constellation(){
      let advancedMode = document.getElementById("mode").value === "advanced";
      let offset = 1;

      let ebno = (offset*(sig.gn )**2/((noise.gn**2)));
      if(!advancedMode){
        if(!sig.differentialMode) offset = .5;
        ebno = (offset*(sig.gn )**2/((noise.gn**2)));
        let ebnoDb = 10*Math.log10((ebno));
        d3.select("#yAxisLabel").text(`tests`);
        d3.select("#xAxisLabel").text(`Voltage (Vrms)`);


        d3.select("#ebnoLabel").text(`${ebnoDb.toFixed(2)} dB`);
        d3.select("#snrLabel").text(`${ebnoDb.toFixed(2)} dB`);
        d3.select("#sigPower").text(`${(10*Math.log10(offset*sig.gn**2)).toFixed(2)} dB`);
        d3.select("#noisePower").text(`${(10*Math.log10(noise.gn**2)).toFixed(2)} dB`);

      } else {
        freqIndex = miniCircuitsFreq.findIndex(miniCircuitsFreq => Math.abs(miniCircuitsFreq-frequency) <1 );
        phaseShift = miniCircuitsPhase[freqIndex];
        offset = 1;
        if(!sig.differentialMode) offset = .5;
        let ebnodB = (sigPower.gn - noisePower.gn) +10*Math.log10(1/messageRate) + LNAGain;
        let snrdB = (sigPower.gn - noisePower.gn) ;
        d3.select("#yAxisLabel").text(`Quadrature Voltage (Vrms)`);
        d3.select("#xAxisLabel").text(`In Phase Voltage (Vrms)`);

        d3.select("#ebnoLabel").text(`${ebnodB.toFixed(2)} dB`);
        d3.select("#snrLabel").text(`${snrdB.toFixed(2)} dB`);
        d3.select("#sigPower").text(`${sigPower.gn.toFixed(2)} dB`);
        d3.select("#noisePower").text(`${noisePower.gn.toFixed(2)} dB`);
        d3.select("#LNAPhase").text(`${phaseShift.toFixed(2)} degrees`);
        d3.select("#LNAGain").text(`${LNAGain.toFixed(2)} dBm`);

      }
      // console.log(ebno + " linear")
      let tBER = qfunc( Math.sqrt(2*offset*ebno) );

      d3.select("#tBERLabel").text(`${tBER.toFixed(6)}`);

      let NewX = sig.gn/Math.sqrt(2);

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
    d3.select("#constellationParentBaseband").selectAll("circle").remove();
    d3.select("#constellationParentBaseband").selectAll("path").remove();

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

