//---------------------------------------------------------//
//  TREND LINES
//  filename: trendline.js
//---------------------------------------------------------//




//------------------------//
//  GLOBALS
//------------------------//
var sparkline = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: null,
  height: null,  
  dataset: null,
  draw: null,
  redraw: null,
};

sparkline.width = 150
sparkline.height = 70
sparkline.dataset = [];



var dateslider = {
  draw: null,
  dateArray: null,
  indexLow: null,
  indexHigh: null,
}

dateslider.dateArray = [];




var parseDate = d3.time.format("%Y-%m-%d").parse;


//------------------------//
//  CSV ENCODING
//------------------------//
d3.csv("./csv/collisions.csv",
        function(error, data) {            
            data.forEach(function(d,i) {

                  sparkline.dataset.push({
                    date: parseDate(d.DATE),
                    all_collisions: +d.ALL_COLLISIONS,
                    injury_collisions: +d.INJURY_COLLISIONS,
                    fatal_collisions: +d.FATAL_COLLISIONS,
                  })
                  // Add the dates to its own array for the timeline slider
                  dateslider.dateArray.push(d.DATE);
            });

            
            console.log("Done Loading.");
            // Set up the slider
            dateslider.draw();
            dateslider.indexLow = 0;
            dateslider.indexHigh = sparkline.dataset.length-1;

            // Initial draw
            sparkline.redraw();
            
        });




//------------------------//
//  RE-DRAW ALL SPARKLINES
//------------------------//
sparkline.redraw = function(){
  // TODO: create an object for this information.
  // TODO: call each in a loop
  sparkline.draw("#sparkline1","all_collisions");
  sparkline.draw("#sparkline2","injury_collisions");
  sparkline.draw("#sparkline3","fatal_collisions");
  // sparkline.draw("#sparkline4","number_of_motorist_killed");
  // sparkline.draw("#sparkline5","number_of_cyclist_injured");
  // sparkline.draw("#sparkline6","number_of_cyclist_killed");
  // sparkline.draw("#sparkline7","number_of_pedestrians_injured");
  // sparkline.draw("#sparkline8","number_of_pedestrians_killed");
}




//------------------------//
//  DRAW THE SPARKLINE
//------------------------//
sparkline.draw = function(id, attribute){
  // console.log("Drawing: " + attribute);

  // Domain with y inverted
  var x = d3.scale.linear().range([0, sparkline.width]);
  var y = d3.scale.linear().range([sparkline.height, 0]);

  // Create the line 
  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d[attribute]); });


  // Set up the domain based on the date slider
  x.domain(d3.extent( [parseDate(tMin), parseDate(tMax)] ));
  y.domain([0, d3.max(sparkline.dataset, function(d) { return d[attribute]; })]);  

  // Remove the existing svg then draw
  d3.select(id).select("svg").remove();
  var svg = d3.select(id).append("svg")
        .attr("width", sparkline.width + sparkline.left + sparkline.right)
        .attr("height", sparkline.height + sparkline.top + sparkline.bottom)
        .append("g")
        .attr("transform", "translate(" + sparkline.left + "," + sparkline.top + ")");

  var trendcolor = (sparkline.dataset[dateslider.indexLow][attribute] >= sparkline.dataset[dateslider.indexHigh][attribute]) ? "sparkline decreasing" : "sparkline increasing";
  console.log(sparkline.dataset[dateslider.indexLow][attribute] + " >= " + sparkline.dataset[dateslider.indexHigh][attribute]);  
  console.log("indexHigh: " + dateslider.indexHigh);
  
  // Draw the spark line
  svg.append("path")
      .datum(sparkline.dataset)
      .attr("class", trendcolor)
      .attr("d", line);
}






//------------------------//
//  TIME SLIDER
//------------------------//
dateslider.draw = function(){
  $(function() {
      $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: dateslider.dateArray.length-1,
        values: [ 0, dateslider.dateArray.length ],
        
        slide: function( event, ui ) {
          tMin = dateslider.dateArray[parseInt(ui.values[0])];
          tMax = dateslider.dateArray[parseInt(ui.values[1])];
          // console.log(ui.values[1] + " " + dateslider.dateArray[parseInt(ui.values[1])]);

          // Index numbers to compare the current trend
          // Used to adjust the color of green or red
          dateslider.indexLow = parseInt(ui.values[0]);
          dateslider.indexHigh = parseInt(ui.values[1]);
        
          $( "#date-range" ).val( "  " + tMin + "  -  " + tMax );
          
          // Draw after all calculations
          sparkline.redraw();
        }

      });
      tMin = dateslider.dateArray[parseInt($( "#slider-range" ).slider( "values", 0 ))];
      tMax = dateslider.dateArray[parseInt($( "#slider-range" ).slider( "values", 1 ))];
      $( "#date-range" ).val( "  " + tMin + "  -  " + tMax );

    });
}