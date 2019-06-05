async function renderFatalTypeByAge(){

  const data = await d3.json("fatality_type_by_age");

  data.forEach(function(d) {
    d.Fatal_Casualty_Age = +d.Fatal_Casualty_Age;
    d.Fatal_Casualty_Type = +d.Fatal_Casualty_Type;

  });



}
renderFatalTypeByAge()