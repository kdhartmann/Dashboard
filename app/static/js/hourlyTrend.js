async function renderHourly(){

  const data = await d3.json("hourlyTrendData");

  data.forEach( d => {
    d.hour = +d.hour;
    d.totalCasualties = +d.totalCasualties;
    d.fatalCasualties = +d.fatalCasualties;

  });

  const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  let lineCasualties = d3.line()
    .x(d => {return x(d.hour); })
    .y(d => {return y(d.totalCasualties); });

  let lineFatalities = d3.line()
    .x(d => {return x(d.hour); })
    .y(d => {return y(d.fatalCasualties); });

  let svgHourly = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

  x.domain(d3.extent(data.map(d => d.hour)));
  y.domain([0, d3.max(data.map(d => d.totalCasualties))]);

  const tooltip = d3.select("body").append("div").attr("class", "toolTip");

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
      .attr("cx", d => {return x(d.hour); })
      .attr("cy", d => {return y(d.totalCasualties); })
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
      .attr("cx", d => { return x(d.hour) })
      .attr("cy", d => { return y(d.fatalCasualties) })
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
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svgHourly.append("g")
    .call(d3.axisLeft(y));
  
  // lineCasualties Label
  svgHourly.append("text")
    .attr("transform", `translate(${width-70}, ${y(875)})`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Total Casualties");
  
  // lineFatalities Label
  svgHourly.append("text")
    .attr("transform", `translate(${(width-60)}, ${y(500)})`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Total Fatalities");

  // Title
  svgHourly.append("text")
    .attr("transform", `translate(${(0)}, ${y(1100)})`)
    .attr("dy", ".35em")
    .attr("font-size", "15px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Total Number of Casualties and Fatalities by Hour of Day");

  // X-Axis Label
  svgHourly.append("text")
    .attr("transform", `translate(${(175)}, ${y(-120)})`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Hour of Day");

}

renderHourly()



