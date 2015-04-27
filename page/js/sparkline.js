//---------------------------------------------------------//
//  SPARK LINES
//  filename: sparkline.js
//---------------------------------------------------------//


//------------------------//
//  GLOBALS
//------------------------//
var sparkline = {
  top: 10,
  right: 10,
  bottom: 0,
  left: 10,
  width: null,
  height: null,  
  dataset: null,
  draw: null,
  redraw: null,
};

sparkline.width = 150
sparkline.height = 50
sparkline.dataset = [];

//------------------------//
//  CSV ENCODING
//------------------------//
d3.csv("../data/crashdata.csv",
        function(error, data) {
            var newdate;            
            data.forEach(function(d,i) {
                  if(d.BOROUGH == "MANHATTAN"){
                  sparkline.dataset.push({                    
                    date: i,
                    value: +d.NUMBER_OF_PERSONS_INJURED,
                    year: +d.YEAR,
                    week: +d.WEEK,
                    number_of_persons_injured: +d.NUMBER_OF_PERSONS_INJURED,
                    number_of_persons_killed: +d.NUMBER_OF_PERSONS_KILLED,
                    number_of_pedestrians_injured: +d.NUMBER_OF_PEDESTRIANS_INJURED,
                    number_of_pedestrians_killed: +d.NUMBER_OF_PEDESTRIANS_KILLED,
                    number_of_cyclist_injured: +d.NUMBER_OF_CYCLIST_INJURED,
                    number_of_cyclist_killed: +d.NUMBER_OF_CYCLIST_KILLED,
                    number_of_motorist_injured: +d.NUMBER_OF_MOTORIST_INJURED,
                    number_of_motorist_killed: +d.NUMBER_OF_MOTORIST_KILLED,
                  })}
            });
            
            console.log("Done Loading.");
            // Redraw
            sparkline.redraw();
            
        });




//------------------------//
//  RE-DRAW ALL SPARKLINES
//------------------------//
sparkline.redraw = function(){
  // TODO: create an object for this information.
  // TODO: call each in a loop
  sparkline.draw("#sparkline1","number_of_persons_injured");
  sparkline.draw("#sparkline2","number_of_persons_killed");
  sparkline.draw("#sparkline3","number_of_motorist_injured");
  sparkline.draw("#sparkline4","number_of_motorist_killed");
  sparkline.draw("#sparkline5","number_of_cyclist_injured");
  sparkline.draw("#sparkline6","number_of_cyclist_killed");
  sparkline.draw("#sparkline7","number_of_pedestrians_injured");
  sparkline.draw("#sparkline8","number_of_pedestrians_killed");
}




//------------------------//
//  DRAW THE SPARKLINE
//------------------------//
sparkline.draw = function(id, attribute){
  console.log("Drawing: " + attribute);

  // Domain with y inverted
  var x = d3.scale.linear().range([0, sparkline.width]);
  var y = d3.scale.linear().range([sparkline.height, 0]);

  // Create the line 
  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d[attribute]); });


  // Updated the input domains based on the data  
  x.domain(d3.extent(sparkline.dataset, function(d) { return d.date; }));
  y.domain([0, d3.max(sparkline.dataset, function(d) { return d[attribute]; })]);  

  // Remove the existing svg then draw
  d3.select(id).select("svg").remove();
  var svg = d3.select(id).append("svg")
        .attr("width", sparkline.width + sparkline.left + sparkline.right)
        .attr("height", sparkline.height + sparkline.top + sparkline.bottom)
        .append("g")
        .attr("transform", "translate(" + sparkline.left + "," + sparkline.top + ")");

  // Draw the spark line
  svg.append("path")
      .datum(sparkline.dataset)
      .attr("class", "sparkline")
      .attr("d", line);
}

