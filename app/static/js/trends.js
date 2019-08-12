// Constants
const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
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
// const lineCasualtiesLabelHourlyY = 35;
// const lineFatalitiesLabelHourlyY = 105;
// const lineCasualtiesLabelMonthlyY = 0;
// const lineFatalitiesLabelMonthlyY = 80;
const lineCasualtiesLabelHourlyY = 45;
const lineFatalitiesLabelHourlyY = 135;
const lineCasualtiesLabelMonthlyY = 0;
const lineFatalitiesLabelMonthlyY = 100;
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

// Render Plots 
renderTrendPlots()

function renderTrendPlots(){
  renderHourly();
  renderMonthly();

};

async function renderHourly(){

  const data = await d3.json("hourlyTrendData");

  data.forEach( d => {
    d.hour = +d.hour;
    d.totalCasualties = +d.totalCasualties;
    d.fatalCasualties = +d.fatalCasualties;

  });
  
  // create the lines 
  let lineCasualties = d3.line()
    .x(d => {return xHourly(d.hour); })
    .y(d => {return yHourly(d.totalCasualties); });

  let lineFatalities = d3.line()
    .x(d => {return xHourly(d.hour); })
    .y(d => {return yHourly(d.fatalCasualties); });

  // set domain 
  xHourly.domain(d3.extent(data.map(d => d.hour)));
  yHourly.domain([0, d3.max(data.map(d => d.totalCasualties))]);

  // Add the lineCasualties path
  svgHourly.append("path")
    .data([data])
    .style("fill", "none")
    .style("stroke", "steelblue")
    .attr("class", "line")
    .attr("d", lineCasualties);
  
  // Dots for lineCasualties
  svgHourly.selectAll(".dotCasualties")
    .data(data)
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

  // Add the lineFatalities path
  svgHourly.append("path")
    .data([data])
    .style("fill", "none")
    .style("stroke", "red")
    .attr("class", "line")
    .attr("d", lineFatalities);
  
  // Dots for lineFatalities
  svgHourly.selectAll(".dotFatalities")
    .data(data)
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
  
  // Add the X Axis
  svgHourly.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xHourly));

  // Add the Y Axis
  svgHourly.append("g")
    .call(d3.axisLeft(yHourly));
  
  // lineCasualties Label
  svgHourly.append("text")
    .attr("class", "lineCasualtiesLabel")
    .attr("transform", `translate(${lineCasualtiesLabelX}, ${lineCasualtiesLabelHourlyY})`)
    .attr("dy", ".35em")
    .text(lineCasualtiesLabel);
  
  // lineFatalities Label
  svgHourly.append("text")
    .attr("class", "lineFatalitiesLabel")
    .attr("transform", `translate(${lineFatalitiesLabelX}, ${lineFatalitiesLabelHourlyY})`)
    .attr("dy", ".35em")
    .text(lineFatalitiesLabel);

  // Title
  svgHourly.append("text")
    .attr("class", "title")
    .attr("transform", `translate(0, ${svgHourlyTitleY})`)
    .attr("dy", ".35em")
    .text(svgHourlyTitle);

  // X-Axis Label
  svgHourly.append("text")
    .attr("class", "xAxisLabel")
    .attr("transform", `translate(${xLabelX}, ${svgHourlyXLabelY})`)
    .attr("dy", ".35em")
    .text(svgHourlyXLabel);

}


// Render Monthly Plot
async function renderMonthly(){

  const data = await d3.json("monthlyTrendData");

  data.forEach( d => {
    d.month = +d.month;
    d.totalCasualties = +d.totalCasualties;
    d.fatalCasualties = +d.fatalCasualties;

  });

  // Set the domains
  xMonthly.domain(d3.extent(data.map(d => d.month)));
  yMonthly.domain([0, d3.max(data.map(d => d.totalCasualties))]);
  
  // create the lines 
  let lineCasualties = d3.line()
    .x(d => {return xMonthly(d.month); })
    .y(d => {return yMonthly(d.totalCasualties); });

  let lineFatalities = d3.line()
    .x(d => {return xMonthly(d.month); })
    .y(d => {return yMonthly(d.fatalCasualties); });

  // Add the lineCasualties path
  svgMonthly.append("path")
    .data([data])
    .style("fill", "none")
    .style("stroke", "steelblue")
    .attr("class", "line")
    .attr("d", lineCasualties);
  
  // Dots for lineCasualties
  svgMonthly.selectAll(".dotCasualties")
    .data(data)
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

  // Add the lineFatalities path
  svgMonthly.append("path")
    .data([data])
    .style("fill", "none")
    .style("stroke", "red")
    .attr("class", "line")
    .attr("d", lineFatalities); 
  
  // Dots for lineFatalities
  svgMonthly.selectAll(".dotFatalities")
    .data(data)
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
  
  // Add the X Axis
  svgMonthly.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xMonthly));

  // Add the Y Axis
  svgMonthly.append("g")
    .call(d3.axisLeft(yMonthly));
  
  // lineCasualties Label
  svgMonthly.append("text")
    .attr("class", "lineCasualtiesLabel")
    .attr("transform", `translate(${lineCasualtiesLabelX},${lineCasualtiesLabelMonthlyY})`)
    .attr("dy", ".35em")
    .text(lineCasualtiesLabel);

  // lineFatalities Label
  svgMonthly.append("text")
    .attr("class", "lineFatalitiesLabel")
    .attr("transform", `translate(${lineFatalitiesLabelX},${lineFatalitiesLabelMonthlyY})`)
    .attr("dy", ".35em")
    .text(lineFatalitiesLabel);
  
  // Title
  svgMonthly.append("text")
    .attr("class", "title")
    .attr("transform", `translate(0,${svgMonthlyTitleY})`)
    .attr("dy", ".35em")
    .text(svgMonthlyTitle);

  // X-Axis Label
  svgMonthly.append("text")
    .attr("class", "xAxisLabel")
    .attr("transform", `translate(${xLabelX},${svgMonthlyXLabelY})`)
    .attr("dy", ".35em")
    .text(svgMonthlyXLabel);
}
