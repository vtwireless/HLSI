function BER_plot(){
  let ebno = sig.gn-noise.gn;

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
        .domain([0, 20])
        .range([ -.001, width * 1.01 ]);
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

        const points = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          let ber = qfunc(Math.sqrt(linearEbno));
          points.push({ x: i, y: ber });
        }

        const line = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points)
          .attr("fill", "none")
          .attr("stroke", "#c51b7d")
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

        const points_QPSK = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          // let ber = qfunc(Math.sqrt(linearEbno)) + qfunc(Math.sqrt(2*linearEbno));
          // points_QPSK.push({ x: i, y: ber });

          let symbolErrorRate = 2*qfunc(Math.sqrt(linearEbno)) + qfunc(Math.sqrt(2*linearEbno));
          points_QPSK.push({ x: i, y: symbolErrorRate });
        }

        const line_QPSK = d3.line()
          .x(d => x(d.x))
          .y(d => y(d.y));

        svg.append("path")
          .datum(points_QPSK)
          .attr("fill", "none")
          .attr("stroke", "#e9a3c9")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4 4") // Creates a dashed line
          .attr("d", line_QPSK)
          .attr("clip-path", "url(#clip)");

        const points_16QAM = [];
        for (let i = -5; i <= 20; i++) {
          
          let linearEbno = 10**(i/10);
          // let ber = qfunc(Math.sqrt(linearEbno)) + qfunc(Math.sqrt(2*linearEbno));
          // points_QPSK.push({ x: i, y: ber });

          
          // let symbolErrorRate = 3 * qfunc((1/5)*Math.sqrt(linearEbno));

          // 16 QAM
          constellationTargets16QAM = [ { x: -1.000, y: -1.000 }, { x: -1.000, y: -0.333 }, { x: -1.000, y: 0.333 }, { x: -1.000, y: 1.000 }, { x: -0.333, y: -1.000 }, { x: -0.333, y: -0.333 }, { x: -0.333, y: 0.333 }, { x: -0.333, y: 1.000 }, { x: 0.333, y: -1.000 }, { x: 0.333, y: -0.333 }, { x: 0.333, y: 0.333 }, { x: 0.333, y: 1.000 }, { x: 1.000, y: -1.000 }, { x: 1.000, y: -0.333 }, { x: 1.000, y: 0.333 }, { x: 1.000, y: 1.000 } ];
          symbolErrorRate = getExpectedSymbolErrorRate(constellationTargets16QAM, linearEbno)
          console.log("16 QAM SER at EbNo " + i + " dB: " + symbolErrorRate);
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




        
      setInterval(() => {
        ebno = sig.gn-noise.gn;
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
          case 2:
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
          case 10:
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
        }

      }, refreshRate);

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
  return 1 / constellation_targets.length * sumQFuncValues;
}

// function getExpectedBitErrorRate(constellation_targets, esno){
//   let qFuncValues = [];
//   let bitErrorsPerSymbol = Math.log2(constellation_targets.length);
//   for (let i = 0; i < constellation_targets.length; i++) {
//     for (let j = 0; j < constellation_targets.length; j++) {
//       if (j === i) continue;
//       // Perform operations with constellation_targets[j]
//       let distance = Math.sqrt(Math.pow(constellation_targets[i].x - constellation_targets[j].x, 2) + Math.pow(constellation_targets[i].y - constellation_targets[j].y, 2));
//       qFuncValues.push(qfunc(distance * Math.sqrt(esno/2)) );
//     }
//   }
//   let sumQFuncValues = qFuncValues.reduce((acc, val) => acc + val, 0);
//   return 1 / constellation_targets.length * sumQFuncValues;
// }