const tooltip = d3.select("body").append("div").attr("class", "toolTip");

//// FATALITY COUNT BY AGE: svgFatalCountAge
const margin = {top: 20, right: 20, bottom: 60, left: 60},
  width = 1000 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

const xFatalCountAge = d3.scaleBand().rangeRound([0, width]).padding(.1);
const yFatalCountAge = d3.scaleLinear().rangeRound([height, 0]);

let svgFatalCountAge = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",`translate(${margin.left}, ${margin.top})`);


//// FATALITY TYPE BY AGE: svgFatalTypeAge

const xFatalTypeAge = d3.scaleLinear().range([0, width]);
const yFatalTypeAge = d3.scalePoint().rangeRound([height, 0]);

let svgFatalTypeAge = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",`translate(${margin.left}, ${margin.top})`);


//// FATALITY TYPE BY COUNT: svgFatalTypeCount

const xFatalTypeCount = d3.scaleBand().rangeRound([0, width]).padding(.1);
const yFatalTypeCount = d3.scaleLinear().rangeRound([height, 0]);

let svgFatalTypeCount = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",`translate(${margin.left}, ${margin.top})`);


//// BUTTON/GRAPH UPDATES
const buttons = d3.selectAll('input');
buttons.on('change', (d,i,nodes) => {
  let selection = nodes[i].value;
  console.log(`button changed to ${selection}`);
  let fill;

  if (selection==="Female"){
    fill = "indianred";
  }else if (selection==="Male"){
    fill = "steelblue";
  } else{
    fill = "mediumseagreen";
  }

  updateFatalCountAge(selection, fill);
  updateFatalTypeAge(selection, fill);
  updateFatalTypeCount(selection, fill);

});


//// FATALITY COUNT BY AGE 

async function updateFatalCountAge(selection, fill){

  data = await d3.json(`fatalCountAge/${selection}`);

  data.forEach(d => {
    d.age = +d.age;
    d.count = +d.count;

  });

  xFatalCountAge.domain(data.map(d => d.age));
  yFatalCountAge.domain([0, d3.max(data.map(d => d.count))]);

    // Add the X Axis
  xAxisFatalCountAge = svgFatalCountAge.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xFatalCountAge)
      .tickValues([0,10,20,30,40,50,60,70,80,90]))
    .selectAll(".tick text")
      .style("font-size", "9px");

  xAxisFatalCountAge.exit().remove();

  // Add the Y Axis
  svgFatalCountAge.append("g")
    .call(d3.axisLeft(yFatalCountAge));

   // title
  svgFatalCountAge.append("text")
    .attr("transform", `translate(2,-10)`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text(`Fatal Casualty Count by Age for ${selection}`);

  groupFatalCountAge = svgFatalCountAge
    .selectAll(".bar")
    .data(data);

  groupFatalCountAge
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", d => {return xFatalCountAge(d.age);})
      .attr("y", d => {return yFatalCountAge(d.count);})
      .attr("width", xFatalCountAge.bandwidth())
      .attr("height", d => {return height - yFatalCountAge(d.count);})
      .style("fill", fill)
      .on("mousemove", (d,i,nodes) => {
        d3.select(nodes[i]).style("fill", "rosybrown");
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html(`Age: ${d.age} <br>Count: ${d.count}`);})
      .on("mouseout",  (d,i,nodes) => { 
        d3.select(nodes[i]).style("fill", fill) 
        tooltip.style("display", "none");});

  groupFatalCountAge.transition()
    .duration(500)
    .attr("y", d => {return yFatalCountAge(d.count);})
    .attr("height", d => {return height - yFatalCountAge(d.count);})
    .style("fill", fill);

  groupFatalCountAge.exit().remove();

} 

//// FATALITY TYPE BY AGE

async function updateFatalTypeAge(selection, fill){
  data = await d3.json(`fatalTypeAge/${selection}`);

  data.forEach(d => {
    d.age = +d.age;
    d.fatalCasualtyType = d.fatalCasualtyType;

  });
  
  xFatalTypeAge.domain(d3.extent(data.map(d => d.age)));
  yFatalTypeAge.domain(data.map(d => d.fatalCasualtyType));

  svgFatalTypeAge.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xFatalTypeAge))
    .selectAll(".tick text")
      .style("font-size", "9px");

  svgFatalTypeAge.append("g")
    .attr("class", "xaxis axis")
    .call(d3.axisLeft(yFatalTypeAge))
    .selectAll(".tick text")
       .style("font-size", "8px")
       .call(wrapYAxis, 50);

  svgFatalTypeAge.append("text")
    .attr("transform", `translate(2,-10})`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text(`Most Frequent Fatality Type by Age for ${selection}`);

  let dotFillColor = function(d) { 
    if (d==="Van Driver"){
      color = "mediumseagreen";
    } else if (d==="Van Passenger"){
      color = "indianred";
    } else if (d==="Pedestrian"){
      color = "steelblue";
    } else if (d==="Car Passenger"){
      color = "blue";
    } else{
      color = "black";
    }
    return color;};

  groupFatalTypeAge = svgFatalTypeAge.selectAll(".bar")
    .data(data);

  groupFatalTypeAge
    .enter().append("circle")
      .attr("class", "bar")
      .attr("cx", d => {return xFatalTypeAge(d.age); })
      .attr("cy", d => {return yFatalTypeAge(d.fatalCasualtyType); })
      .attr('r', 3)
      .style("fill", d => {return dotFillColor(d.fatalCasualtyType);})
      .on("mousemove", (d,i,nodes) => {
        d3.select(nodes[i]).style("fill", "rosybrown");
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html(`Age: ${d.age} <br>Type: ${d.fatalCasualtyType}`);})
      .on("mouseout", (d,i,nodes) => {
        d3.select(nodes[i]).style("fill", d => {return dotFillColor(d.fatalCasualtyType);});
        tooltip.style("display", "none");});
  
  groupFatalTypeAge.transition()
    .duration(500)
    .attr("cy", d => {return yFatalTypeAge(d.fatalCasualtyType); })
    .style("fill", d => {return dotFillColor(d.fatalCasualtyType);});

  groupFatalTypeAge.exit().remove();



}


//// FATALITY TYPE BY COUNT

async function updateFatalTypeCount(selection, fill){
  data = await d3.json(`fatalityTypeCount/${selection}`);

  data.forEach( d => {
    d.fatalCasualtyType = d.fatalCasualtyType;
    d.count = +d.count;
  });

  xFatalTypeCount.domain(data.map(d => d.fatalCasualtyType));
  yFatalTypeCount.domain([0, d3.max(data.map(d => d.count))]);

  // Add the X Axis
  svgFatalTypeCount.append("g")
    .attr("class", "xaxis axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xFatalTypeCount))
    .selectAll(".tick text")
      .style("font-size", "8px")
      .call(wrapXAxis, xFatalTypeCount.bandwidth());


  // Add the Y Axis
  svgFatalTypeCount.append("g")
    .call(d3.axisLeft(yFatalTypeCount));

  // title
  svgFatalTypeCount.append("text")
    .attr("transform", `translate(2,-10)`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text(`Fatal Casualty Type by Count for ${selection}`);

  groupFatalTypeCount = svgFatalTypeCount
    .selectAll(".bar")
    .data(data);

  groupFatalTypeCount
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x",  d => {return xFatalTypeCount(d.fatalCasualtyType);})
      .attr("y", d => {return yFatalTypeCount(d.count);})
      .attr("width", xFatalTypeCount.bandwidth())
      .attr("height", d => {return height - yFatalTypeCount(d.count);})
      .style("fill", fill)
      .on("mousemove", (d,i,nodes) =>{
        d3.select(nodes[i]).style("fill", "rosybrown");
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html(`Type: ${d.fatalCasualtyType} <br>Count: ${d.count}`);})
      .on("mouseout", (d,i,nodes) => { 
        d3.select(nodes[i]).style("fill", fill);
        tooltip.style("display", "none");});

  groupFatalTypeCount.transition()
    .duration(500)
    .attr("y", d => {return yFatalTypeCount(d.count);})
    .attr("height", d => {return height - yFatalTypeCount(d.count);})
    .style("fill", fill);

  groupFatalTypeCount.exit().remove()

}


function wrapYAxis(text, width) {
  text.each(function() {
    let text = d3.select(this),
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


function wrapXAxis(text, width) {
  text.each(function() {
    let text = d3.select(this),
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
