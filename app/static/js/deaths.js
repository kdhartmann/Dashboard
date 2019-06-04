console.log("Hello Death")

// Method 1
d3.json("hourly_data").then(data => {
    // console.log(data)
  }
)

// Method 2
async function renderHourly(){

  const data = await d3.json("hourly_data");

  console.log(data);

  console.log(typeof(data))

  data.forEach(function(d) {
    d.Hour_of_Accident = +d.Hour_of_Accident;
    d.Total_Number_of_Casualties = +d.Total_Number_of_Casualties;
    d.Fatal_Casualties = +d.Fatal_Casualties;
  });

  console.log(data)

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var valueline = d3.line()
    .x(function(d) { return x(d.Hour_of_Accident); })
    .y(function(d) { return y(d.Total_Number_of_Casualties); });

  var valueline2 = d3.line()
    .x(function(d) { return x(d.Hour_of_Accident); })
    .y(function(d) { return y(d.Fatal_Casualties); });

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data.map(d => d.Hour_of_Accident)));
  y.domain([0, d3.max(data.map(d => d.Total_Number_of_Casualties))]);

  // Add the valueline path.
  svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);
  // Add the valueline path.
  svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline2);  
  // Add the X Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
    .call(d3.axisLeft(y));

}

renderHourly()