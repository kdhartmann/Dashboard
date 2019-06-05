async function renderFatalityType(){
  const data = await d3.json("fatality_type");

    data.forEach(function(d) {
      d.Fatal_Casualty_Type = +d.Fatal_Casualty_Type;
      d.Count = +d.Count;
  });
  

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;


  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
  .rangeRound([0, width])
  .padding(0.1);

  var y = d3.scaleLinear()
  .rangeRound([height, 0]);
 
  x.domain(d3.extent(data.map(d => d.Fatal_Casualty_Type)));
  y.domain([0, d3.max(data.map(d => d.Count))]);

  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

  svg.append("g")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Count");

  svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function (d) {
    return x(d.Fatal_Casualty_Type);
  })
  .attr("y", function (d) {
    return y(Number(d.Count));
  })
  .attr("width", x.bandwidth())
  .attr("height", function (d) {
    return height - y(Number(d.Count));
  });

  svg.append("text")
    .attr("transform", "translate("+(0)+","+y(1550)+")")
    .attr("dy", ".35em")
    .attr("font-size", "15px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Count of Fatal Casualty Type");
}
renderFatalityType()