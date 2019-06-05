async function renderMonthly(){

  const data = await d3.json("monthly_data");

  data.forEach(function(d) {
    d.Month = +d.Month;
    d.Total_Number_of_Casualties = +d.Total_Number_of_Casualties;
    d.Fatal_Casualties = +d.Fatal_Casualties;

  });

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var valueline = d3.line()
    .x(function(d) { return x(d.Month); })
    .y(function(d) { return y(d.Total_Number_of_Casualties); });

  var valueline2 = d3.line()
    .x(function(d) { return x(d.Month); })
    .y(function(d) { return y(d.Fatal_Casualties); });

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data.map(d => d.Month)));
  y.domain([0, d3.max(data.map(d => d.Total_Number_of_Casualties))]);

  // Add the valueline path.
  svg.append("path")
    .data([data])
    .style("fill", "none")
    .style("stroke", "steelblue")
    .attr("class", "line")
    .attr("d", valueline);
  // Add the valueline path.
  svg.append("path")
    .data([data])
    .style("fill", "none")
    .style("stroke", "red")
    .attr("class", "line")
    .attr("d", valueline2); 
  
  // Add the X Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("transform", "translate("+(width-70)+","+y(1500)+")")
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Total Casualties");

  svg.append("text")
    .attr("transform", "translate("+(width-60)+","+y(875)+")")
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Total Fatalities");

  svg.append("text")
    .attr("transform", "translate("+(0)+","+y(1550)+")")
    .attr("dy", ".35em")
    .attr("font-size", "15px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Total Number of Casualties and Fatalities by Month");

  svg.append("text")
    .attr("transform", "translate("+(200)+","+y(-175)+")")
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Month");
}

renderMonthly()