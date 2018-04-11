document.addEventListener("DOMContentLoaded", function(){
  // Set constants
  var width = 1300;
  var height = 700;
  var viewWidth = 1300;
  var viewHeight = 700;
  var padding = 40;


  var svg = d3.select("body .container").append("svg")
              .attr("class", "scatterplot")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox","0 0 " + " " + viewWidth + " " + viewHeight)
              .attr("preserveAspectRatio", "xMinYMin meet")
              .style("border", "1px solid #cccccc")

// Country name,Country code,Year,Urbanization,CO2 emissions,Edu attainment (Bachelor),
//Edu attainment (primary),Fertility rate,Govt exp (GDP),Govt exp (Exp),
//Literacy rate,Enrollment ratio (primary),Enrollment ratio (tertiary),Internet usage
  d3.csv("data/condensed_data.csv", function(data) {
    data.forEach(function(d) {
      d["Year"] = +d["Year"];
      d["Urbanization"] = +d["Urbanization"];
      d["CO2 emissions"] = +d["CO2 emissions"];
      d["Edu attainment (Bachelor)"] = +d["Edu attainment (Bachelor)"];
      d["Edu attainment (primary)"] = +d["Edu attainment (primary)"];
      d["Fertility rate"] = +d["Fertility rate"];
      d["Govt exp (GDP)"] = +d["Govt exp (GDP)"];
      d["Govt exp (Exp)"] = +d["Govt exp (Exp)"];
      d["Literacy rate"] = +d["Literacy rate"];
      d["Enrollment ratio (primary)"] = +d["Enrollment ratio (primary)"];
      d["Enrollment ratio (tertiary)"] = +d["Enrollment ratio (tertiary)"];
      d["Internet usage"] = +d["Internet usage"];
    });
    //console.log(data);

    var year = 2012;

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
    console.log(yearData);

    function showInfo(d,i) {
    }
    function hideInfo(d,i) {
    }

    var yScale = d3.scaleLinear().domain([0,100]).range([height-100,40]);
    var yAxis = d3.axisLeft(yScale);
    var xScale = d3.scaleLinear().domain([0,100]).range([100,height-40]);
    var xAxis = d3.axisBottom(xScale);

    var internetCircles = svg.append("g").selectAll("circle").data(yearData);
    internetCircles = internetCircles.enter().append("circle")
      .attr("r",10)
      .attr("fill","red")
      .attr("fill-opacity",0.5)
      .attr("cx",function(d) { return xScale(d['Urbanization']); })
      .attr("cy",function(d) { return yScale(d['Internet usage']); });

    var co2Circles = svg.append("g").selectAll("circle").data(yearData);
    co2Circles = co2Circles.enter().append("circle")
      .attr("r",10)
      .attr("fill","blue")
      .attr("fill-opacity",0.5)
      .attr("cx",function(d) { return xScale(d['Urbanization']); })
      .attr("cy",function(d) { return yScale(d['CO2 emissions']); })
      .on("mouseover", showInfo)
      .on("mouseout", hideInfo);

    svg.append("g").call(xAxis).attr("transform", "translate(0,"+(height-100).toString()+")").style("stroke-width","1px").style('font-size','10px');
    svg.append("g").call(yAxis).attr("transform", "translate(100)").style("stroke-width","1px").style('font-size','10px');

  });

}); // End DOMContentLoaded
