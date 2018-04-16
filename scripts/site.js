document.addEventListener("DOMContentLoaded", function(){
  // Set constants
  var width = 1000;
  var height = 750;
  var margin = {top: 30, bottom: 50, left: 20, right: 20};


  var svg = d3.select(".scatterplot")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox","0 0 " + " " + width + " " + height)
              .attr("preserveAspectRatio", "xMinYMin meet")
              .style("border", "1px solid #ffffff")

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

    var year = 2012;
    var graphDict = {"Internet usage": {title: "Internet Usage", unit: "% of Population", className: "internet-usage-scatter", color: "pink"},
                "Edu attainment (primary)": {title: "Educational Attainment (Primary)", unit: "% of Population", className: "edu-attainment-prim-scatter",color: "orange"},
                "Govt exp (Exp)": {title: "Government Expenditures", unit: "% of Total Govt Expenditures", className: "govt-exp-scatter", color: "red"},
                "Literacy rate": {title: "Literacy Rate", unit: "% of Population", className: "lit-rate-scatter", color: "green"}
    };

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

    function showInfo(d,str) {
      d3.selectAll(".hover-dot").remove();
      var hoverDot = d3.select(".column.one").append("div")
                              .attr("class", "hover-dot card");
      hoverDot.append("div")
        .attr("x", (graph.width / 2) + offset.left)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .attr("class", "dotTitle")
        .text("Country: " + d['Country name']);
      hoverDot.append("div")
        .attr("x", (graph.width / 2) + offset.left)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .attr("class", "dotTitle")
        .text("Urbanization: " + Math.round((d['Urbanization']) * 100) / 100 + "%");
      hoverDot.append("div")
        .attr("x", (graph.width / 2) + offset.left)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .attr("class", "dotTitle")
        .text(str + ": " + Math.round((d[str]) * 100) / 100 + "%");
    }
    function hideInfo(d,i) {
      console.log("hidee")
      d3.selectAll(".hover-dot").remove();
    }

    // Create scales
    var yMaxPix = height - 100;
    var yMinPix = 40;
    var xMaxPix = width - 40;
    var xMinPix = 100;
    var graph = { width: (xMaxPix - xMinPix), height: (yMaxPix - yMinPix)}
    var offset = { left: 100, top: (height-100) , bottom: 55}

    function yScale(data) {
      if (data != '') {
        var actualYScale = d3.scaleLinear().domain([0,100]).range([yMaxPix, yMinPix]);
        return actualYScale(data);
      }

      else {
        return -999999;
      }
    }

    var yScaleTemp = d3.scaleLinear().domain([0,100]).range([yMaxPix, yMinPix]);
    var yAxis = d3.axisLeft(yScaleTemp).tickFormat(d => d + "%");
    var xScale = d3.scaleLinear().domain([0,100]).range([xMinPix, xMaxPix]);
    var xAxis = d3.axisBottom(xScale).tickFormat(d => d + "%");
    var circleRadius = 5;

    plotPoints(yearData);

    // Create axis
    var formatPercent = d3.format(".0%");

    svg.append("g").call(xAxis).attr("transform", "translate(0,"+(height-100).toString()+")").attr("class", "axis");
    svg.append("g").call(yAxis).attr("transform", "translate(" + offset.left + ")").attr("class", "axis");

    // Create axis labels
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", (graph.width / 2) + offset.left)
        .attr("y", height - offset.bottom)
        .text("Percentage of Urbanization (% of population)");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 0.5*offset.left)
        .attr("x", -0.35*graph.width)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Percentage");

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

    function updateTitle(year) {
      //Update scatterplot title
      svg.select(".graphTitle").remove();
      svg.append("text")
          .attr("x", (graph.width / 2) + offset.left)
          .attr("y", margin.top)
          .attr("text-anchor", "middle")
          .attr("class", "graphTitle")
          .text(year);

      //Update individual scatters title
      for (var key in graphDict){
          var scatterSVG = d3.select("." + graphDict[key]['className'])
          scatterSVG.select(".individSVGSubtitle").remove();
          scatterSVG.append("text")
                    .text(year)
                    .attr("x", 0.5*indivSVGwidth)
                    .attr("y", 0.05*indivSVGheight + 18)
                    .attr("text-anchor", "middle")
                    .attr("class", "individSVGSubtitle");
      }

      // Update slider title
      d3.select(".slider-title").remove();
      d3.select(".slider-container").append("span")
        .attr("class", "slider-title")
        .text("Time: " + year);
    }

    // Update points on scatterplot;
    function updatePoints(year) {
      yearData = getYears(year);
      svg.selectAll("circle").remove();
      plotPoints(yearData);

      // Redraw the individual scatters
      d3.selectAll(".indiv-scatter").remove();

      // Make individual scatterplots
      var row1 = d3.select(".row.one");
      createScatter("Literacy rate", year, row1);
      createScatter("Govt exp (Exp)", year, row1);

      var row2 = d3.select(".row.two");
      createScatter("Edu attainment (primary)", year,row2);
      createScatter("Internet usage", year, row2);
    }

    // Plot all points (points for internet usage, CO2 emissions, etc) on scatterplot
    function plotPoints(yearData) {
      for(var key in graphDict) {
        var dataCircles = svg.append("g").selectAll("circle").data(yearData)
          .enter().append("circle")
          .attr("r",circleRadius)
          .attr("fill",graphDict[key]['color'])
          .attr("fill-opacity",0.5)
          .attr("cx",function(d) { return xScale(d['Urbanization']); })
          .attr("cy",function(d) { return yScale(d[key]); })
          .on("mouseover", function(d) {
            showInfo(d,key); } )
          .on("mouseout", hideInfo);
      }
    }

    // Create key
    var keySects = Array.from( Object.values(graphDict) );

    createKey();
    function createKey() {
      // Constants
      var xPadding = 20,
          yPosition = 0;

      var keyContainer = d3.select(".key-container");
      keyContainer.append("div")
          .attr("x", (graph.width / 2) + offset.left)
          .attr("y", margin.top)
          .attr("text-anchor", "middle")
          .attr("class", "keyTitle")
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
                .style("color", d => d.color)
                .text(d => (d.title + " (" + d.unit + ")"));
    }
//-------------------------------------CREATING THE INDIVIDUAL SCATTER PLOTS----------------------------------------------
    var indivSVGwidth = 300;
    var indivSVGheight = 300;
    var heightPadding = 0.17*indivSVGheight;
    var widthPadding = 0.13*indivSVGwidth;
    var indivSVGrad = 3.5;

    var xPosTitle = 0.5*indivSVGwidth;
    var yPosTitle = 0.07*indivSVGheight;
    var xPosSubTitle = 0.5*indivSVGwidth;
    var yPosSubTitle = yPosTitle + 18;

    var scatterScaleX = d3.scaleLinear().domain([0, 100]).range([widthPadding, indivSVGwidth-widthPadding]);
    var XAxesScale = d3.scaleLinear().domain([0, 100]).range([indivSVGwidth-widthPadding, widthPadding]);
    var tempScaleY = d3.scaleLinear().domain([0, 100]).range([heightPadding, indivSVGheight-heightPadding]);
    var yAxisScale = d3.scaleLinear().domain([0, 100]).range([indivSVGheight-heightPadding, heightPadding]); //Only used to create left-hand axis

    function realYScale(val) {
      if (val != '') {
        return tempScaleY(val);
      }
      else {
        return -999999999;
      }
    }

    //Function that creates a scatter plot of the chosen data indicator
    //Note: creates a new SVG element for each scatter plot.
    function createScatter(indicator, year, row) {
      //Make the initial SVG, all with class ".indiv-scatter" (for updating with time) and id "(indicator)-scatter"
      scatterSVG = row.append("div").attr("class", "individSVGContainer")
                      .append("svg")
                      .attr("class", "indiv-scatter card")
                      .attr("id", graphDict[indicator]['className'])
                      .attr("width", indivSVGwidth)
                      .attr("height", indivSVGheight);

      //Draw the points
      var points = scatterSVG.append("g").selectAll("circle").data(yearData);
      points.enter().append("circle")
                    .attr("cx", function(d) { return scatterScaleX(d['Urbanization']); })
                    .attr("cy", function(d) { return indivSVGheight - realYScale(d[indicator]); })
                    .attr("r", indivSVGrad)
                    .attr("fill", graphDict[indicator]['color']) //Placeholder
                    .attr("fill-opacity", 0.75);

      //Create the axes and title
      var scatterXAxis = d3.axisBottom().scale(scatterScaleX).tickFormat(d => d + "%").ticks(5);
      var scatterYAxis = d3.axisLeft().scale(yAxisScale).tickFormat(d => d + "%").ticks(5);
      scatterSVG.append("g").call(scatterXAxis).attr("transform", "translate(" + 0 +  "," + (indivSVGheight - heightPadding) + ")").attr("class", "axis");
      scatterSVG.append("g").call(scatterYAxis).attr("transform", "translate(" + (widthPadding) + ")").attr("class", "axis");
      scatterSVG.append("text")
                .text(graphDict[indicator]['title'])
                .attr("x", xPosTitle)
                .attr("y", yPosTitle)
                .attr("class", "individSVGTitle")
                .attr("text-anchor", "middle");
      scatterSVG.append("text")
                .text(year)
                .attr("x", xPosSubTitle)
                .attr("y", yPosSubTitle)
                .attr("text-anchor", "middle")
                .attr("class", "individSVGSubtitle");
    }

    // Make individual scatterplots
    var row1 = d3.select(".row.one");
    createScatter("Literacy rate", year, row1);
    createScatter("Govt exp (Exp)", year, row1);

    var row2 = d3.select(".row.two");
    createScatter("Edu attainment (primary)", year,row2);
    createScatter("Internet usage", year, row2);


}); // End callback data func

}); // End DOMContentLoaded
