async function renderAgeFatalCount(){

  const data = await d3.json("age_fatal_count");

  data.forEach(function(d) {
    d.Fatal_Casualty_Age = +d.Fatal_Casualty_Age;
    d.Count = +d.Count;

  });



}
renderAgeFatalCount()