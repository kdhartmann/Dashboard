const tooltip = d3.select("body").append("div").attr("class", "toolTip");

const margin = {top: 20, right: 20, bottom: 20, left: 70},
  width = 1000 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

//// FATALITY COUNT BY AGE: svgFatalCountAge

const xFatalCountAge = d3.scaleBand().rangeRound([0, width]).padding(.1);
const yFatalCountAge = d3.scaleLinear().rangeRound([height, 0]);

let svgFatalCountAge = d3.select("#fatalCountAge")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",`translate(${margin.left}, ${margin.top})`);

//// FATALITY TYPE BY AGE: svgFatalTypeAge

const xFatalTypeAge = d3.scaleLinear().range([0, width]);
const yFatalTypeAge = d3.scalePoint().rangeRound([height, 0]);

let svgFatalTypeAge = d3.select("#fatalTypeAge")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",`translate(${margin.left}, ${margin.top})`);


//// FATALITY TYPE BY COUNT: svgFatalTypeCount

const xFatalTypeCount = d3.scaleBand().rangeRound([0, width]).padding(.1);
const yFatalTypeCount = d3.scaleLinear().rangeRound([height, 0]);

let svgFatalTypeCount = d3.select("#fatalTypeCount")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",`translate(${margin.left}, ${margin.top})`);

//// If we want All to be checked when "Age and Types" load and have graphs show up 
//// need to figure out text 
//// change "All" radio button to checked
// let selection = "All";
// let fill = "mediumseagreen";
// updateFatalCountAge(selection, fill);
// updateFatalTypeAge(selection, fill);
// updateFatalTypeCount(selection, fill);

//// BUTTON/GRAPH UPDATES
const buttons = d3.selectAll('input');
buttons.on('change', (d,i,nodes) => {
  let selection = nodes[i].value;
  console.log(`button changed to ${selection}`);
  let fill;
  
  // determine text and fill color for graphs
  // Sublime: View > Wrap Text
  if (selection==="Female"){
    fill = "indianred";
    textFatalCountAge ="Since females account for only 25% of all fatalities, the distribution of fatalities across ages remains similar but the amount of fatalities is smaller. The age with the highest fatal casualty count is 19 with only 72 fatalities. Comparing this distribution with the population and males, the females' has a more prominent increase around age 80.";
    textFatalTypeCount ="The top three fatal casualty types for females are relatively close and only differ by 11 fatalities. There is a drastic change from third highest to fourth highest of 580 fatalities.";
    textFatalTypeAge ="Text here about fatal type age for female";
  }else if (selection==="Male"){
    fill = "steelblue";
    textFatalCountAge ="Since majority of fatalities are male, it males since why the male population follows the same age trend as the entire population. The fatal casualty count for people less than 14 is relatively low with an increase around age 15. The age with the highest fatal casualty count for males is 18 with 256 fatalities. Then, the fatal casualty count decrease into the late 20s. After age 40, overall, there is a steady decrease into the 90s.";
    textFatalTypeCount ="Text here about fatal type age for male";
    textFatalTypeAge ="Text here for fatal type age for male:";
  } else{
    fill = "mediumseagreen";
    textFatalCountAge ="While being less than 15, the number of fatalities is relatively low. This starts to increase drastically around age 15-16. In the United Kingdom, the legal driving age is 17 but teenagers can receive learning permits around the age of 16. The age with the highest fatal casualty count for the population is 18 with 325 fatalities. After age 18, the number of fatalities decreases almost as drastically as it increased before. There is a more subtle decrease from ages 40 to 70, with a slight increase from the late 70s and into the 80s where we see it decrease again.";
    textFatalTypeCount ="Fatal Casualty Type consists of which vehicle and what role the fatal casualty was playing in the vehicle at the time of the accident. This varies from being a pedestrian, a van passenger, or a bus driver. Overall, the four highest fatal casualty types for the entire population were car driver, pedestrian, motorcycle rider, and car passenger. Out of the total number of fatalities, these top four account for 90%. Car driver alone accounts for 33% of the fatal casualty types.";
    textFatalTypeAge ="How the most frequent fatality type changes with age follows the general life of a person. From the age 0 to age 17, the most frequent alternates between pedestrian and car passenger. A year after driver's license eligibility, the most frequent changes to car driver. This continues into the mid 30s. 35 to 46 are the only ages where motorcycle rider is the most frequent fatality type. Afterward, the most frequent returns to car driver until 70, where it returns to pedestrian. ";
  }
  
  // select the text for div in html 
  d3.select("#textFatalCountAge").text(textFatalCountAge);
  d3.select("#textFatalTypeAge").text(textFatalTypeAge);
  d3.select("#textFatalTypeCount").text(textFatalTypeCount);
  
  // graphs update 
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

  // Set domains
  xFatalCountAge.domain(data.map(d => d.age));
  yFatalCountAge.domain([0, d3.max(data.map(d => d.count))]);
  
  // Remove old axes
  svgFatalCountAge.selectAll(".xAxisFatalCountAge").remove();
  svgFatalCountAge.selectAll(".yAxisFatalCountAge").remove();

  // Create X-Axis 
  let xAxisFatalCountAge = d3.axisBottom()
    .scale(xFatalCountAge)
    .tickValues([0,10,20,30,40,50,60,70,80,90]);

  svgFatalCountAge.append("g")
    .attr("class", "xAxisFatalCountAge")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisFatalCountAge);

  svgFatalCountAge.selectAll(".xAxisFatalCountAge")
    .transition()
      .call(xAxisFatalCountAge);

  // Create Y-Axis
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
  
  // Set domain
  xFatalTypeAge.domain(d3.extent(data.map(d => d.age)));
  yFatalTypeAge.domain(data.map(d => d.fatalCasualtyType));
  
  // Remove old axes
  svgFatalTypeAge.selectAll(".xAxisFatalTypeAge").remove();
  svgFatalTypeAge.selectAll(".yAxisFatalTypeAge").remove();

  // Create X-Axis
  let xAxisFatalTypeAge = d3.axisBottom()
    .scale(xFatalTypeAge);

  svgFatalTypeAge.append("g")
    .attr("class", "xAxisFatalTypeAge")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisFatalTypeAge);
    
  svgFatalTypeAge.transition()
      .call(xAxisFatalTypeAge);

  // Create Y-Axis
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
    .text(`Most Frequent Fatality Type by Age for ${selection}`);

  svgFatalTypeAge.selectAll(".title")
    .text(`Most Frequent Fatality Type by Age for ${selection}`)

  // Color for dots 
  let dotFillColor = d => { 
    if (d==="Car Driver"){
      color = "mediumseagreen";
    } else if (d==="Motorcycle Rider"){
      color = "sandybrown";
    } else if (d==="Pedestrian"){
      color = "steelblue";
    } else if (d==="Car Passenger"){
      color = "indianred";
    } else{
      color = "rebeccapurple";
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
  
  // Set domain 
  xFatalTypeCount.domain(data.map(d => d.fatalCasualtyType));
  yFatalTypeCount.domain([0, d3.max(data.map(d => d.count))]);
  
  // Remove old axes
  svgFatalTypeCount.selectAll(".xAxisFatalTypeCount").remove();
  svgFatalTypeCount.selectAll(".yAxisFatalTypeCount").remove();

  // Create X-Axis
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

  // Create Y-Axis
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
