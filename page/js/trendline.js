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
  indexLowNumber: null,
  indexHighNumber: null,
  rangeselector: 0,
}

dateslider.dateArray = [];

var barchart = {
  contributing_factors: [],
  redraw: null,
}


var parseDate = d3.time.format("%Y-%m-%d").parse;


//------------------------//
//  CSV ENCODING
//------------------------//
d3.csv("./csv/collisions.csv",
        function(error, data) {            
            data.forEach(function(d,i) {
                
                  sparkline.dataset.push({
                    date: parseDate(d.date),
                    all_collisions: +d.all_collisions,
                    injury_collisions: +d.injury_collisions,
                    fatal_collisions: +d.fatal_collisions,
                    // Contributing Factor Types
                    contributing_factors : [
                      { 'value' : +d.accelerator_defective, 'isDraw' : true },
                      { 'value' : +d.aggressive_driving_road_rage, 'isDraw' : true },
                      { 'value' : +d.alcohol_involvement, 'isDraw' : true },
                      { 'value' : +d.animals_action, 'isDraw' : true },
                      { 'value' : +d.backing_unsafely, 'isDraw' : true },
                      { 'value' : +d.brakes_defective, 'isDraw' : true },
                      { 'value' : +d.cell_phone_hand_held, 'isDraw' : true },
                      { 'value' : +d.cell_phone_hands_free, 'isDraw' : true },
                      { 'value' : +d.driver_inattention_distraction, 'isDraw' : true },
                      { 'value' : +d.driver_inexperience, 'isDraw' : true },
                      { 'value' : +d.drugs_illegal, 'isDraw' : true },
                      { 'value' : +d.failure_to_keep_right, 'isDraw' : true },
                      { 'value' : +d.failure_to_yield_right_of_way, 'isDraw' : true },
                      { 'value' : +d.fatigued_drowsy, 'isDraw' : true },
                      { 'value' : +d.fell_asleep, 'isDraw' : true },
                      { 'value' : +d.following_too_closely, 'isDraw' : true },
                      { 'value' : +d.glare, 'isDraw' : true },
                      { 'value' : +d.headlights_defective, 'isDraw' : true },
                      { 'value' : +d.illness, 'isDraw' : true },
                      { 'value' : +d.lane_marking_improper_inadequate, 'isDraw' : true },
                      { 'value' : +d.lost_consciousness, 'isDraw' : true },
                      { 'value' : +d.obstruction_debris, 'isDraw' : true },
                      { 'value' : +d.other_electronic_device, 'isDraw' : true },
                      { 'value' : +d.other_lighting_defects, 'isDraw' : true },
                      { 'value' : +d.other_vehicular, 'isDraw' : true },
                      { 'value' : +d.outside_car_distraction, 'isDraw' : true },
                      { 'value' : +d.oversized_vehicle, 'isDraw' : true },
                      { 'value' : +d.passenger_distraction, 'isDraw' : true },
                      { 'value' : +d.passing_or_lane_usage_improper, 'isDraw' : true },
                      { 'value' : +d.pavement_defective, 'isDraw' : true },
                      { 'value' : +d.pavement_slippery, 'isDraw' : true },
                      { 'value' : +d.pedestrian_bicyclist_other_pedestrian_error_confusion, 'isDraw' : true },
                      { 'value' : +d.physical_disability, 'isDraw' : true },
                      { 'value' : +d.prescription_medication, 'isDraw' : true },
                      { 'value' : +d.reaction_to_other_uninvolved_vehicle, 'isDraw' : true },
                      { 'value' : +d.shoulders_defective_improper, 'isDraw' : true },
                      { 'value' : +d.steering_failure, 'isDraw' : true },
                      { 'value' : +d.tire_failure_inadequate, 'isDraw' : true },
                      { 'value' : +d.tow_hitch_defective, 'isDraw' : true },
                      { 'value' : +d.traffic_control_device_improper_non_working, 'isDraw' : true },
                      { 'value' : +d.traffic_control_disregarded, 'isDraw' : true },
                      { 'value' : +d.turning_improperly, 'isDraw' : true },
                      { 'value' : +d.unsafe_lane_changing, 'isDraw' : true },
                      { 'value' : +d.unsafe_speed, 'isDraw' : true },
                      // { 'value' : +d.unspecified, 'isDraw' : true },
                      { 'value' : +d.view_obstructed_limited, 'isDraw' : true },
                      { 'value' : +d.windshield_inadequate, 'isDraw' : true }]
                    // contributing_factors : [+d.accelerator_defective,+d.aggressive_driving_road_rage,+d.alcohol_involvement,+d.animals_action,+d.backing_unsafely,+d.brakes_defective,+d.cell_phone_hand_held,+d.cell_phone_hands_free,+d.driver_inattention_distraction,+d.driver_inexperience,+d.drugs_illegal,+d.failure_to_keep_right,+d.failure_to_yield_right_of_way,+d.fatigued_drowsy,+d.fell_asleep,+d.following_too_closely,+d.glare,+d.headlights_defective,+d.illness,+d.lane_marking_improper_inadequate,+d.lost_consciousness,+d.obstruction_debris,+d.other_electronic_device,+d.other_lighting_defects,+d.other_vehicular,+d.outside_car_distraction,+d.oversized_vehicle,+d.passenger_distraction,+d.passing_or_lane_usage_improper,+d.pavement_defective,+d.pavement_slippery,+d.pedestrian_bicyclist_other_pedestrian_error_confusion,+d.physical_disability,+d.prescription_medication,+d.reaction_to_other_uninvolved_vehicle,+d.shoulders_defective_improper,+d.steering_failure,+d.tire_failure_inadequate,+d.tow_hitch_defective,+d.traffic_control_device_improper_non_working,+d.traffic_control_disregarded,+d.turning_improperly,+d.unsafe_lane_changing,+d.unsafe_speed,+d.unspecified,+d.view_obstructed_limited,+d.windshield_inadequate]
                  })
                  // Add the dates to its own array for the timeline slider
                  dateslider.dateArray.push(d.date);
            });

            
            console.log("Done Loading.");
            // Set up the slider
            dateslider.draw();
            dateslider.indexLow = 0;
            dateslider.indexHigh = sparkline.dataset.length-1;
            dateslider.indexLowNumber = 0;
            dateslider.indexHighNumber = sparkline.dataset.length-1;

            // Initial draw
            sparkline.redraw();
            barchart.redraw();
            
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
  // sparkline.draw("#sparkline4","");
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

          
          if(dateslider.rangeselector > 0){
            ui.values[0] = ui.values[1] - rangeselector;
          }
          

          tMin = dateslider.dateArray[parseInt(ui.values[0])];
          tMax = dateslider.dateArray[parseInt(ui.values[1])];
          // console.log(ui.values[1] + " " + dateslider.dateArray[parseInt(ui.values[1])]);

          // Index numbers to compare the current trend
          // Used to adjust the color of green or red
          dateslider.indexLow = parseInt(ui.values[0]);
          dateslider.indexHigh = parseInt(ui.values[1]);

          // We can combine this with the top variables if we want to
          // These were needed after the above
          dateslider.indexLowNumber = ui.values[0];
          dateslider.indexHighNumber = ui.values[1];
        
          $( "#date-range" ).val( "  " + tMin + "  -  " + tMax );
          
          // Draw after all calculations
          sparkline.redraw();
          barchart.redraw();
        }

      });
      // Run once after setup.  Display the initial values
      tMin = dateslider.dateArray[parseInt($( "#slider-range" ).slider( "values", 0 ))];
      tMax = dateslider.dateArray[parseInt($( "#slider-range" ).slider( "values", 1 ))];
      $( "#date-range" ).val( "  " + tMin + "  -  " + tMax );

    });

}










//------------------------//
//  BAR CHART
//------------------------//
barchart.redraw = function(){
  // console.log("drawBars()");
 

  var data = {
    // labels: ['Accelerator Defective','Aggressive Driving/Road Rage','Alcohol Involvement','Animals Action','Backing Unsafely','Brakes Defective','Cell Phone (hand-held)','Cell Phone (hands-free)','Driver Inattention/Distraction','Driver Inexperience','Drugs (Illegal)','Failure to Keep Right','Failure to Yield Right-of-Way','Fatigued/Drowsy','Fell Asleep','Following Too Closely','Glare','Headlights Defective','Illness','Lane Marking Improper/Inadequate','Lost Consciousness','Obstruction/Debris','Other Electronic Device','Other Lighting Defects','Other Vehicular','Outside Car Distraction','Oversized Vehicle','Passenger Distraction','Passing or Lane Usage Improper','Pavement Defective','Pavement Slippery','Pedestrian/Bicyclist/Other Pedestrian Error/Confusion','Physical Disability','Prescription Medication','Reaction to Other Uninvolved Vehicle','Shoulders Defective/Improper','Steering Failure','Tire Failure/Inadequate','Tow Hitch Defective','Traffic Control Device Improper/Non-Working','Traffic Control Disregarded','Turning Improperly','Unsafe Lane Changing','Unsafe Speed','Unspecified','View Obstructed/Limited','Windshield Inadequate']
    labels: ['Accelerator Defective','Aggressive Driving/Road Rage','Alcohol Involvement','Animals Action','Backing Unsafely','Brakes Defective','Cell Phone (hand-held)','Cell Phone (hands-free)','Driver Inattention/Distraction','Driver Inexperience','Drugs (Illegal)','Failure to Keep Right','Failure to Yield Right-of-Way','Fatigued/Drowsy','Fell Asleep','Following Too Closely','Glare','Headlights Defective','Illness','Lane Marking Improper/Inadequate','Lost Consciousness','Obstruction/Debris','Other Electronic Device','Other Lighting Defects','Other Vehicular','Outside Car Distraction','Oversized Vehicle','Passenger Distraction','Passing or Lane Usage Improper','Pavement Defective','Pavement Slippery','Pedestrian/Bicyclist/Other Pedestrian Error/Confusion','Physical Disability','Prescription Medication','Reaction to Other Uninvolved Vehicle','Shoulders Defective/Improper','Steering Failure','Tire Failure/Inadequate','Tow Hitch Defective','Traffic Control Device Improper/Non-Working','Traffic Control Disregarded','Turning Improperly','Unsafe Lane Changing','Unsafe Speed','View Obstructed/Limited','Windshield Inadequate']
  };

  values = []
  // Initialize with zeros
  for(var i=0; i<data.labels.length; i++){
    values.push(0);
  }

  // Add the factors
  for(var i1 = dateslider.indexLowNumber; i1 <= dateslider.indexHighNumber; i1++){
    for (var i2=0; i2<data.labels.length; i2++) {
      values[i2] += sparkline.dataset[i1].contributing_factors[i2].value 
    }
  }
  

  var chartWidth       = 200,
      barHeight        = 7,
      groupHeight      = barHeight,
      gapBetweenGroups = 6,
      spaceForLabels   = 260;

  // Zip the series data together (first values, second values, etc.)
  var zippedData = [];
  for (var i=0; i<data.labels.length; i++) {
    zippedData.push(values[i]);
  }

  // Color scale
  var color = d3.scale.category20();
  var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

  var x = d3.scale.linear()
      .domain([0, d3.max(zippedData)])
      .range([0, chartWidth-40]);

  var y = d3.scale.linear()
      .range([chartHeight + gapBetweenGroups, 0]);

  var yAxis = d3.svg.axis()
      .scale(y)
      .tickFormat('')
      .tickSize(0)
      .orient("left");


  // Specify the chart area and dimensions
  d3.select("#chart").select("svg").remove();
  var chart = d3.select("#chart").append("svg")
      .attr("width", spaceForLabels + chartWidth)
      .attr("height", chartHeight);

  // Create bars
  var bar = chart.selectAll("g")
      .data(zippedData)
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/1))) + ")";
      });

  // Create rectangles of the correct width
  bar.append("rect")
      .attr("fill", function(d,i) { return color(i % 1); })
      .attr("class", "bar")
      .attr("width", x)
      .attr("height", barHeight - 1);

  // Add text label in bar
  bar.append("text")
      .attr("x", function(d) { return x(d) + 25; })
      .attr("y", barHeight / 2)
      .attr("fill", "red")
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  // Draw labels
  bar.append("text")
      .attr("class", "label")
      .attr("x", function(d) { return - 10; })
      .attr("y", groupHeight / 2)
      .attr("dy", ".35em")
      .text(function(d,i) {
        if (i % 1 === 0)
          return data.labels[Math.floor(i/1)];
        else
          return ""});

  chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
        .call(yAxis);

}