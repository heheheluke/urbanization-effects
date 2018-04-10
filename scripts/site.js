document.addEventListener("DOMContentLoaded", function(){
  // Set constants
  var width = 1300;
  var height = 700;
  var padding = 40;


  var svg = d3.select("body").append("svg")
              .attr("class", "scatterplot")
              .attr("width", width)
              .attr("height", height)
              //.attr("viewBox","0 0 " + 100 + " " + 90)
              .attr("preserveAspectRatio", "xMinYMin meet")
              .style("border", "1px solid #cccccc")
/*
  svg.append("rect")
    .attr("width", "50px")
    .attr("height", "50px")
    .attr("fill", "pink");
*/

  var year = 1982;

  d3.csv("/data/test.csv", function(data) {
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
    //console.log(data);

    var yScale = d3.scaleLinear().domain([0,100]).range([height-100,40]);
    var yAxis = d3.axisLeft(yScale);
    var xScale = d3.scaleLinear().domain([0,100]).range([100,height-40]);
    var xAxis = d3.axisBottom(xScale);

    var titles = d3.keys(data[0])
      .filter(function(d) { return d !== "x"; })
      .sort();
    console.log(titles);

    var internetCircles = svg.selectAll("circle").data(data);
    internetCircles = internetCircles.enter().append("circle")
      .attr("r",10)
      .attr("fill","red")
      .attr("fill-opacity",0.5)
      .attr("cy",function(d) { return yScale(d['Urbanization']*100); })
      .attr("cx",function(d) { return xScale(d['Internet']*100); });
/*
    var co2Circles = svg.selectAll("circle").data(data);
    co2Circles = co2Circles.enter().append("circle")
      .attr("r",10)
      .attr("fill","blue")
      .attr("fill-opacity",0.5)
      .attr("cy",function(d) { return yScale(d['Urbanization']*100); })
      .attr("cx",function(d) { return xScale(d['CO2 Emission']*100); });
*/
    svg.append("g").call(xAxis).attr("transform", "translate(0,"+(height-100).toString()+")").style("stroke-width","1px").style('font-size','10px');
    svg.append("g").call(yAxis).attr("transform", "translate(100)").style("stroke-width","1px").style('font-size','10px');

  });

}); // End DOMContentLoaded
