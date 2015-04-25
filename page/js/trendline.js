//---------------------------------------------------------//
//  TREND LINES
//  filename: trendline.js
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


var parseDate = d3.time.format("%Y-%m-%d").parse;


var dateArray = [];

//------------------------//
//  CSV ENCODING
//------------------------//
d3.csv("./csv/collisions.csv",
        function(error, data) {            
            data.forEach(function(d,i) {

                  sparkline.dataset.push({
                    date: parseDate(d.DATE),
                    unparseddate: d.DATE,
                    all_collisions: +d.ALL_COLLISIONS,
                    injury_collisions: +d.INJURY_COLLISIONS,
                    fatal_collisions: +d.FATAL_COLLISIONS,
                  })

                  dateArray.push(d.DATE);
            });

            
            console.log("Done Loading.");
            timeSlider();
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
  // x.domain(d3.extent(sparkline.dataset, function(d) { return d.date; }));



  x.domain(d3.extent( [parseDate(tMin), parseDate(tMax)] ));
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






//------------------------//
//  TIME SLIDER
//------------------------//
function timeSlider(){
  $(function() {
      $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: dateArray.length-1,
        values: [ 0, dateArray.length-1 ],
        slide: function( event, ui ) {
          tMin = dateArray[parseInt(ui.values[0])];
          tMax = dateArray[parseInt(ui.values[1])];
          $( "#date-range" ).val( "  " + tMin + "  -  " + tMax );
          sparkline.redraw();
        }
      });
      tMin = dateArray[parseInt($( "#slider-range" ).slider( "values", 0 ))];
      tMax = dateArray[parseInt($( "#slider-range" ).slider( "values", 1 ))];
      $( "#date-range" ).val( "  " + tMin + "  -  " + tMax );

      // $( "#slider-range" ).on( "slidechange", function( event, ui ) {} );

    });
}