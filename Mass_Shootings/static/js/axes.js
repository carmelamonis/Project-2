function a() {  
  $('acontent').empty();

  // Define svg width and height
  var svgWidth = 1000;
  var svgHeight = 700;

  // Set margins for scatter
  var margin = { top: 20, right: 40, bottom: 90, left: 100 };
  
  // Define scatter width and height (svg area - margins)
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append SVG that holds the chart
  // https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b
  var svg = d3.select("acontent")
    .append("svg")
    //.attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // Append the scatter group and shift the group by left and top margins
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("class", "barchart")
    
  d3.json("/api/mass_shootings").then((massData, err) => {
    if (err) throw err;
      console.log(massData);
    
      // Get race incidences count
    var allRaces = [];
    var eachRace = {};

    var races = massData.map(d => d.race);
    console.log(races);

    eachRace = eachRace["White"] = races.filter((v) => (v === "White")).length;
    allRaces.push(eachRace);
    eachRace = eachRace["Black"] = races.filter((v) => (v === "Black")).length;
    allRaces.push(eachRace);

    eachRace["Latino"] = races.filter((v) => (v === "Latino")).length;
    eachRace["Native American"] = races.filter((v) => (v === "Native American")).length;
    eachRace["Asian"] = races.filter((v) => (v === "Asian")).length;
    eachRace["Other"] = races.filter((v) => (v === "Other")).length;
    eachRace["Unknown"] = races.filter((v) => (v === "Unknown")).length;
    eachRace["Unclear"] = races.filter((v) => (v === "Unclear")).length;

    // allRaces.push(races.filter((v) => (v === "White")).length);
    // allRaces.push(races.filter((v) => (v === "Black")).length);
    // allRaces.push(races.filter((v) => (v === "Latino")).length);
    // allRaces.push(races.filter((v) => (v === "Native American")).length);
    // allRaces.push(races.filter((v) => (v === "Asian")).length);
    // allRaces.push(races.filter((v) => (v === "Other")).length);
    // allRaces.push(races.filter((v) => (v === "Unknown")).length);
    // allRaces.push(races.filter((v) => (v === "Unknown")).length);

    // allRaces["White"] = races.filter((v) => (v === "White")).length;
    // allRaces["Black"] = races.filter((v) => (v === "Black")).length;
    // allRaces["Latino"] = races.filter((v) => (v === "Latino")).length;
    // allRaces["Native American"] = races.filter((v) => (v === "Native American")).length;
    // allRaces["Asian"] = races.filter((v) => (v === "Asian")).length;
    // allRaces["Other"] = races.filter((v) => (v === "Other")).length;
    // allRaces["Unknown"] = races.filter((v) => (v === "Unknown")).length;
    // allRaces["Unclear"] = races.filter((v) => (v === "Unknown")).length;
    
    console.log(allRaces);

    // console.log(Object.keys(allRaces));
    // console.log(Object.values(allRaces));
    
    // Create x axis scale with padding
    var xBandScale = d3.scaleBand()
    .domain(allRaces.map(d => d.keys()))
    .range([0, width])
    .padding(0.1);

    // Create a linear scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(allRaces, d => d.values())])
    .range([height, 0]);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xBandScale);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g")
      .call(leftAxis);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // Create one SVG rectangle per piece of tvData
    // Use the linear and band scales to position each rectangle within the chart
    chartGroup.select(".barchart").selectAll("rect")
      .data(allRaces)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xBandScale(d))
      .attr("y", d => yLinearScale(d))
      .attr("width", xBandScale.bandwidth())
      .attr("height", d => height - yLinearScale(d));
    
  });
} 

function b() {
        $('bcontent').empty();
        d3.select('bcontent')
            .append('p')
            .text("This is B test")
} 

