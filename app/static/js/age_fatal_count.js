const buttons = d3.selectAll('input');
let selection;
buttons.on('change', function(d) {
  selection = this.value;
  console.log('button changed to ' + this.value);
});



async function renderAgeFatalCount(){

  const data = await d3.json("age_fatal_count");

  data.forEach(function(d) {
    d.Fatal_Casualty_Age = +d.Fatal_Casualty_Age;
    d.Count = +d.Count;

  });

  var margin = {top: 20, right: 20, bottom: 60, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(.1);
  //https://d3-wiki.readthedocs.io/zh_CN/master/Ordinal-Scales/
  //var x = d3.scale.ordinal().domain(data.map(d => d.Fatal_Casualty_Type)).rangeRoundBands([0, width]);
  //var x = d3.scale.ordinal().rangeRoundBands([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  x.domain(data.map(d => d.Fatal_Casualty_Age));
  y.domain([0, d3.max(data.map(d => d.Count))]);
  //x.domain(data.map(function(d) {return d.Fatal_Casualty_Type; }));
  //y.domain([0, d3.max(data, function(d){return d.Count;} )]);

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  // [data] doesn't allow any bars to show up
  svg.selectAll("bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {return x(d.Fatal_Casualty_Age);})
      .attr("y", function (d) {return y(d.Count);})
      .attr("width", x.bandwidth())
      .attr("height", function (d) {return height - y(d.Count);})
      .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("Age: " + (d.Fatal_Casualty_Age) + "<br>Count: " + (d.Count));})
      .on("mouseout", function(d){ tooltip.style("display", "none");});

  // Add the X Axis
  svg.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", "translate(0," + height  + ")")
    .call(d3.axisBottom(x)
          .tickValues([0,10,20,30,40,50,60,70,80,90]))
    .selectAll(".tick text")
      .style("font-size", "9px");

  // Add the Y Axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // title
  svg.append("text")
    .attr("transform", "translate("+(0)+","+y(350)+")")
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Fatal Casualty Count by Age");

}
renderAgeFatalCount()