const tooltip = d3.select("body").append("div").attr("class", "toolTip");

//// svgHourly

const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

const xHourly = d3.scaleLinear().range([0, width]);
const yHourly = d3.scaleLinear().range([height, 0]);

let svgHourly = d3.select("#hourly")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

//// svgMonthly

const xMonthly = d3.scaleLinear().range([0, width]);
const yMonthly = d3.scaleLinear().range([height, 0]); 

let svgMonthly = d3.select("#monthly")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

//// Render Plots 
renderHourly()
renderMonthly()

// Render Hourly Plot 
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
      .attr("r", 3)
      .on("mousemove", d => {
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
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
      .attr("r", 3)
      .on("mousemove", d => {
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
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
    .attr("transform", `translate(${width-57}, ${yHourly(860)})`)
    .attr("dy", ".35em")
    .text("Total Casualties");
  
  // lineFatalities Label
  svgHourly.append("text")
    .attr("class", "lineFatalitiesLabel")
    .attr("transform", `translate(${(width-50)}, ${yHourly(480)})`)
    .attr("dy", ".35em")
    .text("Total Fatalities");

  // Title
  svgHourly.append("text")
    .attr("class", "title")
    .attr("transform", `translate(${(0)}, ${yHourly(1100)})`)
    .attr("dy", ".35em")
    .text("Total Number of Casualties and Fatalities by Hour of Day");

  // X-Axis Label
  svgHourly.append("text")
    .attr("class", "xAxisLabel")
    .attr("transform", `translate(${(.5*width)}, ${yHourly(-120)})`)
    .attr("dy", ".35em")
    .text("Hour of Day");

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
      .attr("r", 3)
      .on("mousemove", d => {
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
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
      .attr("r", 3)
      .on("mousemove", d => {
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
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
    .attr("transform", `translate(${width-57},${yMonthly(1450)})`)
    .attr("dy", ".35em")
    .text("Total Casualties");

  // lineFatalities Label
  svgMonthly.append("text")
    .attr("class", "lineFatalitiesLabel")
    .attr("transform", `translate(${width-50},${yMonthly(860)})`)
    .attr("dy", ".35em")
    .text("Total Fatalities");
  
  // Title
  svgMonthly.append("text")
    .attr("class", "title")
    .attr("transform", `translate(${0},${yMonthly(1550)})`)
    .attr("dy", ".35em")
    .text("Total Number of Casualties and Fatalities by Month");

  // X-Axis Label
  svgMonthly.append("text")
    .attr("class", "xAxisLabel")
    .attr("transform", `translate(${.5*width},${yMonthly(-175)})`)
    .attr("dy", ".35em")
    .text("Month");
}

