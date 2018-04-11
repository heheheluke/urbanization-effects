document.addEventListener("DOMContentLoaded", function(){
  // Set constants
  var width = "100%";
  var height = "90%";
  var viewWidth = 1050;
  var viewHeight = 800;
  var padding = 40;


  var svg = d3.select("body").append("svg")
              .attr("class", "scatterplot")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox","0 0 " + " " + viewWidth + " " + viewHeight)
              .attr("preserveAspectRatio", "xMinYMin meet")
              .style("border", "1px solid #cccccc")



    d3.csv("condensed_data.csv", callback);

    function callback(error, data) {
      if (error) throw error;

      // Compute the series names ("y1", "y2", etc.) from the loaded CSV.
      console.log("hi");
      var seriesNames = d3.keys(data[0]);
      console.log(seriesNames);
    }


}); // End DOMContentLoaded
