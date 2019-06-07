async function renderFatalTypeByAge(){

  const data = await d3.json("fatality_type_by_age");

  data.forEach(function(d) {
    d.Fatal_Casualty_Age = +d.Fatal_Casualty_Age;
    d.Fatal_Casualty_Type = d.Fatal_Casualty_Type;

  });

  var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  //reference from other script. Have to flip for this one 
  //var x = d3.scaleBand().rangeRound([0, width]).padding(.1);
  //var y = d3.scaleLinear().rangeRound([height, 0]);
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scalePoint().rangeRound([height, 0]);
  

  //reference
  //x.domain(data.map(d => d.Fatal_Casualty_Type));
  //y.domain([0, d3.max(data.map(d => d.Count))]);
  //x.domain(d3.extent(data.map(d => d.Hour_of_Accident)));
  x.domain(d3.extent(data.map(d => d.Fatal_Casualty_Age)));
  y.domain(data.map(d => d.Fatal_Casualty_Type));
  //y.domain(d3.extent(data.map(d => d.Fatal_Casualty_Type)));
  //y.domain([0, d3.max(data.map(d => d.Fatal_Casualty_Type))]);

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var tooltip = d3.select("body").append("div").attr("class", "toolTip");


  svg.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", "translate(0," + (height ) + ")")
    .call(d3.axisBottom(x))
    .selectAll(".tick text")
      .style("font-size", "9px");

  svg.append("g")
    .attr("class", "xaxis axis")
    .call(d3.axisLeft(y))
    .selectAll(".tick text")
       .style("font-size", "8px")
       .call(wrap, 50);
  
  var cValue = function(d) { 
    if (d==="Van Driver"){
      color = "green";
    } else if (d==="Van Passenger"){
      color = "red";
    }else if (d==="Pedestrian"){
      color = "steelblue";
    } else if (d==="Car Passenger"){
      color = "blue";
    }else{
      color = "black";
    }
    return color;};

  svg.selectAll(".bar")
    .data(data)
    .enter().append("circle")
      .attr("class", "bar")
      .attr("cx", function(d) { return x(d.Fatal_Casualty_Age); })
      .attr("cy", function(d) { return y(d.Fatal_Casualty_Type); })
      .attr('r', 3)
      .style("fill", function(d) { return cValue(d.Fatal_Casualty_Type);})
      .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("Age: " + (d.Fatal_Casualty_Age) + "<br>Type: " + (d.Fatal_Casualty_Type));})
      .on("mouseout", function(d){ tooltip.style("display", "none");});

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", -10).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", -10).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
  }
}
renderFatalTypeByAge()