document.addEventListener("DOMContentLoaded", function(){
  // Set constants
  var width = '100%';
  var height = '90%';
  var padding = 40;

  
  var svg = d3.select("body").append("svg")
              .attr("class", "scatterplot")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox","0 0 " + " " + width + " " + height)
              .attr("preserveAspectRatio", "xMinYMin meet")
              .style("border", "1px solid #cccccc")

  svg.append("rect")
    .attr("width", "50px")
    .attr("height", "50px")
    .attr("fill", "pink");


}); // End DOMContentLoaded
