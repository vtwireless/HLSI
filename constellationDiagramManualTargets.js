function constellationDiagramManualTargets(){
    document.getElementById("constellationParent").innerHTML = "";
  
    let xTarget = (40 + sig1.gn)/40
    let yTarget = (40 + sig2.gn)/40
    let IPhase = 1;
    let Qphase = 1;

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
    

    // function changeIPhase(){
    //   IPhase = IPhase * -1
    //   update_constellation()
    // };
    // function changeQPhase(){
    //   Qphase = Qphase * -1
    //   update_constellation()
    // };
  
    sig1.onChange("gn", update_constellation);
    sig2.onChange("gn", update_constellation);
    johnCallback.onChange("bw",update_constellation);
    johnCallback.onChange("freq",update_constellation);

      function update_constellation(){
        console.log(sig2.phase)
        console.log(sig1.gn)
        console.log(sig2.gn)
        xTarget = (40 + sig1.gn)/40
        yTarget = (40 + sig2.gn)/40    
        constellationTargets = [
          { x: xTarget * sig1.phase, y: yTarget * sig2.phase }
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

    // function sliderForConstellation(sig,n){
    //   // doing this manually because I don't want to edit sliders.js
    //   let Isig = 0;
    //   if(n=inPhase) Isig = 1
    //   // below generates p object inside the div for inPhaseMag which we can add stuff to
    //   n.type = "range";
    //   n.min = sig["gn" + "_min"]; // example: sig.freq_min
    //   n.max = sig["gn" + "_max"];
    //   n.step = sig["gn" + "_step"];
    //   n.value = sig["gn"];
    //   let p = document.createElement("p");
    //   p.appendChild(n);
    //   // I'm sure I could have made this better but I didn't 
    //   if(Isig==1){
    //   document.getElementById("inPhaseMag").appendChild(p);
    //   } else {
    //   document.getElementById("quadPhaseMag").appendChild(p);
    //   }
    //   // below sets up the label on the left of the slider
    //   let label = document.createElement("label");
    //   label.setAttribute("for", n.id);
    //   if(Isig==1){
    //   label.appendChild(document.createTextNode("In Phase Signal Amplitude"));
    //   } else {
    //   label.appendChild(document.createTextNode("Quadrature Phase Signal Amplitude"));
    //   }
    //   n.parentNode.prepend(label);
  
    //   // below sets up the output value on the right of the slider
    //   let output = document.createElement("output");
    //   output.setAttribute("for", n.id);
    //   n._output = output;
    //   n.parentNode.append(output);
      
    //   // below tells css to make the slider look like the sliders were use to 
    //   n.className = "slider_bw";
  
    //   // we will use floats on the output
    //   var parseValue = parseFloat;
  
    //   n.oninput = function () {
    //     // Set the varying parameter.  For example: sig.freq
    //     // This calls the parameter setter.
    //     sig["gn"] = parseValue(n.value);
    //   };
    //   if(Isig ==1){
    //   var outputUnitsCallback = function (sig, val) {
    //     let phase = 0;
    //     if(sig.phase==-1) phase = 180
    //     return d3.format(".2f")((40+val)/40) + "cos(2\u03C0ft" + d3.format(".2f")(phase) +  ")";
    //   };
    //   } else{
    //     var outputUnitsCallback = function (sig, val) {
    //       let phase = 0;
    //       if(sig.phase==-1) phase = 180
    //       return d3.format(".2f")((40+val)/40) + "sin(2\u03C0ft" + d3.format(".2f")(phase) +  ")";
    //     };
    //   }
  
    //   sig.onChange("gn", function (sig, gn) {
    //     n.value = gn;
    //     output.value = outputUnitsCallback(sig, gn);
    //   });
    // }