let iterations = 0;

function BER_plot(){
  let ebno = sig.gn-noise.gn;

    let ebnoPoints = [
                  { x: sig.gn, y: sig.ber },
                 ];

  updateBERTable();

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
        .domain([0, 20])
        .range([ -.001, width ]);
      svg.append("g")
        // sends the line to the bottom
        .attr("transform", "translate(0," + height + ")")
        // make grid lines
        .call(d3.axisBottom(x).tickSize(-height*1).ticks(7))

      // Add Y axis
      var y = d3.scaleLog()
        .domain([10**-8, 1])
        .range([ height, 0]);
      svg.append("g")
        // make grid lines
        .call(d3.axisLeft(y).tickSize(-width*1).ticks(7))
        // stroke lines
        svg.selectAll(".tick line").attr("stroke", "#FFFFFF")
        svg.selectAll(".tick text").attr("fill", "#FFFFFF")           

          
  generatePSKSERCurve();


  ///////////// QAM SER curve generation /////////////
  function generateQAMSERCurve(){

      const points2QAM = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          let berPoints2QAM = qfunc(Math.sqrt(2* linearEbno));
          points2QAM.push({ x: i, y: berPoints2QAM });
        }

        const line2QAM = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points2QAM)
          .attr("fill", "none")
          .attr("stroke", "#c51b7d")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line2QAM)
          .attr("clip-path", "url(#clip)");

        // Define a clipping path
        svg.append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height);

        const points_4QAM = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          // let ber = qfunc(Math.sqrt(linearEbno)) + qfunc(Math.sqrt(2*linearEbno));
          // points_QPSK.push({ x: i, y: ber });
          constellationTargets = [ { x: .707, y: .707 }, { x: .707, y: -.707 },{ x: -.707, y: .707 },{ x: -.707, y: -.707 }];
          let symbolErrorRate = getExpectedSymbolErrorRate(constellationTargets, linearEbno)
          points_4QAM.push({ x: i, y: symbolErrorRate });
        }

        const line_4QAM = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_4QAM)
          .attr("fill", "none")
          .attr("stroke", "#e9a3c9")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_4QAM)
          .attr("clip-path", "url(#clip)");


///////////////////// 8  QAM SER curve /////////////////////
        const points_8QAM = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          // let ber = qfunc(Math.sqrt(linearEbno)) + qfunc(Math.sqrt(2*linearEbno));
          // points_QPSK.push({ x: i, y: ber });

          
          // let symbolErrorRate = 3 * qfunc((1/5)*Math.sqrt(linearEbno));

          // 8 QAM
          constellationTargets8QAM = getConstellationTargets(5);
          symbolErrorRate = getExpectedSymbolErrorRate(constellationTargets8QAM, linearEbno)
          points_8QAM.push({ x: i, y: symbolErrorRate });
        }

        const line_8QAM = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_8QAM)
          .attr("fill", "none")
          .attr("stroke", "#fde0ef")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_8QAM)
          .attr("clip-path", "url(#clip)");
//////////////////// /////// REPEAT FOR 16 QAM /////////////////////////
        const points_16QAM = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          // let ber = qfunc(Math.sqrt(linearEbno)) + qfunc(Math.sqrt(2*linearEbno));
          // points_QPSK.push({ x: i, y: ber });

          
          // let symbolErrorRate = 3 * qfunc((1/5)*Math.sqrt(linearEbno));

          // 16 QAM
          constellationTargets16QAM = getConstellationTargets(7);
          symbolErrorRate = getExpectedSymbolErrorRate(constellationTargets16QAM, linearEbno)
          // console.log("16 QAM SER at EbNo " + i + " dB: " + symbolErrorRate);
          points_16QAM.push({ x: i, y: symbolErrorRate });
        }

        const line_16QAM = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_16QAM)
          .attr("fill", "none")
          .attr("stroke", "#fde0ef")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_16QAM)
          .attr("clip-path", "url(#clip)");

  }


  ///////////// PSK SER curve generation /////////////
  function generatePSKSERCurve(){

      const points2PSK = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          let berPoints2PSK = qfunc(Math.sqrt(2* linearEbno));
          points2PSK.push({ x: i, y: berPoints2PSK });
        }

        const line2PSK = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points2PSK)
          .attr("fill", "none")
          .attr("stroke", "#c51b7d")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line2PSK)
          .attr("clip-path", "url(#clip)");

        // Define a clipping path
        svg.append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height);

        const points_4PSK = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          // let ber = qfunc(Math.sqrt(linearEbno)) + qfunc(Math.sqrt(2*linearEbno));
          // points_QPSK.push({ x: i, y: ber });
          berPoints4PSK = [ { x: 1, y: 0 }, { x: -1, y: 0 },{ x: 0, y: 1 },{ x: 0, y: -1 },];
          symbolErrorRate4PSK = getPSKSER(4, linearEbno)

          // let symbolErrorRate4PSK = getExpectedSymbolErrorRate(berPoints4PSK, linearEbno)
          points_4PSK.push({ x: i, y: symbolErrorRate4PSK });
        }

        const line_4PSK = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_4PSK)
          .attr("fill", "none")
          .attr("stroke", "#e9a3c9")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_4PSK)
          .attr("clip-path", "url(#clip)");


///////////////////// 8  QAM SER curve /////////////////////
        const points_8PSK = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          // 8 QAM
          constellationTargets8PSK = [
          { x: Math.cos(0), y: Math.sin(0) },
          { x: Math.cos(Math.PI / 4), y: Math.sin(Math.PI / 4) },
          { x: Math.cos(Math.PI / 2), y: Math.sin(Math.PI / 2) },
          { x: Math.cos((3 * Math.PI) / 4), y: Math.sin((3 * Math.PI) / 4) },
          { x: Math.cos(Math.PI), y: Math.sin(Math.PI) },
          { x: Math.cos((5 * Math.PI) / 4), y: Math.sin((5 * Math.PI) / 4) },
          { x: Math.cos((3 * Math.PI) / 2), y: Math.sin((3 * Math.PI) / 2) },
          { x: Math.cos((7 * Math.PI) / 4), y: Math.sin((7 * Math.PI) / 4) }
        ];
          symbolErrorRate8PSK = getPSKSER(8, linearEbno)

          // symbolErrorRate8PSK = getExpectedSymbolErrorRate(constellationTargets8PSK, linearEbno)
          points_8PSK.push({ x: i, y: symbolErrorRate8PSK });
        }

        const line_8PSK = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_8PSK)
          .attr("fill", "none")
          .attr("stroke", "#fde0ef")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_8PSK)
          .attr("clip-path", "url(#clip)");
//////////////////// /////// REPEAT FOR 16 QAM /////////////////////////
        const points_16PSK = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          // 16 QAM
          constellationTargets16PSK =  Array.from({ length: 16 }, (_, i) => ({
        x: Math.cos((2 * Math.PI * i) / 16),
        y: Math.sin((2 * Math.PI * i) / 16),
      }));
          symbolErrorRate16PSK = getPSKSER(16, linearEbno)
          // symbolErrorRate16PSK = getExpectedSymbolErrorRate(constellationTargets16PSK, linearEbno)
          points_16PSK.push({ x: i, y: symbolErrorRate16PSK });
        }

        const line_16PSK = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_16PSK)
          .attr("fill", "none")
          .attr("stroke", "#fde0ef")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_16PSK)
          .attr("clip-path", "url(#clip)");

  }

  ///////////// QAM BER curve generation /////////////
  function generateQAMBERCurve(){

      const points2QAM = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          let berPoints2QAM = qfunc(Math.sqrt(2* linearEbno));
          points2QAM.push({ x: i, y: berPoints2QAM });
        }

        const line2QAM = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points2QAM)
          .attr("fill", "none")
          .attr("stroke", "#c51b7d")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line2QAM)
          .attr("clip-path", "url(#clip)");

        // Define a clipping path
        svg.append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height);
        constellationTargets4QAMBER = [ { x: .707, y: .707 }, { x: .707, y: -.707 },{ x: -.707, y: .707 },{ x: -.707, y: -.707 }];

        const points_4QAM = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);

          // let bitErrorRate4QAM = getQAMBER(4, linearEbno)
          let bitErrorRate4QAM = getExpectedBitErrorRate(constellationTargets4QAMBER, linearEbno, 2);

          points_4QAM.push({ x: i, y: bitErrorRate4QAM });
        }

        const line_4QAM = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_4QAM)
          .attr("fill", "none")
          .attr("stroke", "#e9a3c9")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_4QAM)
          .attr("clip-path", "url(#clip)");


///////////////////// 8  QAM BER curve /////////////////////
        const points_8QAM = [];
        constellationTargets8QAM = getConstellationTargets(5);

        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          // 8 QAM
          bitErrorRate8QAM = getQAMBER(8, linearEbno)
          // let bitErrorRate8QAM = getExpectedBitErrorRate(constellationTargets8QAM, linearEbno, 3);

          points_8QAM.push({ x: i, y: bitErrorRate8QAM });
        }

        const line_8QAM = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_8QAM)
          .attr("fill", "none")
          .attr("stroke", "#fde0ef")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_8QAM)
          .attr("clip-path", "url(#clip)");
//////////////////// /////// REPEAT FOR 16 QAM /////////////////////////
        const points_16QAM = [];
        constellationTargets16QAM = getConstellationTargets(7);

        for (let i = -5; i <= 20; i++) {
          // let energyPerBit = i-10*Math.log10(4);
          let energyPerBit = i;

          let linearEbno = 10**(energyPerBit/10);
          // 16 QAM

          // let bitErrorRate16QAM = getQAMBER(16, linearEbno);
          let bitErrorRate16QAM = getExpectedBitErrorRate(constellationTargets16QAM, linearEbno, 4);

          points_16QAM.push({ x: i, y: bitErrorRate16QAM });
        }

        const line_16QAM = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_16QAM)
          .attr("fill", "none")
          .attr("stroke", "#16e024ff")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_16QAM)
          .attr("clip-path", "url(#clip)");

  }


  ///////////// PSK SER curve generation /////////////
  function generatePSKBERCurve(){

      const points2PSK = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          let berPoints2PSK = qfunc(Math.sqrt(2* linearEbno));
          points2PSK.push({ x: i, y: berPoints2PSK });
        }

        const line2PSK = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points2PSK)
          .attr("fill", "none")
          .attr("stroke", "#c51b7d")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line2PSK)
          .attr("clip-path", "url(#clip)");

        // Define a clipping path
        svg.append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height);

        const points_4PSK = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);

          let symbolErrorRate4PSK = getPSKBER(4, linearEbno)
          points_4PSK.push({ x: i, y: symbolErrorRate4PSK });
        }

        const line_4PSK = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_4PSK)
          .attr("fill", "none")
          .attr("stroke", "#e9a3c9")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_4PSK)
          .attr("clip-path", "url(#clip)");


///////////////////// 8  PSK SER curve /////////////////////
        const points_8PSK = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);

          symbolErrorRate8PSK = getPSKBER(8, linearEbno)
          points_8PSK.push({ x: i, y: symbolErrorRate8PSK });
        }

        const line_8PSK = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_8PSK)
          .attr("fill", "none")
          .attr("stroke", "#fde0ef")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_8PSK)
          .attr("clip-path", "url(#clip)");
//////////////////// /////// REPEAT FOR 16 PSK /////////////////////////
        const points_16PSK = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);

          symbolErrorRate16PSK = getPSKBER(16, linearEbno)
          points_16PSK.push({ x: i, y: symbolErrorRate16PSK });
        }

        const line_16PSK = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_16PSK)
          .attr("fill", "none")
          .attr("stroke", "#fde0ef")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_16PSK)
          .attr("clip-path", "url(#clip)");

  }

    document.getElementById("toggleBER_SERButton").addEventListener("click", function() {
      const button = document.getElementById("toggleBER_SERButton");
      if (button.innerText === "show SER") {
        button.innerText = "show BER";
        sendingBits = 0;
      } else {
        button.innerText = "show SER";
        sendingBits = 1;
      }
      // Remove all points and lines from the graph
      svg.selectAll("path").remove();
      svg.selectAll("circle").remove();

      // Regenerate the SER curves based on the new modulation type
      if (modTypeCode == 1){
        if (button.innerText === "show SER") {
          generatePSKBERCurve();
        } else {
          generatePSKSERCurve();
        }
      } else if (modTypeCode == 2){
        if (button.innerText === "show SER") {
          generateQAMBERCurve();
        } else {
          generateQAMSERCurve();
        }
      }
      updateBERTable();

    });
        
    document.getElementById("sendMessageButton").addEventListener("click", function() {
      d3.select("#BER_plotParent").selectAll("circle").style("fill", "#a3a3a3");
      // ebno = calculateEbno(sig.gn, noise.gn, modulationOrder, sendingBits);
      if(sendingBits=== 0 ){ 
        ebno = sig.gn-noise.gn;
      }
      else if(sendingBits == 1){
        
        ebno = sig.gn-noise.gn - 10*Math.log10(modulationOrder);
        // ebno = sig.gn-noise.gn; 
      } 
        ebnoPoints = [
                  { x: ebno, y: sig.BER },
                 ];
        switch (sig["mcs"]) {
          case 0:
          svg.append('g')
            .selectAll("dot")
            .data(ebnoPoints)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 4)
              .style("fill","#c51b7d")
            break;
          case 3:
          svg.append('g')
            .selectAll("dot")
            .data(ebnoPoints)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 4)
              .style("fill","#e9a3c9")
            break;
          case 5:
          svg.append('g')
            .selectAll("dot")
            .data(ebnoPoints)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 4)
              .style("fill","#fde0ef")
            break;
          case 7:
          svg.append('g')
            .selectAll("dot")
            .data(ebnoPoints)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 4)
              .style("fill","#f7f7f7")
            break;
          case 8:
          svg.append('g')
            .selectAll("dot")
            .data(ebnoPoints)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 4)
              .style("fill","#e6f5d0")
            break;
          case 9:
          svg.append('g')
            .selectAll("dot")
            .data(ebnoPoints)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 4)
              .style("fill","#a1d76a")
            break;
          case 11:
          svg.append('g')
            .selectAll("dot")
            .data(ebnoPoints)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.x); } )
              .attr("cy", function (d) { return y(d.y); } )
              .attr("r", 4)
              .style("fill","#4d9221")
            break;
        } // end switch statement

        updateBERTable();


      }); // end send message button event listener
      


      sig.onChange("mcs", clearErrorRate);
      sig.onChange("gn", clearErrorRate);
      noise.onChange("gn", clearErrorRate);


      function clearErrorRate() {
        updateBERTable();
        BER_stats.reset()
        // console.log("Resetting BER stats");
        // console.log("Sent Messages: " + BER_stats.sentMessages);
        // console.log("Message Errors: " + BER_stats.messageErrors);


      }

      function updateBERTable(){
        // Update BER table
        
        constellation_targets = getConstellationTargets(sig.mcs);

        let TheoErrorRate= 0;
        if (sendingBits === 1){
          
          // ebno = sig.gn-noise.gn;
          if (modTypeCode === 2){
            ebno = sig.gn-noise.gn - 10*Math.log10(modulationOrder);
            // TheoErrorRate = getQAMBER(2**modulationOrder, 10**(ebno/10));
            TheoErrorRate= getExpectedBitErrorRate(constellation_targets, linearEbno, 4);
            // console.log("Theoretical BER QAM: " + TheoErrorRate);
          } else if (modTypeCode ===1){
            ebno = sig.gn-noise.gn - 10*Math.log10(modulationOrder);
            TheoErrorRate = getPSKBER(2**modulationOrder, 10**(ebno/10));
          }
        } else {
          ebno = sig.gn-noise.gn;
          TheoErrorRate = getPSKSER(2**modulationOrder, 10**(ebno/10))
          // TheoErrorRate = getExpectedSymbolErrorRate(constellation_targets, 10**(ebno/10));
        }


        d3.select("#BERLabel").text(`${(isNaN(sig.BER) ? "No Data" : sig.BER.toFixed(8))}`);
        d3.select("#iterationsLabel").text(`${BER_stats.sentMessages}`);
        d3.select("#ebnoLabel").text(`${ebno.toFixed(2)} dB`);
        d3.select("#tBERLabel").text(`${TheoErrorRate.toFixed(8)}`);
      }


    document.getElementById("modulationType").addEventListener("change", function() {
      // notably modTypeCode is a global variable and there is 
      // another function that does this exact thing in constellationDiagram_base.js
      modTypeCode = parseInt(modulationType.value, 10);
      console.log("Selected Modulation Type:", modTypeCode);

      // Remove all points and lines from the graph
      svg.selectAll("path").remove();
      svg.selectAll("circle").remove();

      // Regenerate the SER curves based on the new modulation type
      const button = document.getElementById("toggleBER_SERButton");
      if (modTypeCode == 1){
        if (button.innerText === "show SER") {
          generatePSKBERCurve();
        } else {
          generatePSKSERCurve();
        }
      } else if (modTypeCode == 2){
        if (button.innerText === "show SER") {
          generateQAMBERCurve();
        } else {
          generateQAMSERCurve();
        }
      }

    });

      // ebno = calculateEbno(sig.gn, noise.gn, modulationOrder, sendingBits);

    function calculateEbno(signalGain, noiseGain, modulationOrder, sendingBits){
      if (sendingBits === 1){

        if (modTypeCode === 2){
          // if QAM
            ebno =signalGain-noiseGain - 10*Math.log10(modulationOrder);
          } else if (modTypeCode ===1){
            // if PSK
            ebno = signalGain-noiseGain - 10*Math.log10(modulationOrder);
          }
      } else {
        ebno = sig.gn-noise.gn;

      }
    }
    
}
  
  // helper functions
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


function qfunc(x) {
    return 0.5 * (1 - erf_hastings(x / Math.sqrt(2)));
}
  
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

    /* ***** function for SER calculations ***** 
      constellation_targets: array of objects with x and y properties
      esno: LINEAR energy per symbol* value - *not* energy per bit
    */
function getExpectedSymbolErrorRate(constellation_targets, esno){
  let qFuncValues = [];
  for (let i = 0; i < constellation_targets.length; i++) {
    for (let j = 0; j < constellation_targets.length; j++) {
      if (j === i) continue;
      // Perform operations with constellation_targets[j]
      let distance = Math.sqrt(Math.pow(constellation_targets[i].x - constellation_targets[j].x, 2) + Math.pow(constellation_targets[i].y - constellation_targets[j].y, 2));
      qFuncValues.push(qfunc(distance * Math.sqrt(esno/2)) );
    }
  }
  let sumQFuncValues = qFuncValues.reduce((acc, val) => acc + val, 0);
  return (1 / constellation_targets.length) * sumQFuncValues;
  // QAMser = 4*(1-1/Math.sqrt(constellation_targets.length))*qfunc(Math.sqrt((3*esno)/(constellation_targets.length-1)))
  // return QAMser;
}

// could be use to get BER from SER INCOMPLETE
function getExpectedBitErrorRate(constellation_targets, esno, M){
  let qFuncValues = [];
  for (let i = 0; i < constellation_targets.length; i++) {
    for (let j = 0; j < constellation_targets.length; j++) {
      if (j === i) continue;
      // Perform operations with constellation_targets[j]
      let distance = Math.sqrt(Math.pow(constellation_targets[i].x - constellation_targets[j].x, 2) + Math.pow(constellation_targets[i].y - constellation_targets[j].y, 2));
      qFuncValues.push(qfunc(distance * Math.sqrt(esno/2)) );
    }
  }
  let sumQFuncValues = qFuncValues.reduce((acc, val) => acc + val, 0);
  let symbolErrorRate = (1 / constellation_targets.length) * sumQFuncValues;
  // let bitErrorRate = symbolErrorRate / M;  //  1 bit error per log2(M) bits per symbol
  // let bitErrorRate = symbolErrorRate / 2; // half of the bits in error
  let bitErrorRate = symbolErrorRate / ((M + 1) / 2); // average errors per symbol assuming uniform distribution


  return bitErrorRate;


}


function getConstellationTargets(mcs){

  if (modTypeCode === 1) {
        if(mcs <2){
          // PSK
        constellationTargets = [{ x: 1.414, y: 0 },{ x: -1.414, y: 0 } ];

      } else if(mcs >=2 && mcs <4){
          // QPSK
        constellationTargets = [
          { x: Math.cos(0), y: Math.sin(0) },
          { x: Math.cos(Math.PI / 2), y: Math.sin(Math.PI / 2) },
          { x: Math.cos(Math.PI), y: Math.sin(Math.PI) },
          { x: Math.cos((3 * Math.PI) / 2), y: Math.sin((3 * Math.PI) / 2) },
        ];      
      } else if (mcs >=5 && mcs <7 ){
          // 8 PSK
        constellationTargets = [
          { x: Math.cos(0), y: Math.sin(0) },
          { x: Math.cos(Math.PI / 4), y: Math.sin(Math.PI / 4) },
          { x: Math.cos(Math.PI / 2), y: Math.sin(Math.PI / 2) },
          { x: Math.cos((3 * Math.PI) / 4), y: Math.sin((3 * Math.PI) / 4) },
          { x: Math.cos(Math.PI), y: Math.sin(Math.PI) },
          { x: Math.cos((5 * Math.PI) / 4), y: Math.sin((5 * Math.PI) / 4) },
          { x: Math.cos((3 * Math.PI) / 2), y: Math.sin((3 * Math.PI) / 2) },
          { x: Math.cos((7 * Math.PI) / 4), y: Math.sin((7 * Math.PI) / 4) }
        ];

      } else if (mcs == 7){
          // 16 PSK
      constellationTargets = Array.from({ length: 16 }, (_, i) => ({
        x: Math.cos((2 * Math.PI * i) / 16),
        y: Math.sin((2 * Math.PI * i) / 16),
      }));

      } 
    } else if (modTypeCode == 2){
      //////////// GENERATE TARGETS FOR QAM MODULATION ////////////
        if(mcs <2){
          // 2 QAM
        constellationTargets = [{ x: 1, y: 0 },{ x: -1, y: 0 } ];

        distance = 2/2;
        // targetColor = "#e9a3c9";
      } else if(mcs >=2 && mcs <4){
          // 4 QAM
        constellationTargets = [ { x: .707, y: .707 }, { x: .707, y: -.707 },{ x: -.707, y: .707 },{ x: -.707, y: -.707 }];
        // targetColor = "#c51b7d";
      } else if (mcs >=5 && mcs <7 ){
          // 8 QAM
        constellationTargets =  [ { x: 1.414, y: 1.414 }, { x: 1.414, y: -1.414 }, { x: -1.414, y: 1.414 }, { x: -1.414, y: -1.414 }, { x: -.586, y: -.586 }, { x: .586, y: -.586 }, { x: -.586, y: .586 }, { x: .586, y: .586 } ];
        // targetColor = "#f7f7f7";
      } else if (mcs ==7 ){
        constellationTargets = [ { x: -1.5, y: -1.5 }, { x: -1.5, y: -0.5 }, { x: -1.5, y: 0.5 }, { x: -1.5, y: 1.5 }, { x: -0.5, y: -1.5 }, { x: -0.5, y: -0.5 }, { x: -0.5, y: 0.5 }, { x: -0.5, y: 1.5 }, { x: 0.5, y: -1.5 }, { x: 0.5, y: -0.5 }, { x: 0.5, y: 0.5 }, { x: 0.5, y: 1.5 }, { x: 1.5, y: -1.5 }, { x: 1.5, y: -0.5 }, { x: 1.5, y: 0.5 }, { x: 1.5, y: 1.5 } ];
        distance = .666/2;
        // targetColor = "#fde0ef";
      }
    }
      return constellationTargets;

  }

  
  function getQAMBER(M, ebno){
    pError = (4*(Math.sqrt(M)-1)/(Math.sqrt(M)*Math.log2(M))) * qfunc(Math.sqrt((3*ebno*Math.log2(M))/(M-1)));

    return pError;
  }

    function getPSKBER(M, ebno){
    pError = ((2)/(Math.log2(M))) * qfunc(Math.sqrt((2*ebno*Math.log2(M)))*Math.sin(Math.PI/M));

    return pError;
  }


function getPSKSER(M, ebno){
    pskSER = (2*(M-1)/M) * qfunc(Math.sqrt(6*ebno/(M**2-1)))

    return pskSER;
  }