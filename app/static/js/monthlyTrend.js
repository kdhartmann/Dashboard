async function renderMonthly(){

  const data = await d3.json("monthlyTrendData");

  data.forEach( d => {
    d.month = +d.month;
    d.totalCasualties = +d.totalCasualties;
    d.fatalCasualties = +d.fatalCasualties;

  });

  const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]); 

  x.domain(d3.extent(data.map(d => d.month)));
  y.domain([0, d3.max(data.map(d => d.totalCasualties))]);

  let lineCasualties = d3.line()
    .x(d => {return x(d.month); })
    .y(d => {return y(d.totalCasualties); });

  let lineFatalities = d3.line()
    .x(d => {return x(d.month); })
    .y(d => {return y(d.fatalCasualties); });

  let svgMonthly = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

  var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  // Add the valueline path.
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
      .attr("cx", d => {return x(d.month) })
      .attr("cy", d => {return y(d.totalCasualties) })
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
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dotFatalities") // Assign a class for styling
      .attr("cx", d => {return x(d.month) })
      .attr("cy", d => {return y(d.fatalCasualties) })
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
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svgMonthly.append("g")
    .call(d3.axisLeft(y));
  
  // lineCasualties Label
  svgMonthly.append("text")
    .attr("transform", `translate(${width-70},${y(1500)})`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Total Casualties");

  // lineFatalities Label
  svgMonthly.append("text")
    .attr("transform", `translate(${width-60},${y(875)})`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Total Fatalities");
  
  // Title
  svgMonthly.append("text")
    .attr("transform", `translate(${0},${y(1550)})`)
    .attr("dy", ".35em")
    .attr("font-size", "15px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Total Number of Casualties and Fatalities by Month");

  // X-Axis Label
  svgMonthly.append("text")
    .attr("transform", `translate(${200},${y(-175)})`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Month");
}

renderMonthly()