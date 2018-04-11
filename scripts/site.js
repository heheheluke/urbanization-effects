document.addEventListener("DOMContentLoaded", function(){
  // Set constants
  var width = 1300;
  var height = 500;
  var margin = {top: 30, bottom: 20, left: 20, right: 20};


  var svg = d3.select(".scatterplot")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox","0 0 " + " " + width + " " + height)
              .attr("preserveAspectRatio", "xMinYMin meet")
              .style("border", "1px solid #cccccc")


  d3.csv("data/test.csv", function(data) {
    data.forEach(function(d) {
      d["Urbanization"] = +d["Urbanization"];
      d["CO2 Emission"] = +d["CO2 Emission"];
      d["Edu Attainment"] = +d["Edu Attainment"];
      d["Fert"] = +d["Fert"];
      d["Gov Exp 1"] = +d["Gov Exp 1"];
      d["Gov Exp 2"] = +d["Gov Exp 2"];
      d["Internet"] = +d["Internet"];
      d["Year"] = +d["Year"];
    });
    console.log(data);

    var year = 2000;

    function getYears(yr) {

      var yearData = [];
      data.forEach(function(d) {
        if (d['Year'] == yr) {
          yearData.push(d);
        }
      });
      return yearData;
    }
    yearData = getYears(year);

    function showInfo(d,i) {
    }
    function hideInfo(d,i) {
    }

    // Create scales
    var yMaxPix = height - 100;
    var yMinPix = 40;
    var xMaxPix = height - 40;
    var xMinPix = 100;
    var graph = { width: (xMaxPix - xMinPix), height: (yMaxPix - yMinPix)}
    var offset = { left: 100, top: (height-100) }

    var yScale = d3.scaleLinear().domain([0,100]).range([yMaxPix, yMinPix]);
    var yAxis = d3.axisLeft(yScale);
    var xScale = d3.scaleLinear().domain([0,100]).range([xMinPix, xMaxPix]);
    var xAxis = d3.axisBottom(xScale);

    // Create circles
    var internetCircles = svg.append("g").selectAll("circle").data(yearData);
    internetCircles = internetCircles.enter().append("circle")
      .attr("r",10)
      .attr("fill","red")
      .attr("fill-opacity",0.5)
      .attr("cx",function(d) { return xScale(d['Urbanization']*100); })
      .attr("cy",function(d) { return yScale(d['Internet']*100); });

    var co2Circles = svg.append("g").selectAll("circle").data(yearData);
    co2Circles = co2Circles.enter().append("circle")
      .attr("r",10)
      .attr("fill","blue")
      .attr("fill-opacity",0.5)
      .attr("cx",function(d) { return xScale(d['Urbanization']*100); })
      .attr("cy",function(d) { return yScale(d['CO2 Emission']*100); })
      .on("mouseover", showInfo)
      .on("mouseout", hideInfo);

    svg.append("g").call(xAxis).attr("transform", "translate(0,"+(height-100).toString()+")").style("stroke-width","1px").style('font-size','10px');
    svg.append("g").call(yAxis).attr("transform", "translate(" + offset.left + ")").style("stroke-width","1px").style('font-size','10px');

    // Create graph title
    svg.append("text")
        .attr("x", (graph.width / 2) + offset.left)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .attr("class", "graphTitle")
        .text(year);

    // Create slider
    d3.selectAll(".slider").on("input", function() {
      var year = document.getElementById("timeSlider").value;
      updateTitle(year);
    });

    function updateTitle(year) {
      svg.select(".graphTitle").remove();
      svg.append("text")
          .attr("x", (graph.width / 2) + offset.left)
          .attr("y", margin.top)
          .attr("text-anchor", "middle")
          .attr("class", "graphTitle")
          .text(year);
    }
    // var x = d3.scaleLinear()
    //     .domain([1970, 2013])
    //     .range([0, graph.width])
    //     .clamp(true);
    //
    // var slider = svg.append("g")
    //     .attr("class", "slider")
    //     .attr("transform", "translate(" + offset.left + "," + offset.top + ")");
    //
    // slider.append("line")
    //   .attr("class", "track")
    //   .attr("x1", x.range()[0]) // min val of range
    //   .attr("x2", x.range()[1]) // max val of range
    //   .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    //     .attr("class", "track-inset")
    //   .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    //     .attr("class", "track-overlay")
    //   .call(d3.drag()
    //       .on("start drag", function() { console.log("hi"); }));
    //
    // slider.insert("g", ".track-overlay")
    //       .attr("class", "ticks")
    //       .attr("transform", "translate(0," + 18 + ")")
    //       .selectAll("text")
    //       .data(x.ticks(10))
    //       .enter().append("text")
    //       .attr("x", x)
    //       .attr("text-anchor", "middle")
    //       .text(function(d) { return d['Year']; });
    //
    // var handle = slider.insert("circle", ".track-overlay")
    //     .attr("class", "handle")
    //     .attr("r", 9);



}); // End callback data func

}); // End DOMContentLoaded
