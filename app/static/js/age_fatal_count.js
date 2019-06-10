var tooltip = d3.select("body").append("div").attr("class", "toolTip");

//// FATALITY COUNT BY AGE: SVG1
var margin1 = {top: 20, right: 20, bottom: 60, left: 50},
    width1 = 1000 - margin1.left - margin1.right,
    height1 = 250 - margin1.top - margin1.bottom;

var x1 = d3.scaleBand().rangeRound([0, width1]).padding(.1);
var y1 = d3.scaleLinear().rangeRound([height1, 0]);

var svg1 = d3.select("body").append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform","translate(" + margin1.left + "," + margin1.top + ")");


//// FATALITY TYPE BY AGE: SVG2

var margin2 = {top: 20, right: 20, bottom: 30, left: 60},
    width2 = 1000 - margin2.left - margin2.right,
    height2 = 250 - margin2.top - margin2.bottom;

var x2 = d3.scaleLinear().range([0, width2]);
var y2 = d3.scalePoint().rangeRound([height2, 0]);

var svg2 = d3.select("body").append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform","translate(" + margin2.left + "," + margin2.top + ")");


//// FATALITY TYPE BY COUNT

var margin3 = {top: 20, right: 20, bottom: 35, left: 50},
    width3 = 700 - margin3.left - margin3.right,
    height3 = 250 - margin3.top - margin3.bottom;

var x3 = d3.scaleBand().rangeRound([0, width3]).padding(.1);
var y3 = d3.scaleLinear().rangeRound([height3, 0]);

var svg3 = d3.select("body").append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform","translate(" + margin3.left + "," + margin3.top + ")");


//// BUTTON/GRAPH UPDATES
const buttons = d3.selectAll('input');
let selection;
buttons.on('change', function(d) {
  selection = this.value;
  console.log('button changed to ' + selection);

  updateAgeFatalCount(selection);
  updateFatalTypeByAge(selection);
  updateFatalityType(selection);

});


//// FATALITY COUNT BY AGE 

async function updateAgeFatalCount(selection){

    if (selection==="Male"){
      data = await d3.json("age_fatal_count_male");
      titleHeight = 270;
      fill = "steelblue";
      console.log("selection is equal to male");
  } else if (selection==="Female"){
      data = await d3.json("age_fatal_count_female");
      titleHeight = 75;
      fill = "indianred";
      console.log("selection is equal to female");
  } else{
      data = await d3.json("age_fatal_count");
      titleHeight = 340;
      fill = "mediumseagreen";
  }

  data.forEach(function(d) {
    d.Fatal_Casualty_Age = +d.Fatal_Casualty_Age;
    d.Count = +d.Count;

  });

  x1.domain(data.map(d => d.Fatal_Casualty_Age));
  y1.domain([0, d3.max(data.map(d => d.Count))]);


//doesn't come up at all if I use .enter() for title, x and y axis 
    // Add the X Axis
  xaxis = svg1.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", "translate(0," + height1  + ")")
    .call(d3.axisBottom(x1)
          .tickValues([0,10,20,30,40,50,60,70,80,90]))
    .selectAll(".tick text")
      .style("font-size", "9px");

  xaxis.exit().remove();

  // Add the Y Axis
  yaxis = svg1.append("g")
    .call(d3.axisLeft(y1));

  yaxis.exit().remove();

   // title
  title = svg1.append("text")
    .attr("transform", "translate("+(0)+","+y1(titleHeight)+")")
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Fatal Casualty Count by Age for " + selection);

  title.exit().remove();

  group = svg1.selectAll("bar")
    .data(data)
    .enter().append("rect");

  group.exit().remove();

  group
        .transition().duration(500)
        .attr("class", "bar")
        .attr("x", function (d) {return x1(d.Fatal_Casualty_Age);})
        .attr("y", function (d) {return y1(d.Count);})
        .attr("width", x1.bandwidth())
        .attr("height", function (d) {return height1 - y1(d.Count);})
        .style("fill", fill)
        .on("mousemove", function(d){
            d3.select(this).style("fill", "rosybrown");
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("Age: " + (d.Fatal_Casualty_Age) + "<br>Count: " + (d.Count));})
        .on("mouseout", function(d){ 
          d3.select(this).style("fill", fill); 
          tooltip.style("display", "none");});

} 

//// FATALITY TYPE BY AGE

async function updateFatalTypeByAge(selection){

  if (selection==="Male"){
      data = await d3.json("fatality_type_by_age_male");
      titleHeight = 350;
      console.log("selection is equal to male");
  } else if (selection==="Female"){
      data = await d3.json("fatality_type_by_age_female");
      titleHeight = 350;
      console.log("selection is equal to female");
  } else{
      data = await d3.json("fatality_type_by_age");
      titleHeight = 350;
  }

  data.forEach(function(d) {
    d.Fatal_Casualty_Age = +d.Fatal_Casualty_Age;
    d.Fatal_Casualty_Type = d.Fatal_Casualty_Type;

  });
  
  x2.domain(d3.extent(data.map(d => d.Fatal_Casualty_Age)));
  y2.domain(data.map(d => d.Fatal_Casualty_Type));

  svg2.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", "translate(0," + (height2 ) + ")")
    .call(d3.axisBottom(x2))
    .selectAll(".tick text")
      .style("font-size", "9px");

  svg2.append("g")
    .attr("class", "xaxis axis")
    .call(d3.axisLeft(y2))
    .selectAll(".tick text")
       .style("font-size", "8px")
       .call(wrap2, 50);
  
  var cValue = function(d) { 
    if (d==="Van Driver"){
      color = "mediumseagreen";
    } else if (d==="Van Passenger"){
      color = "indianred";
    }else if (d==="Pedestrian"){
      color = "steelblue";
    } else if (d==="Car Passenger"){
      color = "blue";
    }else{
      color = "black";
    }
    return color;};

  svg2.append("text")
    .attr("transform", "translate("+(2)+","+y2(titleHeight)+")")
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Most Frequent Fatality Type by Age for " + selection);

  group2 = svg2.selectAll(".bar")
    .data(data)
    .enter().append("circle");

  group2.exit().remove();


  group2.transition().duration(500)
      .attr("class", "bar")
      .attr("cx", function(d) { return x2(d.Fatal_Casualty_Age); })
      .attr("cy", function(d) { return y2(d.Fatal_Casualty_Type); })
      .attr('r', 3)
      .style("fill", function(d) { return cValue(d.Fatal_Casualty_Type);})
      .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("Age: " + (d.Fatal_Casualty_Age) + "<br>Type: " + (d.Fatal_Casualty_Type));})
      .on("mouseout", function(d){ tooltip.style("display", "none");});

}


//// FATALITY TYPE BY COUNT

async function updateFatalityType(selection){

  if (selection==="Male"){
      data = await d3.json("fatality_type_male");
      titleHeight = 2300;
      fill = "steelblue";
      console.log("selection is equal to male");
  } else if (selection==="Female"){
      data = await d3.json("fatality_type_female");
      titleHeight = 690;
      fill = "indianred";
      console.log("selection is equal to female");
  } else{
      data = await d3.json("fatality_type");
      titleHeight = 3000;
      fill = "mediumseagreen"
  }

    data.forEach(function(d) {
      d.Fatal_Casualty_Type = d.Fatal_Casualty_Type;
      d.Count = +d.Count;
  });

  x3.domain(data.map(d => d.Fatal_Casualty_Type));
  y3.domain([0, d3.max(data.map(d => d.Count))]);

  // Add the X Axis
  svg3.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", "translate(0," + (height3 ) + ")")
    .call(d3.axisBottom(x3))
    .selectAll(".tick text")
      .style("font-size", "8px")
      .call(wrap3, x3.bandwidth());


  // Add the Y Axis
  svg3.append("g")
    .call(d3.axisLeft(y3));

  // title
  svg3.append("text")
    .attr("transform", "translate("+(0)+","+y3(titleHeight)+")")
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text("Fatal Casualty Type by Count for " + selection);

  group3 = svg3.selectAll("bar")
    .data(data)
    .enter().append("rect");

  group3.exit().remove();

  group3.transition().duration(500)
      .attr("class", "bar")
      .attr("x", function (d) {return x3(d.Fatal_Casualty_Type);})
      .attr("y", function (d) {return y3(d.Count);})
      .attr("width", x3.bandwidth())
      .attr("height", function (d) {return height3 - y3(d.Count);})
      .style("fill", fill)
      .on("mousemove", function(d){
            d3.select(this).style("fill", "rosybrown");
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html(("Type: " + d.Fatal_Casualty_Type) + "<br>Count: " + (d.Count));})
      .on("mouseout", function(d){ 
          d3.select(this).style("fill", fill);
          tooltip.style("display", "none");});

}


function wrap2(text, width) {
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


  function wrap3(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
  }
