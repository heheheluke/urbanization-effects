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

    plotPoints(yearData);

    // Create axis
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
      updatePoints(year);
    });

    // Update scatterplot title
    function updateTitle(year) {
      svg.select(".graphTitle").remove();
      svg.append("text")
          .attr("x", (graph.width / 2) + offset.left)
          .attr("y", margin.top)
          .attr("text-anchor", "middle")
          .attr("class", "graphTitle")
          .text(year);
    }

    // Update points on scatterplot;
    function updatePoints(year) {
      yearData = getYears(year);
      svg.selectAll("circle").remove();
      plotPoints(yearData);
    }

    // Plot all points (points for internet usage, CO2 emissions, etc) on scatterplot
    function plotPoints(yearData) {
      // internet usage
      var internetCircles = svg.append("g").selectAll("circle").data(yearData);
      internetCircles = internetCircles.enter().append("circle")
        .attr("r",10)
        .attr("fill","pink")
        .attr("fill-opacity",0.5)
        .attr("cx",function(d) { return xScale(d['Urbanization']); })
        .attr("cy",function(d) { return yScale(d['Internet usage']); });
      //co2 emissions
      var co2Circles = svg.append("g").selectAll("circle").data(yearData);
      co2Circles = co2Circles.enter().append("circle")
        .attr("r",10)
        .attr("fill","blue")
        .attr("fill-opacity",0.5)
        .attr("cx",function(d) { return xScale(d['Urbanization']); })
        .attr("cy",function(d) { return yScale(d['CO2 emissions']); })
        .on("mouseover", showInfo)
        .on("mouseout", hideInfo);
      // edu attainment (bachelor)
      var edubachCircles = svg.append("g").selectAll("circle").data(yearData);
      edubachCircles = edubachCircles.enter().append("circle")
        .attr("r",10)
        .attr("fill","red")
        .attr("fill-opacity",0.5)
        .attr("cx",function(d) { return xScale(d['Urbanization']); })
        .attr("cy",function(d) { return yScale(d['Edu attainment (Bachelor)']); });
      // edu attainment (primary)
      var eduprimCircles = svg.append("g").selectAll("circle").data(yearData);
      eduprimCircles = eduprimCircles.enter().append("circle")
        .attr("r",10)
        .attr("fill","orange")
        .attr("fill-opacity",0.5)
        .attr("cx",function(d) { return xScale(d['Urbanization']); })
        .attr("cy",function(d) { return yScale(d['Edu attainment (primary)']); });
      //fertility rate
      var fertrateCircles = svg.append("g").selectAll("circle").data(yearData);
      fertrateCircles = fertrateCircles.enter().append("circle")
        .attr("r",10)
        .attr("fill","grey")
        .attr("fill-opacity",0.5)
        .attr("cx",function(d) { return xScale(d['Urbanization']); })
        .attr("cy",function(d) { return yScale(d['Fertility rate']); });
      // gov exp (gdp)
      var govgdpCircles = svg.append("g").selectAll("circle").data(yearData);
      govgdpCircles = govgdpCircles.enter().append("circle")
        .attr("r",10)
        .attr("fill","turquoise")
        .attr("fill-opacity",0.5)
        .attr("cx",function(d) { return xScale(d['Urbanization']); })
        .attr("cy",function(d) { return yScale(d['Govt exp (GDP)']); });
      //govt exp (exp)
      var govexpCircles = svg.append("g").selectAll("circle").data(yearData);
      govexpCircles = govexpCircles.enter().append("circle")
        .attr("r",10)
        .attr("fill","red")
        .attr("fill-opacity",0.5)
        .attr("cx",function(d) { return xScale(d['Urbanization']); })
        .attr("cy",function(d) { return yScale(d['Govt exp (Exp)']); });
      //literacy rate
      var litrateCircles = svg.append("g").selectAll("circle").data(yearData);
      litrateCircles = litrateCircles.enter().append("circle")
        .attr("r",10)
        .attr("fill","green")
        .attr("fill-opacity",0.5)
        .attr("cx",function(d) { return xScale(d['Urbanization']); })
        .attr("cy",function(d) { return yScale(d['Literacy rate']); });
    }

    // Create key
    var keySects = [ {title: "CO2 Emissions (% per capita)", color: "blue"},
                     {title: "Educational Attainment (Primary, % of Population)", color: "orange"},
                     {title: "Educational Attainment (Bachelor, % of Population)", color: "red"},
                     {title: "Fertility Rate (% of Population)", color: "grey"},
                     {title: "Govt Expenditures (% of GDP)", color: "turquoise"} ,
                     {title: "Govt Expenditures (% of Total Govt Expenditures)", color: "red"} ,
                     {title: "Literacy Rate (% of Population)", color: "green"},
                     {title: "Internet Usage (% of Population)", color: "pink"}
                   ];
    createKey();
    function createKey() {
      // Constants
      var xPadding = 20,
          yPosition = 0,
          keyFontSize = 20;

      var keyContainer = d3.select(".keyContainer");
      keyContainer.append("div")
          .attr("x", (graph.width / 2) + offset.left)
          .attr("y", margin.top)
          .attr("text-anchor", "middle")
          .attr("class", "keyTitle")
          .attr("font-size", "32px")
          .text("Key:");
          
      var keyLabels = keyContainer.selectAll('text').data(keySects)
                                  .enter().append("div") // Makes labels stack on top each other
                                  .append("text")
                                  .attr("class", "keySect");

      keyLabels.attr("x", xPadding)
                .attr("y", function(d) {
                  yPosition += 10;
                  return yPosition;
                })
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "hanging")
                .style("font-size", keyFontSize)
                .style("color", d => d.color)
                .style("opacity", 0.5)
                .text(d => d.title);


    }


}); // End callback data func

}); // End DOMContentLoaded
