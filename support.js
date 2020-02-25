function svg_create(_margin, _width, _height, _xscale, _yscale)
{
    // 1. Add the SVG (time) to the page and employ #2
    var svg = d3.select("body").append("svg")
        .attr("width",  _width  + _margin.left + _margin.right)
        .attr("height", _height + _margin.top +  _margin.bottom)
      .append("g")
        .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");

    // create axes
    svg.append("g").attr("class", "x axis")
        .attr("transform", "translate(0," + _height + ")")
        .call(d3.axisBottom(_xscale));
    svg.append("g").attr("class", "y axis")
        .call(d3.axisLeft(_yscale));

    // create grid lines
    svg.append("g").attr("class","grid").call(d3.axisBottom(_xscale).tickFormat("").tickSize( _height));
    svg.append("g").attr("class","grid").call(d3.axisLeft  (_yscale).tickFormat("").tickSize(- _width));
    return svg;
}

function svg_add_labels(_svg, _margin, _width, _height, _xlabel, _ylabel)
{
    // create x-axis axis label
    _svg.append("text")
       .attr("transform","translate("+(_width/2)+","+(_height + 0.75*_margin.bottom)+")")
       .attr("dy","-0.3em")
       .style("text-anchor","middle")
       .text(_xlabel)

    // create y-axis label
    _svg.append("text")
       .attr("transform","rotate(-90)")
       .attr("y", 0 - _margin.left)
       .attr("x", 0 - (_height/2))
       .attr("dy", "1em")
       .style("text-anchor","middle")
       .text(_ylabel)
}

