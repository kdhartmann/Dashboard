const tooltip = d3.select("body").append("div").attr("class", "toolTip");

//// FATALITY COUNT BY AGE: svgFatalCountAge
const margin = {top: 20, right: 20, bottom: 60, left: 65},
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


//// FATALITY COUNT BY AGE: svgFatalCountAge 

async function updateFatalCountAge(selection, fill){

  data = await d3.json(`fatalCountAge/${selection}`);

  data.forEach(d => {
    d.age = +d.age;
    d.count = +d.count;

  });

  xFatalCountAge.domain(data.map(d => d.age));
  yFatalCountAge.domain([0, d3.max(data.map(d => d.count))]);

  svgFatalCountAge.selectAll(".xAxisFatalCountAge").remove();
  svgFatalCountAge.selectAll(".yAxisFatalCountAge").remove();

  // X-Axis 
  let xAxisFatalCountAge = d3.axisBottom()
    .scale(xFatalCountAge);

  svgFatalCountAge.append("g")
    .attr("class", "xAxisFatalCountAge")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisFatalCountAge.tickValues([0,10,20,30,40,50,60,70,80,90]));

  svgFatalCountAge.selectAll(".xAxisFatalCountAge")
    .transition()
      .call(xAxisFatalCountAge.tickValues([0,10,20,30,40,50,60,70,80,90]));

  // Y-Axis
  let yAxisFatalCountAge = d3.axisLeft()
    .scale(yFatalCountAge);

  svgFatalCountAge.append("g")
    .attr("class", "yAxisFatalCountAge")
    .call(yAxisFatalCountAge);

  svgFatalCountAge.selectAll(".yAxisFatalCountAge")
    .transition()
      .call(yAxisFatalCountAge);

  // Title
  svgFatalCountAge.selectAll(".title").remove();

  svgFatalCountAge.append("text")
    .attr("class", "title")
    .attr("transform", `translate(2,-10)`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text(`Fatal Casualty Count by Age for ${selection}`);
  
  svgFatalCountAge.selectAll(".title")
    .text(`Fatal Casualty Count by Age for ${selection}`)
  
  // use this for fill in mouseover
  if (selection==="Female"){
    selectionColor = "indianred";
  }else if (selection==="Male"){
    selectionColor = "steelblue";
  } else{
    selectionColor = "mediumseagreen";
  };

  // Bars 
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
        d3.select(nodes[i]).style("fill", selectionColor) 
        tooltip.style("display", "none");});

  groupFatalCountAge.transition()
    .duration(500)
    .attr("y", d => {return yFatalCountAge(d.count);})
    .attr("x", d => {return xFatalCountAge(d.age);})
    .attr("height", d => {return height - yFatalCountAge(d.count);})
    .style("fill", fill);

  groupFatalCountAge.exit().remove();

} 

//// FATALITY TYPE BY AGE: svgFatalTypeAge

async function updateFatalTypeAge(selection, fill){
  data = await d3.json(`fatalTypeAge/${selection}`);

  data.forEach(d => {
    d.age = +d.age;
    d.fatalCasualtyType = d.fatalCasualtyType;

  });
  
  xFatalTypeAge.domain(d3.extent(data.map(d => d.age)));
  yFatalTypeAge.domain(data.map(d => d.fatalCasualtyType));

  svgFatalTypeAge.selectAll(".xAxisFatalTypeAge").remove();
  svgFatalTypeAge.selectAll(".yAxisFatalTypeAge").remove();

  // X-Axis
  let xAxisFatalTypeAge = d3.axisBottom()
    .scale(xFatalTypeAge);

  svgFatalTypeAge.append("g")
    .attr("class", "xAxisFatalTypeAge")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisFatalTypeAge);
    
  svgFatalTypeAge.transition()
      .call(xAxisFatalTypeAge);

  //Y-Axis
  let yAxisFatalTypeAge = d3.axisLeft()
    .scale(yFatalTypeAge);

  svgFatalTypeAge.append("g")
    .attr("class", "yAxisFatalTypeAge")
    .call(yAxisFatalTypeAge)
    .selectAll(".tick text")
        .style("font-size", "8px");

  svgFatalTypeAge.selectAll(".yAxisFatalTypeAge")
    .transition()
      .call(yAxisFatalTypeAge)
      .selectAll(".tick text")
        .style("font-size", "8px");
  
  // title
  svgFatalTypeAge.selectAll(".title").remove();

  svgFatalTypeAge.append("text")
    .attr("class", "title")
    .attr("x", "2")
    .attr("y", "-10")
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text(`Most Frequent Fatality Type by Age for ${selection}`);

  svgFatalTypeAge.selectAll(".title")
    .text(`Most Frequent Fatality Type by Age for ${selection}`)

  // Color for dots 
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

  // Dots for chart
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
    .attr("cx", d => {return xFatalTypeAge(d.age); })
    .attr("cy", d => {return yFatalTypeAge(d.fatalCasualtyType); })
    .style("fill", d => {return dotFillColor(d.fatalCasualtyType);});

  groupFatalTypeAge.exit().remove();

}


//// FATALITY TYPE BY COUNT: svgFatalTypeCount

async function updateFatalTypeCount(selection, fill){
  data = await d3.json(`fatalityTypeCount/${selection}`);

  data.forEach( d => {
    d.fatalCasualtyType = d.fatalCasualtyType;
    d.count = +d.count;
  });

  xFatalTypeCount.domain(data.map(d => d.fatalCasualtyType));
  yFatalTypeCount.domain([0, d3.max(data.map(d => d.count))]);
  
  svgFatalTypeCount.selectAll(".xAxisFatalTypeCount").remove();
  svgFatalTypeCount.selectAll(".yAxisFatalTypeCount").remove();

  // X-Axis
  let xAxisFatalTypeCount = d3.axisBottom()
    .scale(xFatalTypeCount);

  svgFatalTypeCount.append("g")
    .attr("class", "xAxisFatalTypeCount")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisFatalTypeCount)
    .selectAll(".tick text")
      .style("font-size", "8px");

  svgFatalTypeCount.selectAll(".xAxisFatalTypeCount")
    .transition()
      .attr("transform", `translate(0, ${height})`)
      .call(xAxisFatalTypeCount)
      .selectAll(".tick text")
        .style("font-size", "8px");

  //Y-Axis
  let yAxisFatalTypeCount = d3.axisLeft()
    .scale(yFatalTypeCount);

  svgFatalTypeCount.append("g")
    .attr("class", "yAxisFatalTypeCount")
    .call(yAxisFatalTypeCount);

  svgFatalTypeCount.selectAll(".yAxisFatalTypeCount")
    .transition()
      .call(yAxisFatalTypeCount);

  // Title
  svgFatalTypeCount.selectAll(".title").remove();

  svgFatalTypeCount.append("text")
    .attr("class", "title")
    .attr("transform", `translate(2,-10)`)
    .attr("dy", ".35em")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .attr("text-anchor", "start")
    .style("fill", "black")
    .text(`Fatal Casualty Type by Count for ${selection}`);

  svgFatalTypeCount.selectAll(".title")
    .text(`Fatal Casualty Type by Count for ${selection}`)

  // use this for fill in mouseover
  if (selection==="Female"){
    selectionColor = "indianred";
  }else if (selection==="Male"){
    selectionColor = "steelblue";
  } else{
    selectionColor = "mediumseagreen";
  };

  // Bars for chart
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
        d3.select(nodes[i]).style("fill", selectionColor);
        tooltip.style("display", "none");});

  groupFatalTypeCount.transition()
    .duration(500)
    .attr("x",  d => {return xFatalTypeCount(d.fatalCasualtyType);})
    .attr("y", d => {return yFatalTypeCount(d.count);})
    .attr("height", d => {return height - yFatalTypeCount(d.count);})
    .style("fill", fill);

  groupFatalTypeCount.exit().remove()

}
