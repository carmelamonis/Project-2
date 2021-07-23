$("#bar").empty();

// Define svg width and height
var svgWidth = 1000;
var svgHeight = 500;

// Set margins for bar
var margin = { top: 20, right: 40, bottom: 90, left: 100 };

// Define bar width and height (svg area - margins)
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append SVG that holds the chart
var svg = d3.select("#bar")
  .append("svg")
  //.attr("viewBox", `0 0 ${svgWidth + 200} ${svgHeight}`)
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append the bar group and shift the group by left and top margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "race";
var chosenYAxis = "count";

//--- RACE VICTIM aggregate function ---//
function raceVictimTotals(massData, race) {
  var temp = [];
  var c1 = 0;
  var c2 = 0;
  var c3 = 0;
  massData.forEach(d => {
    if (d.race == race) {
      c1 += d.total_victims;
      c2 += d.fatalities;
      c3 += d.injured; 
    }
  })
  temp.push(c1, c2, c3);
  return temp;
}
//--- AGEBIN VICTIM aggregate function ---//
function ageVictimTotals(massData, young, old) {
  var temp = [];
  var c1 = 0;
  var c2 = 0;
  var c3 = 0;
  massData.forEach(d => {
    if (d.age_of_shooter >= young && d.age_of_shooter < old) {
      c1 += d.total_victims;
      c2 += d.fatalities;
      c3 += d.injured; 
    }
  })
  temp.push(c1, c2, c3);
  return temp;
}//--- X SCALE function - updates xScale upon axis change ---//
function xScale(xdata, chosenXAxis) {
  var xBandScale = d3.scaleBand()
    .domain(xdata.map(d => d[chosenXAxis]))
    .range([0, width])
    .padding(0.1);
  return xBandScale;
}
//--- Y SCALE function - updates yScale upon axis change ---//
function yScale(ydata, chosenYAxis) {
  if (chosenYAxis == "total_vic") {
    var yLinearScale = d3.scaleLinear()
    .domain([ d3.min(ydata, d => d[chosenYAxis] - 88 ),
              d3.max(ydata, d => d[chosenYAxis] + 88 ) ])
    .range([height, 0]);
  return yLinearScale;
  }
  else {
    var yLinearScale = d3.scaleLinear()
    .domain([ d3.min(ydata, d => d[chosenYAxis] - 4 ),
              d3.max(ydata, d => d[chosenYAxis] + 4 ) ])
    .range([height, 0]);
  return yLinearScale;
  }
}
//--- X AXIS RENDER function - updates bottom axis upon axis change ---//
function renderXaxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
//--- Y AXIS RENDER function - updates left axis upon axis change ---//
function renderYaxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale).ticks(10);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}
//--- RECTANGLE RENDER function - updates rectangle group upon axis change ---//
function renderRect(newData, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  var xlabel;
    if (chosenXAxis === "race") {
      xlabel = "Race: ";
    }
    else {
      xlabel = "Age Group: ";
    }
    var ylabel;
    if (chosenYAxis === "count") {
      ylabel = "# Incidents: ";
    }
    else {
      ylabel = "Total Victims: ";
    }
  // create a tooltip
  var Tooltip = d3.select("#bar")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "4px")
    .style("padding", "4px")
    
  // Two functions that change the tooltip when user hover / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1) // makes tooltip show
      .style("left", (parseInt(d3.select(this).attr("x")) + 105) + "px")
      .style("top",  (parseInt(d3.select(this).attr("y")) + 230) + "px")
      .html(`${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`)
    d3.select(this)
      .style("stroke", "black")
      .style("fill", "#FFDA87")  
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("fill", "#C3073F")  
  }
  chartGroup.selectAll("rect").remove() 
  // Create one rectagle group - linear and band scales to position each rect in the chart
  var rectangleGroup = chartGroup.selectAll("rect")
    .data(newData)
    .enter()
    .append("rect")
      // .transition()
      // .duration(1000)
      .attr("class", "bar")
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]))
      .attr("width", newXScale.bandwidth())
      .attr("height", d => height - newYScale(d[chosenYAxis]))
      .attr("fill", "#c3073F")
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
    .on("click", function(d) {
      console.log("clicked") 
    });
  return rectangleGroup;
}

d3.json("/api/mass_shootings").then((massData, err) => {
  if (err) throw err;
  console.log(massData);
  
  // Get race incidences count and victims
  var allRaces = [];
  var races = massData.map(d => d.race);

  var cnt = races.filter(v => (v === "White")).length;
  var holder = raceVictimTotals(massData, "White");
  allRaces.push({race:"White", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]}); 
  cnt = races.filter(v => (v === "Black")).length;
  var holder = raceVictimTotals(massData, "Black");
  allRaces.push({race:"Black", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});
  cnt = races.filter(v => (v === "Latino")).length;
  var holder = raceVictimTotals(massData, "Latino");
  allRaces.push({race:"Latino", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});   
  cnt = races.filter(v => (v === "Native American")).length;
  var holder = raceVictimTotals(massData, "Native American");
  allRaces.push({race:"Native American", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});    
  cnt = races.filter(v => (v === "Asian")).length;
  var holder = raceVictimTotals(massData, "Asian");
  allRaces.push({race:"Asian", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});    
  cnt = races.filter(v => (v === "Unknown")).length;
  var holder = raceVictimTotals(massData, "Unknown");
  allRaces.push({race:"Unknown", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});    
  cnt = races.filter(v => (v === "Other")).length;
  var holder = raceVictimTotals(massData, "Other");
  allRaces.push({race:"Other", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});    
  cnt = races.filter(v => (v === "Unclear")).length;
  var holder = raceVictimTotals(massData, "Unclear");
  allRaces.push({race:"Unclear", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});    
    
  allRaces.sort(({count:a}, {count:b}) => b-a);
  console.log(allRaces);

  // Get age incidences count and victims
  var allAges = [];
  var ages = massData.map(d => d.age_of_shooter);

  var cnt = ages.filter(v => (v >= 10 && v < 20)).length;
  var holder = ageVictimTotals(massData, 10, 20);
  allAges.push({agebin:"10-19", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});
  var cnt = ages.filter(v => (v >= 20 && v < 30)).length;
  var holder = ageVictimTotals(massData, 20, 30);
  allAges.push({agebin:"20-29", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});
  var cnt = ages.filter(v => (v >= 30 && v < 40)).length;
  var holder = ageVictimTotals(massData, 30, 40);
  allAges.push({agebin:"30-39", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});
  var cnt = ages.filter(v => (v >= 40 && v < 50)).length;
  var holder = ageVictimTotals(massData, 40, 50);
  allAges.push({agebin:"40-49", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});
  var cnt = ages.filter(v => (v >= 50 && v < 60)).length;
  var holder = ageVictimTotals(massData, 50, 60);
  allAges.push({agebin:"50-59", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});
  var cnt = ages.filter(v => (v >= 60 && v < 70)).length;
  var holder = ageVictimTotals(massData, 60, 70);
  allAges.push({agebin:"60-69", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});
  var cnt = ages.filter(v => (v == "Unknown")).length;
  var holder = [];
  var c1 = 0;
  var c2 = 0;
  var c3 = 0;
  massData.forEach(d => { 
    if (d.age_of_shooter == "Unknown") { 
      c1 += d.total_victims;
      c2 += d.fatalities;
      c3 += d.injured; 
    }
  })
  holder.push(c1, c2, c3); 
  allAges.push({agebin:"Unknown", count: cnt, total_vic: holder[0], fatal: holder[1], injured: holder[2]});
    
  allAges.sort(({agebin:a}, {agebin:b}) => b-a);
  console.log(allAges);
  
  // Create x axis scale with padding
  var xBandScale = xScale(allRaces, chosenXAxis);
  // Create a linear scale for the vertical axis
  var yLinearScale = yScale(allRaces, chosenYAxis);
    
  // Create chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  var xAxis = chartGroup.append("g")
    .classed("axisText", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  var yAxis = chartGroup.append("g")
    .classed("axisText", true)
    .call(leftAxis);

  // create a tooltip
  var Tooltip = d3.select("#bar")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "4px")
    .style("padding", "4px")

  // Two functions that change the tooltip when user hover / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1) // makes tooltip show
      .style("left", (parseInt(d3.select(this).attr("x")) + 105) + "px")
      .style("top",  (parseInt(d3.select(this).attr("y")) + 230) + "px")
      .html(`Race: ${d.race}<br>Incidents: ${d.count}`)
    d3.select(this)
      .style("stroke", "black")
      .style("fill", "#FFDA87")  
    console.log((parseInt(d3.select(this).attr("x"))) + "px");
    console.log((parseInt(d3.select(this).attr("y"))) + "px");
  }

  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("fill", "#C3073F")  
  }
 // Create one rectangle group - linear and band scales to position each rect in the chart
  var rectangleGroup = chartGroup.selectAll("rect")
    .data(allRaces)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", d => xBandScale(d.race))
      .attr("y", d => yLinearScale(d.count))
      .attr("width", xBandScale.bandwidth())
      .attr("height", d => height - yLinearScale(d.count))
      .attr("fill", "#c3073F")
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave);

  // Create x axis labels
  var xLabelGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`);  
  var raceLabel = xLabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "race") // value to grab for event listener
    .classed("active", true)
    .text("Shooter Race");
  var agebinLabel = xLabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "agebin") // value to grab for event listener 
    .classed("inactive", true)
    .text("Shooter Age");

  // Create y axis label
  var yLabelGroup = chartGroup.append("g")
  var countLabel = yLabelGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.right)
    .attr("value", "count")
    .classed("active", true)
    .text("Number of Incidents");
  var victimsLabel = yLabelGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.right - 20)
    .attr("value", "total_vic")
    .classed("inactive", true)
    .text("Number of Victims");
  
  $("#sortd").click(function(){
    console.log("Descending");
    console.log(chosenXAxis, chosenYAxis);
    if (chosenXAxis == "race") {
      allRaces.sort(({[chosenYAxis]:a}, {[chosenYAxis]:b}) => b-a);
      console.log(allRaces);
      // update xScale and axis
      xBandScale = xScale(allRaces, chosenXAxis);
      xAxis = renderXaxis(xBandScale, xAxis);
      yLinearScale = yScale(allRaces, chosenYAxis);
      yAxis = renderYaxis(yLinearScale, yAxis);
      // update rectangles with new x values
      rectangleGroup = renderRect(allRaces, xBandScale, chosenXAxis, yLinearScale, chosenYAxis);
    }
    if (chosenXAxis == "agebin") {
      allAges.sort(({[chosenYAxis]:a}, {[chosenYAxis]:b}) => b-a);
      console.log(allAges);
      // update xScale and axis
      xBandScale = xScale(allAges, chosenXAxis);
      xAxis = renderXaxis(xBandScale, xAxis);
      yLinearScale = yScale(allAges, chosenYAxis);
      yAxis = renderYaxis(yLinearScale, yAxis);
      // update rectangles with new x values
      rectangleGroup = renderRect(allAges, xBandScale, chosenXAxis, yLinearScale, chosenYAxis);
    }
  });

  $("#sorta").click(function(){
    console.log("Ascending");
    console.log(chosenXAxis, chosenYAxis);  
    if (chosenXAxis == "race") {
      allRaces.sort(({[chosenYAxis]:a}, {[chosenYAxis]:b}) => a-b);
      console.log(allRaces);
      // update xScale and axis
      xBandScale = xScale(allRaces, chosenXAxis);
      xAxis = renderXaxis(xBandScale, xAxis);
      yLinearScale = yScale(allRaces, chosenYAxis);
      yAxis = renderYaxis(yLinearScale, yAxis);
      // update rectangles with new x values
      rectangleGroup = renderRect(allRaces, xBandScale, chosenXAxis, yLinearScale, chosenYAxis);
    }
    if (chosenXAxis == "agebin") {
      allAges.sort(({[chosenYAxis]:a}, {[chosenYAxis]:b}) => a-b);
      console.log(allAges);
      // update xScale and axis
      xBandScale = xScale(allAges, chosenXAxis);
      xAxis = renderXaxis(xBandScale, xAxis);
      yLinearScale = yScale(allAges, chosenYAxis);
      yAxis = renderYaxis(yLinearScale, yAxis);
      // update rectangles with new x values
      rectangleGroup = renderRect(allAges, xBandScale, chosenXAxis, yLinearScale, chosenYAxis);
    }
  });

  // x axis event listener
  xLabelGroup.selectAll("text").on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
      chosenXAxis = value;
      console.log(`Chosen x: ${chosenXAxis}`);
      if (chosenXAxis == "race") {
        // update xScale and axis
        xBandScale = xScale(allRaces, chosenXAxis);
        xAxis = renderXaxis(xBandScale, xAxis);
        yLinearScale = yScale(allRaces, chosenYAxis);
        yAxis = renderYaxis(yLinearScale, yAxis);
        // update rectangles with new x values
        rectangleGroup = renderRect(allRaces, xBandScale, chosenXAxis, yLinearScale, chosenYAxis);
        if (chosenYAxis == "count") {
          $("#title").text("Number of Incidents by Shooter Race");
        }
        else {
          $("#title").text("Total Victims by Shooter Race");
        }
      }
      if (chosenXAxis == "agebin") {
        // update xScale and axis
        xBandScale = xScale(allAges, chosenXAxis);
        xAxis = renderXaxis(xBandScale, xAxis);
        yLinearScale = yScale(allAges, chosenYAxis);
        yAxis = renderYaxis(yLinearScale, yAxis);
        // update rectangles with new x values
        rectangleGroup = renderRect(allAges, xBandScale, chosenXAxis, yLinearScale, chosenYAxis);
        if (chosenYAxis == "count") {
          $("#title").text("Number of Incidents by Shooter Age Group");
        }
        else {
          $("#title").text("Total Victims by Shooter Age Group");
        }
      }
    }
    // changes x-axis classes to bold text
    if (chosenXAxis === "agebin") {
      agebinLabel
        .classed("active", true)
        .classed("inactive", false);
      raceLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    if (chosenXAxis === "race") {
      raceLabel
        .classed("active", true)
        .classed("inactive", false);
      agebinLabel
        .classed("active", false)
        .classed("inactive", true);
    }
  }); // End xLabelGroup
  // y axis event listener
  yLabelGroup.selectAll("text").on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
      chosenYAxis = value;
      console.log(`Chosen y: ${chosenYAxis}`);
      if (chosenXAxis == "race") {
        // update xScale and axis
        xBandScale = xScale(allRaces, chosenXAxis);
        xAxis = renderXaxis(xBandScale, xAxis);
        yLinearScale = yScale(allRaces, chosenYAxis);
        yAxis = renderYaxis(yLinearScale, yAxis);
        // update rectangles with new x values
        rectangleGroup = renderRect(allRaces, xBandScale, chosenXAxis, yLinearScale, chosenYAxis);
        if (chosenYAxis == "count") {
          $("#title").text("Number of Incidents by Shooter Race");
        }
        else {
          $("#title").text("Total Victims by Shooter Race");
        }
      }
      if (chosenXAxis == "agebin") {
        // update xScale and axis
        xBandScale = xScale(allAges, chosenXAxis);
        xAxis = renderXaxis(xBandScale, xAxis);
        yLinearScale = yScale(allAges, chosenYAxis);
        yAxis = renderYaxis(yLinearScale, yAxis);
        // update rectangles with new x values
        rectangleGroup = renderRect(allAges, xBandScale, chosenXAxis, yLinearScale, chosenYAxis);
        if (chosenYAxis == "count") {
          $("#title").text("Number of Incidents by Shooter Age Group");
        }
        else {
          $("#title").text("Total Victims by Shooter Age Group");
        }
      }
    }   
    // changes x-axis classes to bold text
    if (chosenYAxis === "total_vic") {
      victimsLabel
        .classed("active", true)
        .classed("inactive", false);
      countLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    if (chosenYAxis === "count") {
      countLabel
        .classed("active", true)
        .classed("inactive", false);
      victimsLabel
        .classed("active", false)
        .classed("inactive", true);
    }
  }); // End yLabelGroup
}); // End d3.json