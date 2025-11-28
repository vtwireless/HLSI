// Declare global variables
let bpskFlag = 0;
let refreshRate = 1000;
let targetColor = "#1b9e77"; // Define the color as a variable


class MessageStats {
  constructor() {
    this.sentMessages = 0;
    this.messageErrors = 0;
  }

  reset() {
    this.sentMessages = 0;
    this.messageErrors = 0;
  }
}

function constellationDiagram(top , left,constellationName){
  
  setConstellationPosition(top, left, constellationName);

  // document.getElementById("constellationParent").innerHTML = "";

    document.getElementById(constellationName).innerHTML = "";
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
        // var svg = d3.select("#constellationParent")
        var svg = d3.select("#"+constellationName)
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
          .range([ -.001, width  ]);
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
          .style("fill","#91bfdb")


      //     // Add a button to the SVG
      // svg.append("foreignObject")
      //   .attr("x", width - 80) // Position the button near the top-right corner
      //   .attr("y", 10)
      //   .attr("width", 80)
      //   .attr("height", 30)
      //   .append("xhtml:button")
      //   .text("freeze")
      //   .style("font-size", "12px")
      //   .style("padding", "5px")
      //   .style("cursor", "pointer")
      //   .style("width", "60px") // Add this line for fixed width
      //   .on("click", freeze);


      // let freezeBox = svg.append("foreignObject")
      //   .attr("x", width - 60)
      //   .attr("y", 10)
      //   .attr("width", 80)
      //   .attr("height", 30);

      // freezeBox.append("xhtml:button")
      //   .text("freeze")
      //   .style("font-size", "12px")
      //   .style("padding", "5px")
      //   .style("cursor", "pointer")
      //   .on("click", freeze);
    
        // Create a container to display BER
        let berDisplay = document.createElement("div");
        berDisplay.id = "berDisplay";
        berDisplay.style.marginTop = "10px";
        berDisplay.style.fontSize = "14px";
        berDisplay.textContent = "Bit Errr Rate: 0";
        document.getElementById(constellationName).appendChild(berDisplay);

        // document.getElementById("constellationParent").appendChild(berDisplay);

        // console.log(sig)




        let messageRate = 50;

        div = document.getElementById("rateSlider")
      // Check if the rate slider already exists
      // console.log(div.hasChildNodes() == false)
      
      // console.log(document.getElementById("rateSlider").hasChildNodes() == false)
      if (!(document.getElementById("rateSlider").hasChildNodes())) {
        messageRateSlider = document.createElement("INPUT");
        messageRateSlider.type = "range";
        messageRateSlider.min = 1; 
        messageRateSlider.max = 500;
        messageRateSlider.step = 1;
        messageRateSlider.value = 1;
        messageRateSlider.id = "rateSlider"; // Assign an ID to the slider

        let p = document.createElement("p");
        p.appendChild(messageRateSlider);
        document.getElementById("rateSlider").appendChild(p); // 

        // below sets up the label on the left of the slider
        let label = document.createElement("label");
        label.setAttribute("for", messageRateSlider.id);
        label.appendChild(document.createTextNode("Message Rate"));
        messageRateSlider.parentNode.prepend(label);
  
        // below sets up the output value on the right of the slider
        let output = document.createElement("output");
        output.setAttribute("for", messageRateSlider.id);
        messageRateSlider._output = output;
        messageRateSlider.parentNode.append(output);
      
        // below tells CSS to make the slider look like the sliders we're used to
        messageRateSlider.className = "slider_bw";
  
        // we will use floats on the output
        var parseValue = parseFloat;
  
        messageRateSlider.oninput = function () {
          // Set the varying parameter.  For example: sig.freq
          // This calls the parameter setter.
          messageRate = parseValue(messageRateSlider.value);
        };
        var outputUnitsCallback = function (val) {
          return d3.format("d")(val) + " messages/sec";
        };

  
        messageRateSlider.addEventListener("input", function () {
          messageRate = messageRateSlider.value;
          output.textContent = outputUnitsCallback(messageRate);
        })

        output.value = outputUnitsCallback(messageRate);
      }
      // console.log(document.getElementById("rateSlider").p)
  
      // console.log(sig.sinr)
  
      // START OF LOOPING CODE
      let counter = 0;
      // messageRateSlider.value = messageRate

      
      setInterval(() => {

        if(!frozenFlag){

          plotMessages();
        

      // console.log(ebno);
        counter = counter + 1;
        if (counter == 24){
          counter = 0;
          d3.select("#"+constellationName).selectAll("circle").remove();
          svg.append('g')
          .selectAll("dot")
          .data(constellationTargets)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", function (d) { return y(d.y); } )
            .attr("r", 5)
            .style("fill",targetColor)
          console.log("25 seconds has passed")
        }
      } // end of frozen check
    }, refreshRate);
  
  
    sig.onChange("mcs", update_constellation);
  
    function update_constellation(){
      // console.log(sig.mcs)
      // console.log("The modulation code has changed")
      bpskFlag = false;
      if(sig.mcs>1 && sig.mcs <5 ){
        // 4 QAM
      constellationTargets = [{ x: 1, y: 1 }, { x: 1, y: -1 },{ x: -1, y: 1 },{ x: -1, y: -1 },];
      distance = 2/2;
      // targetColor = "#e9a3c9";
    } else if(sig.mcs <2){
        // BPSK
      bpskFlag = true;
      constellationTargets = [{ x: 1, y: 0 },{ x: -1, y: 0 } ];
      distance = 2/2;
      // targetColor = "#c51b7d";
    } else if (sig.mcs >=5 && sig.mcs <7 ){
        // 16 QAM
      constellationTargets = [ { x: -1.000, y: -1.000 }, { x: -1.000, y: -0.333 }, { x: -1.000, y: 0.333 }, { x: -1.000, y: 1.000 }, { x: -0.333, y: -1.000 }, { x: -0.333, y: -0.333 }, { x: -0.333, y: 0.333 }, { x: -0.333, y: 1.000 }, { x: 0.333, y: -1.000 }, { x: 0.333, y: -0.333 }, { x: 0.333, y: 0.333 }, { x: 0.333, y: 1.000 }, { x: 1.000, y: -1.000 }, { x: 1.000, y: -0.333 }, { x: 1.000, y: 0.333 }, { x: 1.000, y: 1.000 } ];
      distance = .666/2;
      // targetColor = "#fde0ef";

    } else if (sig.mcs == 7){
        // 32 QAM
    constellationTargets = [ { x: -1,y: -0.6 },{ x: -1,y: -0.2 },{ x: -1,y: 0.2 },{ x: -1,y: 0.6 },{ x: -0.6,y: -1 },{ x: -0.6,y: -0.6 },{ x: -0.6,y: -0.2 },{ x: -0.6,y: 0.2 },{ x: -0.6,y: 0.6 },{ x: -0.6,y: 1 },{ x: -0.2,y: -1 },{ x: -0.2,y: -0.6 },{ x: -0.2,y: -0.2 },{ x: -0.2,y: 0.2 },{ x: -0.2,y: 0.6 },{ x: -0.2,y: 1 },{ x: 0.2,y: -1 },{ x: 0.2,y: -0.6 },{ x: 0.2,y: -0.2 },{ x: 0.2,y: 0.2 },{ x: 0.2,y: 0.6 },{ x: 0.2,y: 1 },{ x: 0.6,y: -1 },{ x: 0.6,y: -0.6 },{ x: 0.6,y: -0.2 },{ x: 0.6,y: 0.2 },{ x: 0.6,y: 0.6 },{ x: 0.6,y: 1 },{ x: 1,y: -0.6 },{ x: 1,y: -0.2 },{ x: 1,y: 0.2 },{ x: 1,y: 0.6 }]
    distance = .4/2;
    // targetColor = "#f7f7f7";

    } else if(sig.mcs ==8){
    constellationTargets = [{ x: -1,y: -1 },{ x: -1,y: -0.714 },{ x: -1,y: -0.429 },{ x: -1,y: -0.143 },{ x: -1,y: 0.143 },{ x: -1,y: 0.429 },{ x: -1,y: 0.714 },{ x: -1,y: 1 },{ x: -0.714,y: -1 },{ x: -0.714,y: -0.714 },{ x: -0.714,y: -0.429 },{ x: -0.714,y: -0.143 },{ x: -0.714,y: 0.143 },{ x: -0.714,y: 0.429 },{ x: -0.714,y: 0.714 },{ x: -0.714,y: 1 },{ x: -0.429,y: -1 },{ x: -0.429,y: -0.714 },{ x: -0.429,y: -0.429 },{ x: -0.429,y: -0.143 },{ x: -0.429,y: 0.143 },{ x: -0.429,y: 0.429 },{ x: -0.429,y: 0.714 },{ x: -0.429,y: 1 },{ x: -0.143,y: -1 },{ x: -0.143,y: -0.714 },{ x: -0.143,y: -0.429 },{ x: -0.143,y: -0.143 },{ x: -0.143,y: 0.143 },{ x: -0.143,y: 0.429 },{ x: -0.143,y: 0.714 },{ x: -0.143,y: 1 },{ x: 0.143,y: -1 },{ x: 0.143,y: -0.714 },{ x: 0.143,y: -0.429 },{ x: 0.143,y: -0.143 },{ x: 0.143,y: 0.143 },{ x: 0.143,y: 0.429 },{ x: 0.143,y: 0.714 },{ x: 0.143,y: 1 },{ x: 0.429,y: -1 },{ x: 0.429,y: -0.714 },{ x: 0.429,y: -0.429 },{ x: 0.429,y: -0.143 },{ x: 0.429,y: 0.143 },{ x: 0.429,y: 0.429 },{ x: 0.429,y: 0.714 },{ x: 0.429,y: 1 },{ x: 0.714,y: -1 },{ x: 0.714,y: -0.714 },{ x: 0.714,y: -0.429 },{ x: 0.714,y: -0.143 },{ x: 0.714,y: 0.143 },{ x: 0.714,y: 0.429 },{ x: 0.714,y: 0.714 },{ x: 0.714,y: 1 },{ x: 1,y: -1 },{ x: 1,y: -0.714 },{ x: 1,y: -0.429 },{ x: 1,y: -0.143 },{ x: 1,y: 0.143 },{ x: 1,y: 0.429 },{ x: 1,y: 0.714 },{ x: 1,y: 1 }]
    distance = .286/2;  
    // targetColor = "#e6f5d0";

    } else if (sig.mcs == 9){
    constellationTargets = [{ x: -1,y: -0.636 },{ x: -1,y: -0.455 },{ x: -1,y: -0.273 },{ x: -1,y: -0.091 },{ x: -1,y: 0.091 },{ x: -1,y: 0.273 },{ x: -1,y: 0.455 },{ x: -1,y: 0.636 },{ x: -0.818,y: -0.636 },{ x: -0.818,y: -0.455 },{ x: -0.818,y: -0.273 },{ x: -0.818,y: -0.091 },{ x: -0.818,y: 0.091 },{ x: -0.818,y: 0.273 },{ x: -0.818,y: 0.455 },{ x: -0.818,y: 0.636 },{ x: -0.636,y: -1 },{ x: -0.636,y: -0.818 },{ x: -0.636,y: -0.636 },{ x: -0.636,y: -0.455 },{ x: -0.636,y: -0.273 },{ x: -0.636,y: -0.091 },{ x: -0.636,y: 0.091 },{ x: -0.636,y: 0.273 },{ x: -0.636,y: 0.455 },{ x: -0.636,y: 0.636 },{ x: -0.636,y: 0.818 },{ x: -0.636,y: 1 },{ x: -0.455,y: -1 },{ x: -0.455,y: -0.818 },{ x: -0.455,y: -0.636 },{ x: -0.455,y: -0.455 },{ x: -0.455,y: -0.273 },{ x: -0.455,y: -0.091 },{ x: -0.455,y: 0.091 },{ x: -0.455,y: 0.273 },{ x: -0.455,y: 0.455 },{ x: -0.455,y: 0.636 },{ x: -0.455,y: 0.818 },{ x: -0.455,y: 1 },{ x: -0.273,y: -1 },{ x: -0.273,y: -0.818 },{ x: -0.273,y: -0.636 },{ x: -0.273,y: -0.455 },{ x: -0.273,y: -0.273 },{ x: -0.273,y: -0.091 },{ x: -0.273,y: 0.091 },{ x: -0.273,y: 0.273 },{ x: -0.273,y: 0.455 },{ x: -0.273,y: 0.636 },{ x: -0.273,y: 0.818 },{ x: -0.273,y: 1 },{ x: -0.091,y: -1 },{ x: -0.091,y: -0.818 },{ x: -0.091,y: -0.636 },{ x: -0.091,y: -0.455 },{ x: -0.091,y: -0.273 },{ x: -0.091,y: -0.091 },{ x: -0.091,y: 0.091 },{ x: -0.091,y: 0.273 },{ x: -0.091,y: 0.455 },{ x: -0.091,y: 0.636 },{ x: -0.091,y: 0.818 },{ x: -0.091,y: 1 },{ x: 0.091,y: -1 },{ x: 0.091,y: -0.818 },{ x: 0.091,y: -0.636 },{ x: 0.091,y: -0.455 },{ x: 0.091,y: -0.273 },{ x: 0.091,y: -0.091 },{ x: 0.091,y: 0.091 },{ x: 0.091,y: 0.273 },{ x: 0.091,y: 0.455 },{ x: 0.091,y: 0.636 },{ x: 0.091,y: 0.818 },{ x: 0.091,y: 1 },{ x: 0.273,y: -1 },{ x: 0.273,y: -0.818 },{ x: 0.273,y: -0.636 },{ x: 0.273,y: -0.455 },{ x: 0.273,y: -0.273 },{ x: 0.273,y: -0.091 },{ x: 0.273,y: 0.091 },{ x: 0.273,y: 0.273 },{ x: 0.273,y: 0.455 },{ x: 0.273,y: 0.636 },{ x: 0.273,y: 0.818 },{ x: 0.273,y: 1 },{ x: 0.455,y: -1 },{ x: 0.455,y: -0.818 },{ x: 0.455,y: -0.636 },{ x: 0.455,y: -0.455 },{ x: 0.455,y: -0.273 },{ x: 0.455,y: -0.091 },{ x: 0.455,y: 0.091 },{ x: 0.455,y: 0.273 },{ x: 0.455,y: 0.455 },{ x: 0.455,y: 0.636 },{ x: 0.455,y: 0.818 },{ x: 0.455,y: 1 },{ x: 0.636,y: -1 },{ x: 0.636,y: -0.818 },{ x: 0.636,y: -0.636 },{ x: 0.636,y: -0.455 },{ x: 0.636,y: -0.273 },{ x: 0.636,y: -0.091 },{ x: 0.636,y: 0.091 },{ x: 0.636,y: 0.273 },{ x: 0.636,y: 0.455 },{ x: 0.636,y: 0.636 },{ x: 0.636,y: 0.818 },{ x: 0.636,y: 1 },{ x: 0.818,y: -0.636 },{ x: 0.818,y: -0.455 },{ x: 0.818,y: -0.273 },{ x: 0.818,y: -0.091 },{ x: 0.818,y: 0.091 },{ x: 0.818,y: 0.273 },{ x: 0.818,y: 0.455 },{ x: 0.818,y: 0.636 },{ x: 1,y: -0.636 },{ x: 1,y: -0.455 },{ x: 1,y: -0.273 },{ x: 1,y: -0.091 },{ x: 1,y: 0.091 },{ x: 1,y: 0.273 },{ x: 1,y: 0.455 },{ x: 1,y: 0.636 }]       
    distance = .181/2;  
    // targetColor = "#a1d76a";

    } else if(sig.mcs >9) {
    constellationTargets = [ { x: -1,y: -1 },{ x: -1,y: -0.867 },{ x: -1,y: -0.733 },{ x: -1,y: -0.6 },{ x: -1,y: -0.467 },{ x: -1,y: -0.333 },{ x: -1,y: -0.2 },{ x: -1,y: -0.067 },{ x: -1,y: 0.067 },{ x: -1,y: 0.2 },{ x: -1,y: 0.333 },{ x: -1,y: 0.467 },{ x: -1,y: 0.6 },{ x: -1,y: 0.733 },{ x: -1,y: 0.867 },{ x: -1,y: 1 },{ x: -0.867,y: -1 },{ x: -0.867,y: -0.867 },{ x: -0.867,y: -0.733 },{ x: -0.867,y: -0.6 },{ x: -0.867,y: -0.467 },{ x: -0.867,y: -0.333 },{ x: -0.867,y: -0.2 },{ x: -0.867,y: -0.067 },{ x: -0.867,y: 0.067 },{ x: -0.867,y: 0.2 },{ x: -0.867,y: 0.333 },{ x: -0.867,y: 0.467 },{ x: -0.867,y: 0.6 },{ x: -0.867,y: 0.733 },{ x: -0.867,y: 0.867 },{ x: -0.867,y: 1 },{ x: -0.733,y: -1 },{ x: -0.733,y: -0.867 },{ x: -0.733,y: -0.733 },{ x: -0.733,y: -0.6 },{ x: -0.733,y: -0.467 },{ x: -0.733,y: -0.333 },{ x: -0.733,y: -0.2 },{ x: -0.733,y: -0.067 },{ x: -0.733,y: 0.067 },{ x: -0.733,y: 0.2 },{ x: -0.733,y: 0.333 },{ x: -0.733,y: 0.467 },{ x: -0.733,y: 0.6 },{ x: -0.733,y: 0.733 },{ x: -0.733,y: 0.867 },{ x: -0.733,y: 1 },{ x: -0.6,y: -1 },{ x: -0.6,y: -0.867 },{ x: -0.6,y: -0.733 },{ x: -0.6,y: -0.6 },{ x: -0.6,y: -0.467 },{ x: -0.6,y: -0.333 },{ x: -0.6,y: -0.2 },{ x: -0.6,y: -0.067 },{ x: -0.6,y: 0.067 },{ x: -0.6,y: 0.2 },{ x: -0.6,y: 0.333 },{ x: -0.6,y: 0.467 },{ x: -0.6,y: 0.6 },{ x: -0.6,y: 0.733 },{ x: -0.6,y: 0.867 },{ x: -0.6,y: 1 },{ x: -0.467,y: -1 },{ x: -0.467,y: -0.867 },{ x: -0.467,y: -0.733 },{ x: -0.467,y: -0.6 },{ x: -0.467,y: -0.467 },{ x: -0.467,y: -0.333 },{ x: -0.467,y: -0.2 },{ x: -0.467,y: -0.067 },{ x: -0.467,y: 0.067 },{ x: -0.467,y: 0.2 },{ x: -0.467,y: 0.333 },{ x: -0.467,y: 0.467 },{ x: -0.467,y: 0.6 },{ x: -0.467,y: 0.733 },{ x: -0.467,y: 0.867 },{ x: -0.467,y: 1 },{ x: -0.333,y: -1 },{ x: -0.333,y: -0.867 },{ x: -0.333,y: -0.733 },{ x: -0.333,y: -0.6 },{ x: -0.333,y: -0.467 },{ x: -0.333,y: -0.333 },{ x: -0.333,y: -0.2 },{ x: -0.333,y: -0.067 },{ x: -0.333,y: 0.067 },{ x: -0.333,y: 0.2 },{ x: -0.333,y: 0.333 },{ x: -0.333,y: 0.467 },{ x: -0.333,y: 0.6 },{ x: -0.333,y: 0.733 },{ x: -0.333,y: 0.867 },{ x: -0.333,y: 1 },{ x: -0.2,y: -1 },{ x: -0.2,y: -0.867 },{ x: -0.2,y: -0.733 },{ x: -0.2,y: -0.6 },{ x: -0.2,y: -0.467 },{ x: -0.2,y: -0.333 },{ x: -0.2,y: -0.2 },{ x: -0.2,y: -0.067 },{ x: -0.2,y: 0.067 },{ x: -0.2,y: 0.2 },{ x: -0.2,y: 0.333 },{ x: -0.2,y: 0.467 },{ x: -0.2,y: 0.6 },{ x: -0.2,y: 0.733 },{ x: -0.2,y: 0.867 },{ x: -0.2,y: 1 },{ x: -0.067,y: -1 },{ x: -0.067,y: -0.867 },{ x: -0.067,y: -0.733 },{ x: -0.067,y: -0.6 },{ x: -0.067,y: -0.467 },{ x: -0.067,y: -0.333 },{ x: -0.067,y: -0.2 },{ x: -0.067,y: -0.067 },{ x: -0.067,y: 0.067 },{ x: -0.067,y: 0.2 },{ x: -0.067,y: 0.333 },{ x: -0.067,y: 0.467 },{ x: -0.067,y: 0.6 },{ x: -0.067,y: 0.733 },{ x: -0.067,y: 0.867 },{ x: -0.067,y: 1 },{ x: 0.067,y: -1 },{ x: 0.067,y: -0.867 },{ x: 0.067,y: -0.733 },{ x: 0.067,y: -0.6 },{ x: 0.067,y: -0.467 },{ x: 0.067,y: -0.333 },{ x: 0.067,y: -0.2 },{ x: 0.067,y: -0.067 },{ x: 0.067,y: 0.067 },{ x: 0.067,y: 0.2 },{ x: 0.067,y: 0.333 },{ x: 0.067,y: 0.467 },{ x: 0.067,y: 0.6 },{ x: 0.067,y: 0.733 },{ x: 0.067,y: 0.867 },{ x: 0.067,y: 1 },{ x: 0.2,y: -1 },{ x: 0.2,y: -0.867 },{ x: 0.2,y: -0.733 },{ x: 0.2,y: -0.6 },{ x: 0.2,y: -0.467 },{ x: 0.2,y: -0.333 },{ x: 0.2,y: -0.2 },{ x: 0.2,y: -0.067 },{ x: 0.2,y: 0.067 },{ x: 0.2,y: 0.2 },{ x: 0.2,y: 0.333 },{ x: 0.2,y: 0.467 },{ x: 0.2,y: 0.6 },{ x: 0.2,y: 0.733 },{ x: 0.2,y: 0.867 },{ x: 0.2,y: 1 },{ x: 0.333,y: -1 },{ x: 0.333,y: -0.867 },{ x: 0.333,y: -0.733 },{ x: 0.333,y: -0.6 },{ x: 0.333,y: -0.467 },{ x: 0.333,y: -0.333 },{ x: 0.333,y: -0.2 },{ x: 0.333,y: -0.067 },{ x: 0.333,y: 0.067 },{ x: 0.333,y: 0.2 },{ x: 0.333,y: 0.333 },{ x: 0.333,y: 0.467 },{ x: 0.333,y: 0.6 },{ x: 0.333,y: 0.733 },{ x: 0.333,y: 0.867 },{ x: 0.333,y: 1 },{ x: 0.467,y: -1 },{ x: 0.467,y: -0.867 },{ x: 0.467,y: -0.733 },{ x: 0.467,y: -0.6 },{ x: 0.467,y: -0.467 },{ x: 0.467,y: -0.333 },{ x: 0.467,y: -0.2 },{ x: 0.467,y: -0.067 },{ x: 0.467,y: 0.067 },{ x: 0.467,y: 0.2 },{ x: 0.467,y: 0.333 },{ x: 0.467,y: 0.467 },{ x: 0.467,y: 0.6 },{ x: 0.467,y: 0.733 },{ x: 0.467,y: 0.867 },{ x: 0.467,y: 1 },{ x: 0.6,y: -1 },{ x: 0.6,y: -0.867 },{ x: 0.6,y: -0.733 },{ x: 0.6,y: -0.6 },{ x: 0.6,y: -0.467 },{ x: 0.6,y: -0.333 },{ x: 0.6,y: -0.2 },{ x: 0.6,y: -0.067 },{ x: 0.6,y: 0.067 },{ x: 0.6,y: 0.2 },{ x: 0.6,y: 0.333 },{ x: 0.6,y: 0.467 },{ x: 0.6,y: 0.6 },{ x: 0.6,y: 0.733 },{ x: 0.6,y: 0.867 },{ x: 0.6,y: 1 },{ x: 0.733,y: -1 },{ x: 0.733,y: -0.867 },{ x: 0.733,y: -0.733 },{ x: 0.733,y: -0.6 },{ x: 0.733,y: -0.467 },{ x: 0.733,y: -0.333 },{ x: 0.733,y: -0.2 },{ x: 0.733,y: -0.067 },{ x: 0.733,y: 0.067 },{ x: 0.733,y: 0.2 },{ x: 0.733,y: 0.333 },{ x: 0.733,y: 0.467 },{ x: 0.733,y: 0.6 },{ x: 0.733,y: 0.733 },{ x: 0.733,y: 0.867 },{ x: 0.733,y: 1 },{ x: 0.867,y: -1 },{ x: 0.867,y: -0.867 },{ x: 0.867,y: -0.733 },{ x: 0.867,y: -0.6 },{ x: 0.867,y: -0.467 },{ x: 0.867,y: -0.333 },{ x: 0.867,y: -0.2 },{ x: 0.867,y: -0.067 },{ x: 0.867,y: 0.067 },{ x: 0.867,y: 0.2 },{ x: 0.867,y: 0.333 },{ x: 0.867,y: 0.467 },{ x: 0.867,y: 0.6 },{ x: 0.867,y: 0.733 },{ x: 0.867,y: 0.867 },{ x: 0.867,y: 1 },{ x: 1,y: -1 },{ x: 1,y: -0.867 },{ x: 1,y: -0.733 },{ x: 1,y: -0.6 },{ x: 1,y: -0.467 },{ x: 1,y: -0.333 },{ x: 1,y: -0.2 },{ x: 1,y: -0.067 },{ x: 1,y: 0.067 },{ x: 1,y: 0.2 },{ x: 1,y: 0.333 },{ x: 1,y: 0.467 },{ x: 1,y: 0.6 },{ x: 1,y: 0.733 },{ x: 1,y: 0.867 },{ x: 1,y: 1 }]
    distance = .133/2;
    // targetColor = "#3d9221";

    }
    targetColor = "#91bfdb";
    // delete all dots
    // d3.select("#"+constellationName).selectAll("circle").remove();
    svg.append('g')
      .selectAll("dot")
      .data(constellationTargets)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 5)
      .style("fill", targetColor)
    }  // end of updateConstellationTargets function




    function plotMessages(){
        let energyPerSymbol = 10**(sig.gn/10);
        let noiseNormalization = Math.sqrt(energyPerSymbol*2)
      
      // ------------- Modulation Specific Noise Normalization ---------//

        //   if(sig.mcs>1 && sig.mcs <5 ){
      //     // 4 QAM
          
      // if(sig.mcs <2){
      // //     // BPSK
      //     noiseNormalization = Math.sqrt(energyPerSymbol* 2)
      // }
        
      // if (sig.mcs >=5 && sig.mcs <7 ){
      //     // 16 QAM
      //     noiseNormalization = Math.sqrt(energyPerSymbol*2)
      // }
      // } else if (sig.mcs == 7){
      //     // 32 QAM
      //     scaleFactor = .408
      // } else if(sig.mcs ==8){
      //     // 64 QAM
      //     scaleFactor = .353
      // } else if (sig.mcs == 9){
      //     // 128 QAM
      //     scaleFactor = .289
      // } else if(sig.mcs >9) {
      //     // 256 QAM
      //     scaleFactor = .25
      // }

  
      const variance = (10**((noise.gn/2)/10)) / noiseNormalization;   

      messageRateSlider.value = messageRate

      for (let i = 0; i < messageRate; i++) {
        // creates a variable that can be edited if it goes out of bounds for x and y values
        let translatedTargets = constellationTargets.map(point => ({
          x: point.x  +variance*generateNormalRandom(),
          y: point.y  +variance*generateNormalRandom()
        }));

        for (let i = 0; i < constellationTargets.length; i++) {
          BER_stats.sentMessages = BER_stats.sentMessages + 1;



          distToTarget = ((constellationTargets[i].x - translatedTargets[i].x)**2 + (constellationTargets[i].y - translatedTargets[i].y)**2);

          let freezeBoxX = .92;
          let freezeBoxY = 1.18;
          let freezeBoxWidth = .5;
          let freezeBoxHeight = .25;
          let errorDetected = false;

          let = printObject = [translatedTargets[i]]



          
          for (let target of constellationTargets) {
            let tempErrorDist = ((target.x - translatedTargets[i].x)**2 + (target.y - translatedTargets[i].y)**2);

            if (target !== constellationTargets[i] && (tempErrorDist < distToTarget)) {
              BER_stats.messageErrors++;
              errorDetected = true;
              break;
            }
          }

          // if (  !((printObject[0].x >= freezeBoxX &&
          //       printObject[0].x <= freezeBoxX + freezeBoxWidth) &&
          //       (printObject[0].y >= freezeBoxY &&
          //       printObject[0].y <= freezeBoxY + freezeBoxHeight))){
                  // console.log("Not in freeze box")



            if ( errorDetected ){
              // console.log(printObject)
              // console.log("Error!!!")
              // messageErrors = messageErrors + 1;
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
                .style("fill","#fc8d59")
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
                .style("fill",targetColor)
              // }
            }

      } // end of constellation targets loop
    } // end of message rate loop
        // console.log(BER_stats);
        sig.BER = BER_stats.messageErrors/BER_stats.sentMessages;

        if (BER_stats.messageErrors === 0) {
          sig.BER = 10**-8;
        }
        
        // console.log("Bit Error Rate: " + sig.BER);

        // Update the BER display
        berDisplay.textContent = `Bit Error Rate: ${sig.BER.toFixed(8)}`;
    //       }

  }


    document.getElementById("sendMessageButton").addEventListener("click", function() {
      plotMessages();
      
    });
         // use the clear all circles button
    document.getElementById("clearMessagesButton").addEventListener("click", function() {
      // d3.select("#constellationParent").selectAll("circle").remove();
      d3.select("#constellationParent").selectAll("circle").remove();

      sig.BER = 0;
      BER_stats.reset(); 
      update_constellation();
    });

    // Add an event listener for the dropdown selector
    document.getElementById("modulationType").addEventListener("change", function() {
      d3.select("#constellationParent").selectAll("circle").style("fill", "#ffffbf");

      let modulationType = this.value;
      // d3.select("#modulationType").selectAll("circle").remove();
      modulationType = parseInt(modulationType, 10);
      sig.mcs = modulationType;
      // console.log(sig);

    });
    
  }
  

  // helper functions

  // }
  function randn_bm() {
      let u = 0, v = 0;
      while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
      while(v === 0) v = Math.random();
      let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      num = num / 10.0 + 0.5; // Translate to 0 -> 1
      // if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
       num = num - 0.5; // added to center around 0
      return num
    }

function generateNormalRandom(mean = 0, stdDev = 1) {
      let u1 = Math.random();
      let u2 = Math.random();
      let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      return z0 * stdDev + mean;
  }

function freeze() {
      frozenFlag = !frozenFlag;
      console.log(frozenFlag);
    
      // Update the button text
      const button = d3.select("#freezeButton");
      button.text(frozenFlag ? "Run Continuously" : "freeze");
  }  // end of freeze function
  
// function updateModulationType(modulationType) {
//   // console.log("Selected Modulation Type:", modulationType);
//   modulationType = parseInt(modulationType, 10);
//   sig.mcs = modulationType;
//   console.log(sig);

// }





// function freeze() {
//   frozenFlag = !frozenFlag;
//   console.log(frozenFlag);

//   // Update the button text
//   const button = d3.select("#constellationParent button");
//   button.text(frozen ? "unfreeze" : "freeze");
// }

function setConstellationPosition(top, left, parent) {
  const constellationParent = document.getElementById(parent);
  constellationParent.style.top = `${top}px`;
  constellationParent.style.left = `${left}px`;
}


