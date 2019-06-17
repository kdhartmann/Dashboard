// Constants
const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;
const tooltip = d3.select("body").append("div").attr("class", "toolTip");
const tooltipLeftPadding = 50;
const tooltipTopPadding = 70;
// line labels
const lineCasualtiesLabel = "Total Casualties";
const lineFatalitiesLabel = "Total Fatalities";
// X position of line labels
const lineCasualtiesLabelX = width-57;
const lineFatalitiesLabelX = width-50;
//Y position for the line labels 
const lineCasualtiesLabelHourlyY = 35;
const lineFatalitiesLabelHourlyY = 105;
const lineCasualtiesLabelMonthlyY = 0;
const lineFatalitiesLabelMonthlyY = 80;
// plot titles
const svgHourlyTitle = "Total Number of Casualties and Fatalities by Hour of Day";
const svgMonthlyTitle = "Total Number of Casualties and Fatalities by Month";
// Y position of titles
const svgHourlyTitleY = -10;
const svgMonthlyTitleY = -10;
// X-axis labels
const svgHourlyXLabel = "Hour of Day";
const svgMonthlyXLabel = "Month";
// X Position of x-axis labels
const xLabelX = .5*width;
// Y Position of x-axis labels
const svgHourlyXLabelY = height+23;
const svgMonthlyXLabelY = height+23;
// radius of dots on lines
const circleRadius = 3;

// svgHourly
const xHourly = d3.scaleLinear().range([0, width]);
const yHourly = d3.scaleLinear().range([height, 0]);

let svgHourly = d3.select("#hourly")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

// svgMonthly
const xMonthly = d3.scaleLinear().range([0, width]);
const yMonthly = d3.scaleLinear().range([height, 0]); 

let svgMonthly = d3.select("#monthly")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

//// Render Plots 
renderTrendPlots()

// Render Hourly Plot 
async function renderTrendPlots(){

  const dataHourly = await d3.json("hourlyTrendData");
  const dataMonthly = await d3.json("monthlyTrendData");

  dataHourly.forEach( d => {
    d.hour = +d.hour;
    d.totalCasualties = +d.totalCasualties;
    d.fatalCasualties = +d.fatalCasualties;

  });

  dataMonthly.forEach( d => {
    d.month = +d.month;
    d.totalCasualties = +d.totalCasualties;
    d.fatalCasualties = +d.fatalCasualties;

  });

  // set domain 
  xHourly.domain(d3.extent(dataHourly.map(d => d.hour)));
  yHourly.domain([0, d3.max(dataHourly.map(d => d.totalCasualties))]);

  xMonthly.domain(d3.extent(dataMonthly.map(d => d.month)));
  yMonthly.domain([0, d3.max(dataMonthly.map(d => d.totalCasualties))]);

  // create the lines 
  let lineCasualtiesHourly = d3.line()
    .x(d => {return xHourly(d.hour); })
    .y(d => {return yHourly(d.totalCasualties); });

  let lineFatalitiesHourly = d3.line()
    .x(d => {return xHourly(d.hour); })
    .y(d => {return yHourly(d.fatalCasualties); });

  let lineCasualtiesMonthly = d3.line()
    .x(d => {return xMonthly(d.month); })
    .y(d => {return yMonthly(d.totalCasualties); });

  let lineFatalitiesMonthly = d3.line()
    .x(d => {return xMonthly(d.month); })
    .y(d => {return yMonthly(d.fatalCasualties); });

  // Calls a function that adds the line paths, axes, labels, and title
  addPathsAxesLabels(dataHourly, svgHourly, lineCasualtiesHourly, lineFatalitiesHourly, xHourly, yHourly, lineCasualtiesLabelHourlyY, lineFatalitiesLabelHourlyY, svgHourlyTitleY, svgHourlyTitle, svgHourlyXLabelY, svgHourlyXLabel);
  addPathsAxesLabels(dataMonthly, svgMonthly, lineCasualtiesMonthly, lineFatalitiesMonthly, xMonthly, yMonthly, lineCasualtiesLabelMonthlyY, lineFatalitiesLabelMonthlyY, svgMonthlyTitleY, svgMonthlyTitle, svgMonthlyXLabelY, svgMonthlyXLabel);
  
  // Dots for lineCasualties
  svgHourly.selectAll(".dotCasualties")
    .data(dataHourly)
    .enter().append("circle")
      .attr("class", "dotCasualties")
      .attr("cx", d => {return xHourly(d.hour); })
      .attr("cy", d => {return yHourly(d.totalCasualties); })
      .attr("r", circleRadius)
      .on("mousemove", d => {
        tooltip
          .style("left", d3.event.pageX - tooltipLeftPadding + "px")
          .style("top", d3.event.pageY - tooltipTopPadding + "px")
          .style("display", "inline-block")
          .html(`Hour: ${d.hour} <br>Casualties: ${d.totalCasualties}`);})
      .on("mouseout", d => { tooltip.style("display", "none");});

  svgMonthly.selectAll(".dotCasualties")
    .data(dataMonthly)
    .enter().append("circle")
      .attr("class", "dotCasualties")
      .attr("cx", d => {return xMonthly(d.month) })
      .attr("cy", d => {return yMonthly(d.totalCasualties) })
      .attr("r", circleRadius)
      .on("mousemove", d => {
        tooltip
          .style("left", d3.event.pageX - tooltipLeftPadding + "px")
          .style("top", d3.event.pageY - tooltipTopPadding + "px")
          .style("display", "inline-block")
          .html(`Month: ${d.month} <br>Casualties: ${d.totalCasualties}`);})
      .on("mouseout", d => {tooltip.style("display", "none");});
  
  // Dots for lineFatalities
  svgHourly.selectAll(".dotFatalities")
    .data(dataHourly)
    .enter().append("circle")
      .attr("class", "dotFatalities")
      .attr("cx", d => { return xHourly(d.hour) })
      .attr("cy", d => { return yHourly(d.fatalCasualties) })
      .attr("r", circleRadius)
      .on("mousemove", d => {
        tooltip
          .style("left", d3.event.pageX - tooltipLeftPadding + "px")
          .style("top", d3.event.pageY - tooltipTopPadding + "px")
          .style("display", "inline-block")
          .html(`Hour: ${d.hour} <br>Fatalities: ${d.fatalCasualties}`);})
      .on("mouseout", d => { tooltip.style("display", "none");}); 

  svgMonthly.selectAll(".dotFatalities")
    .data(dataMonthly)
    .enter().append("circle") 
      .attr("class", "dotFatalities") 
      .attr("cx", d => {return xMonthly(d.month) })
      .attr("cy", d => {return yMonthly(d.fatalCasualties) })
      .attr("r", circleRadius)
      .on("mousemove", d => {
        tooltip
          .style("left", d3.event.pageX - tooltipLeftPadding + "px")
          .style("top", d3.event.pageY - tooltipTopPadding + "px")
          .style("display", "inline-block")
          .html(`Month: ${d.month} <br>Fatalities: ${d.fatalCasualties}`);})
      .on("mouseout", d => {tooltip.style("display", "none");}); 

}

function addPathsAxesLabels(data, svg, lineCasualties, lineFatalities, xScale, yScale, lineCasualtiesLabelY, lineFatalitiesLabelY, svgTitleY, svgTitle, svgXLabelY, svgXLabel){
  // Add the lineCasualties path
  svg.append("path")
    .data([data])
    .style("fill", "none")
    .style("stroke", "steelblue")
    .attr("class", "line")
    .attr("d", lineCasualties);

  // Add the lineFatalities path
  svg.append("path")
    .data([data])
    .style("fill", "none")
    .style("stroke", "red")
    .attr("class", "line")
    .attr("d", lineFatalities);

  // Add the X-Axis
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add the Y-Axis
  svg.append("g")
    .call(d3.axisLeft(yScale));

  // Add the lineCasualties label
  svg.append("text")
    .attr("class", "lineCasualtiesLabel")
    .attr("transform", `translate(${lineCasualtiesLabelX}, ${lineCasualtiesLabelY})`)
    .attr("dy", ".35em")
    .text(lineCasualtiesLabel);

  // Add the lineFatalities label
  svg.append("text")
    .attr("class", "lineFatalitiesLabel")
    .attr("transform", `translate(${lineFatalitiesLabelX}, ${lineFatalitiesLabelY})`)
    .attr("dy", ".35em")
    .text(lineFatalitiesLabel);

  // Add the title
  svg.append("text")
    .attr("class", "title")
    .attr("transform", `translate(0, ${svgTitleY})`)
    .attr("dy", ".35em")
    .text(svgTitle);

  // Add the X-Axis label
  svg.append("text")
    .attr("class", "xAxisLabel")
    .attr("transform", `translate(${xLabelX}, ${svgXLabelY})`)
    .attr("dy", ".35em")
    .text(svgXLabel);

};