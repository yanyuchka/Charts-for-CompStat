/*
*   Filename: dashboard.js
*/

// --- File Globals
var thisFileName = "dashboard.js";
var list_of_precincts = [1,5,6,7,9,10,13,14,17,18,19,20,22,23,24,25,26,28,30,32,33,34,40,41,42,43,44,45,46,47,48,49,50,52,60,61,62,63,66,67,68,69,70,71,72,73,75,76,77,78,79,81,83,84,88,90,94,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,120,121,122,123];
var initialPrecinct = 1;


// --- Sparkline Global Variables
var sparkline = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 150,
  height: 20,  
  dataset: null,
  draw: null,
  redraw: null,
  loadCSV: null,
  loadDropdownDates: null,
  csvFileDirectory: "./csv/pcts/",
  csvFileName: "collisions_",
  csvFileExtension: ".csv",
};

// sparkline.dataset = [];

var parseDate = d3.time.format("%Y-%m-%d").parse;



// --- Date Slider Global Variables
var dateslider = {
  draw: null,
  dateArray: null,
  indexLow: null,
  indexHigh: null,
  indexLowNumber: null,
  indexHighNumber: null,
  dateselector: 0,
  rangerange: 0,
  rangeday: 1,
  rangeweek: 7,
  range28day: 28,
  rangeyear: 365,
  initButtons: null,
}

dateslider.dateArray = [];





// --- Bar Chart Global Variables
var barchart = {
  contributing_factors: [],
  redraw: null,
}





// --- Daily trend line
var dailytrendline = {
  dataset: null,
  redraw: null,
  loadCSV: null,
  csvFileDirectory: "./csv/pcts_daily/",
  csvFileName: "collisions_",
  csvFileExtension: ".csv",
}

dailytrendline.dataset = [];















/*  Logging function for displaying the filename and function calling the log
 *  @param:  string    log message
 *  @param:  string    current file name
 *  @return: None
*/
function log(m, f)
{
  var message;

  if(f.length == 0)
  {
    message = "[" + thisFileName + "]"; 
  } 
  else if(f.length > 0)
  {
    message = "[" + thisFileName + "][" + f + "] " + m;
  }
  console.log(message);  
}





/*  Run this first to initialize the dashboard
 *  @param:  None
 *  @return: None
*/
function initDashboard()
{
  log("Initializing", "initDashboard");

  // Initialize the precinct dropdown
  initPrecinctSelect();
  
  // Load the Daily Trend Line Dataset
  dailytrendline.loadCSV(dailytrendline.csvFileDirectory + dailytrendline.csvFileName + initialPrecinct + dailytrendline.csvFileExtension);

  // Load the Spark Line Dataset
  sparkline.loadCSV(sparkline.csvFileDirectory + sparkline.csvFileName + initialPrecinct + sparkline.csvFileExtension);
}






/*  Initialize the precinct selector
 *  @param:  None
 *  @return: None
*/
function initPrecinctSelect()
{

  // Populate the precincts dropdown dynamically
  list_of_precincts.forEach(function(d){$( "<option value=\"" + d + "\">" + "Precinct: " + d + "</option>" ).appendTo( $( "#select_precincts" ) );});
  log("Load Dropdown Precincts", "initPrecinctSelect");

  $( "#select_precincts" ).change(function()
  {
    // Get the precinct value from the dropdown
    var csvFileNumber = $("#select_precincts").val();

    // Load the Daily Trend Line Dataset
    dailytrendline.loadCSV(dailytrendline.csvFileDirectory + dailytrendline.csvFileName + csvFileNumber + dailytrendline.csvFileExtension);

    // Load the Spark Line Dataset
    sparkline.loadCSV(sparkline.csvFileDirectory + sparkline.csvFileName + csvFileNumber + sparkline.csvFileExtension);

    log("Loading Precinct: " + csvFileNumber, "initPrecinctSelect");
  });
}









/*  Load the CSV current file
 *  @param:  string   Filename and direcotry of the current CSV file selected from the dropdown
 *  @return: None
*/
sparkline.loadCSV = function(filename)
{
  // Clear the dataset and date array
  sparkline.dataset = [];

  
  // Load daily trendline dataset
  // Load date slider dataset
  d3.csv(filename,
    function(error, data) {            
        data.forEach(function(d,i)
        {
          sparkline.dataset.push({
            all_collisions: +d.all_collisions,
            injury_collisions: +d.injury_collisions,
            fatal_collisions: +d.fatal_collisions,
            injures: +d.injures,
            fatalities: +d.fatalities,
            cyclists_involved: +d.cyclists_involved,
            pedestrians_involved: +d.pedestrians_involved,
            year: +d.year,
            week: +d.week,
            row_number: +d.row_number,
            label: d.label,
          })
    
    }); //data.forEach

    // Initial draw
    sparkline.redraw();

    // Populate the dropdown with dates
    sparkline.loadDropdownDates();

    log("Done Loading.", "sparkline.loadCSV" + ": " + filename);
   
  }); //d3.csv
} //sparkline.loadCSV










/*  Load the CSV current file
 *  @param:  string   Filename and direcotry of the current CSV file selected from the dropdown
 *  @return: None
*/
dailytrendline.loadCSV = function(filename)
{
  // Clear the dataset and date array
  dailytrendline.dataset = [];
  dateslider.dateArray = [];

  
  // Load daily trendline dataset
  // Load date slider dataset
  d3.csv(filename,
    function(error, data) {            
        data.forEach(function(d,i)
        {
          dailytrendline.dataset.push({
            precinct: +d.precinct,
            date: parseDate(d.date),
            
            all_collisions: +d.all_collisions,
            injury_collisions: +d.injury_collisions,
            fatal_collisions: +d.fatal_collisions,
            
          })

          // Add the dates to its own array for the timeline slider
          dateslider.dateArray.push(d.date);
    
    }); //data.forEach
    
    dateslider.indexLow = 0;
    dateslider.indexHigh = sparkline.dataset.length-1;
    dateslider.indexLowNumber = 0;
    dateslider.indexHighNumber = sparkline.dataset.length-1;

    // Initial draw
    dateslider.redraw();

    log("Done Loading.", "dailytrendline.loadCSV" + ": " + filename);
   
  }); //d3.csv
} //dailytrendline.loadCSV












/*  Redraw all of the sparklines
 *  @param:  None
 *  @return: None
*/
sparkline.redraw = function()
{
  // TODO: create an object for this information.
  // TODO: call each in a loop
  sparkline.draw("#sparkline1","all_collisions");
  sparkline.draw("#sparkline2","injury_collisions");
  sparkline.draw("#sparkline3","fatal_collisions");
  // sparkline.draw("#sparkline4","injures");
  // sparkline.draw("#sparkline5","fatalities");
  // sparkline.draw("#sparkline6","cyclists_involved");
  // sparkline.draw("#sparkline7","pedestrians_involved");
}







/*  Draw a single sparkline
 *  @param:  string    id of the div
 *  @param:  string    csv attribute of the sparkline to draw
 *  @return: None
*/
sparkline.draw = function(id, attribute)
{
  log("Drawing: " + attribute, "sparkline.draw");

  // Domain with y inverted
  var x = d3.scale.linear().range([0, sparkline.width]);
  var y = d3.scale.linear().range([sparkline.height, 0]);


  // Create the line 
  // Changed the line to linear because basis distorted the ends and made it difficult
  // to see the difference from high and low comparing numbers
  // https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate
  var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return x(d.row_number); })
      .y(function(d) { return y(d[attribute]); });


  // Set up the domain based on the date slider
  x.domain(d3.extent(sparkline.dataset, function(d) { return d.row_number; }));
  y.domain([0, d3.max(sparkline.dataset, function(d) { return d[attribute]; })]);

  // Remove the existing svg then draw
  d3.select(id).select("svg").remove();

  // Redraw the svg
  var svg = d3.select(id).append("svg")
        .attr("width", sparkline.width + sparkline.left + sparkline.right)
        .attr("height", sparkline.height + sparkline.top + sparkline.bottom)
        .append("g")
        .attr("transform", "translate(" + sparkline.left + "," + sparkline.top + ")");


  // Set the color of the trend line based on start and end 
  dataMin = d3.min(sparkline.dataset, function(d) { return d[attribute]; });
  dataMax = d3.max(sparkline.dataset, function(d) { return d[attribute]; });
  var trendcolor = (sparkline.dataset[dataMin][attribute] >= sparkline.dataset[dataMax][attribute] ? "sparkline decreasing" : "sparkline increasing");
  // log(sparkline.dataset[dateslider.indexLow][attribute] + " >= " + sparkline.dataset[dateslider.indexHigh][attribute], "sparkline.draw");  

  // Draw the trend line
  svg.append("path")
      .datum(sparkline.dataset)
      .attr("class", trendcolor)
      .attr("d", line);
}







/*  Populate the dropdown dates
 *  @param:  None
 *  @return: None
*/
sparkline.loadDropdownDates = function(dates){
  
  // Append each of the dates to the dropdown
  sparkline.dataset.forEach(function(d){
    $( "<option>" + d.label + "</option>" ).appendTo( $( "#select_dates" ) );
  });

  log("Load Dropdown Dates", "loadDropdownDates");
}








/*  Draw the daily trend line
 *  @param:  string    id of the div
 *  @return: None
*/
dailytrendline.draw = function(id, attribute)
{
  log("Drawing: " + attribute, "sparkline.draw");

  // Domain with y inverted
  var x = d3.scale.linear().range([0, sparkline.width]);
  var y = d3.scale.linear().range([sparkline.height, 0]);


  // Create the line 
  // Changed the line to linear because basis distorted the ends and made it difficult
  // to see the difference from high and low comparing numbers
  // https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate
  var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d[attribute]); });


  // Set up the domain based on the date slider
  x.domain(d3.extent( [parseDate(tMin), parseDate(tMax)] ));
  y.domain([0, d3.max(sparkline.dataset, function(d) { return d[attribute]; })]);  

  // Remove the existing svg then draw
  d3.select(id).select("svg").remove();

  // Redraw the svg
  var svg = d3.select(id).append("svg")
        .attr("width", sparkline.width + sparkline.left + sparkline.right)
        .attr("height", sparkline.height + sparkline.top + sparkline.bottom)
        .append("g")
        .attr("transform", "translate(" + sparkline.left + "," + sparkline.top + ")");


  // Set the color of the trend line based on start and end 
  var trendcolor = (sparkline.dataset[dateslider.indexLow][attribute] >= sparkline.dataset[dateslider.indexHigh][attribute]) ? "sparkline decreasing" : "sparkline increasing";
  // log(sparkline.dataset[dateslider.indexLow][attribute] + " >= " + sparkline.dataset[dateslider.indexHigh][attribute], "sparkline.draw");  


  // Draw the trend line
  svg.append("path")
      .datum(sparkline.dataset)
      .attr("class", trendcolor)
      .attr("d", line);
}














/*  Draw the date timeline slider
 *  @param:  None
 *  @return: None
*/
dateslider.redraw = function()
{
  $(function() {
      $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: dateslider.dateArray.length-1,
        values: [ 0, dateslider.dateArray.length ],
        
        slide: function( event, ui ) {

          // Lock in the lower value so that it doesn't go less then zero
          if(dateslider.dateselector > 0){
            if(ui.values[1]>dateslider.dateselector){
              // Make the lower value either 7 days, 28 days or 365 days less than the high value
              ui.values[0] = ui.values[1] - dateslider.dateselector;
            }
          }


          tMin = dateslider.dateArray[parseInt(ui.values[0])];
          tMax = dateslider.dateArray[parseInt(ui.values[1])];
          // log(ui.values[1] + " " + dateslider.dateArray[parseInt(ui.values[1])], dateslider.draw);

          // Index numbers to compare the current trend
          // Used to adjust the color of green or red
          dateslider.indexLow = parseInt(ui.values[0]);
          dateslider.indexHigh = parseInt(ui.values[1]);

          dateslider.indexLowNumber = ui.values[0];
          dateslider.indexHighNumber = ui.values[1];
        
          $( "#date-range" ).val( "  " + tMin + "  -  " + tMax );
          
          // Draw after all calculations
          sparkline.redraw();
          //barchart.redraw();
        } //END: Slide

      });

      // Run once. Initial values displayed
      tMin = dateslider.dateArray[parseInt($( "#slider-range" ).slider( "values", 0 ))];
      tMax = dateslider.dateArray[parseInt($( "#slider-range" ).slider( "values", 1 ))];
      $( "#date-range" ).val( "  " + tMin + "  -  " + tMax );

      // Initialize the buttons
      dateslider.initButtons();
  });
}// END: dateslider.draw()












/*  Initialize the time slider buttons
 *  @param:  None
 *  @return: None
*/
dateslider.initButtons = function()
{
  $( "#btn-range" ).click(function() { 
    dateslider.dateselector = dateslider.rangerange;
    $(this).css('color', 'orange');
    $("#btn-day").css('color', 'black');
    $("#btn-28day").css('color', 'black');
    $("#btn-week").css('color', 'black');
    $("#btn-year").css('color', 'black');
  });

  $( "#btn-day" ).click(function() { 
    $( "#slider-range" ).slider( "option", "values", [0,$( "#slider-range" ).slider( "values", 1 )] );
    dateslider.dateselector = dateslider.rangeday;
    $(this).css('color', 'orange');
    $("#btn-range").css('color', 'black');
    $("#btn-28day").css('color', 'black');
    $("#btn-week").css('color', 'black');
    $("#btn-year").css('color', 'black');
  });

  $( "#btn-week" ).click(function() { 
    $( "#slider-range" ).slider( "option", "values", [0,$( "#slider-range" ).slider( "values", 1 )] );
    dateslider.dateselector = dateslider.rangeweek;
    $(this).css('color', 'orange');
    $("#btn-day").css('color', 'black');
    $("#btn-28day").css('color', 'black');
    $("#btn-year").css('color', 'black');
    $("#btn-range").css('color', 'black');
  });

  $( "#btn-28day" ).click(function() { 
    $( "#slider-range" ).slider( "option", "values", [0,$( "#slider-range" ).slider( "values", 1 )] );
    dateslider.dateselector = dateslider.range28day;
    $(this).css('color', 'orange');
    $("#btn-day").css('color', 'black');
    $("#btn-week").css('color', 'black');
    $("#btn-year").css('color', 'black');
    $("#btn-range").css('color', 'black');
  });

  $( "#btn-year" ).click(function() { 
    $( "#slider-range" ).slider( "option", "values", [0,$( "#slider-range" ).slider( "values", 1 )] );
    dateslider.dateselector = dateslider.rangeyear;
    $(this).css('color', 'orange');
    $("#btn-day").css('color', 'black');
    $("#btn-28day").css('color', 'black');
    $("#btn-week").css('color', 'black');
    $("#btn-range").css('color', 'black');
  });
}







/*  Draw the contributing factors barchart
 *  @param:  None
 *  @return: None
*/
barchart.redraw = function(){
  // log("drawBars()", "barchart.redraw");
 

  // labels without 'Unspecified'
  var labels = ['Accelerator Defective','Aggressive Driving/Road Rage','Alcohol Involvement','Animals Action','Backing Unsafely','Brakes Defective','Cell Phone (hand-held)','Cell Phone (hands-free)','Driver Inattention/Distraction','Driver Inexperience','Drugs (Illegal)','Failure to Keep Right','Failure to Yield Right-of-Way','Fatigued/Drowsy','Fell Asleep','Following Too Closely','Glare','Headlights Defective','Illness','Lane Marking Improper/Inadequate','Lost Consciousness','Obstruction/Debris','Other Electronic Device','Other Lighting Defects','Other Vehicular','Outside Car Distraction','Oversized Vehicle','Passenger Distraction','Passing or Lane Usage Improper','Pavement Defective','Pavement Slippery','Pedestrian/Bicyclist/Other Pedestrian Error/Confusion','Physical Disability','Prescription Medication','Reaction to Other Uninvolved Vehicle','Shoulders Defective/Improper','Steering Failure','Tire Failure/Inadequate','Tow Hitch Defective','Traffic Control Device Improper/Non-Working','Traffic Control Disregarded','Turning Improperly','Unsafe Lane Changing','Unsafe Speed','View Obstructed/Limited','Windshield Inadequate'];
  
  // labels with 'Unspecified'
  // var data = ['Accelerator Defective','Aggressive Driving/Road Rage','Alcohol Involvement','Animals Action','Backing Unsafely','Brakes Defective','Cell Phone (hand-held)','Cell Phone (hands-free)','Driver Inattention/Distraction','Driver Inexperience','Drugs (Illegal)','Failure to Keep Right','Failure to Yield Right-of-Way','Fatigued/Drowsy','Fell Asleep','Following Too Closely','Glare','Headlights Defective','Illness','Lane Marking Improper/Inadequate','Lost Consciousness','Obstruction/Debris','Other Electronic Device','Other Lighting Defects','Other Vehicular','Outside Car Distraction','Oversized Vehicle','Passenger Distraction','Passing or Lane Usage Improper','Pavement Defective','Pavement Slippery','Pedestrian/Bicyclist/Other Pedestrian Error/Confusion','Physical Disability','Prescription Medication','Reaction to Other Uninvolved Vehicle','Shoulders Defective/Improper','Steering Failure','Tire Failure/Inadequate','Tow Hitch Defective','Traffic Control Device Improper/Non-Working','Traffic Control Disregarded','Turning Improperly','Unsafe Lane Changing','Unsafe Speed','Unspecified','View Obstructed/Limited','Windshield Inadequate']

  // Contributing factors values array
  values = []
  
  // Initialize all values with with zeros for redraw
  for(var i = 0; i < labels.length; i++){
    values.push(0);
  }

  // Add the Contributing Factors
  for(var i1 = dateslider.indexLowNumber; i1 <= dateslider.indexHighNumber; i1++){
    for (var i2=0; i2<labels.length; i2++) {
      values[i2] += sparkline.dataset[i1].contributing_factors[i2].value 
    }
  }
  

  var chartWidth       = 200,
      barHeight        = 7,
      groupHeight      = barHeight,
      gapBetweenGroups = 6,
      spaceForLabels   = 250;

  // Zip the series data together (first values, second values, etc.)
  var zippedData = [];
  for (var i=0; i<labels.length; i++) {
    zippedData.push(values[i]);
  }

  var chartHeight = barHeight * zippedData.length + gapBetweenGroups * labels.length;

  var x = d3.scale.linear()
      .domain([0, d3.max(zippedData)])
      .range([0, chartWidth-20]);

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
        return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + i)) + ")";
      });

  // Create rectangles of the correct width
  bar.append("rect")
      .attr("fill", "steelblue" )
      .attr("class", "bar")
      .attr("width", x)
      .attr("height", barHeight);

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
      .text(function(d,i) {return labels[i]});

  chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
        .call(yAxis);
}
