const FRAME_HEIGHT = 300;
const FRAME_WIDTH = 400;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

// frame
let scatter1 = d3
  .select("#scatter1")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame");

let scatter2 = d3
  .select("#scatter2")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame");

// reading in data
d3.csv("data/iris.csv").then((data) => {

  let attribut1 = "Sepal_Length";
  let attribut2 = "Petal_Length";

  let attribut3 = "Sepal_Width";
  let attribut4 = "Petal_Width";

  let color = d3.scaleOrdinal()
      .range(["red", "green", "blue"]);

  plot_width = FRAME_WIDTH - MARGINS.left - MARGINS.right,
  plot_height = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
    
  let scalex_plot1 = d3.scaleLinear().domain(d3.extent(data, function(d){return d[attribut1]})).range([MARGINS.left, plot_width]);

  let scaley_plot1 = d3.scaleLinear().domain(d3.extent(data, function(d){return d[attribut2]})).range([plot_height, MARGINS.top]);

  let scalex_plot2 = d3.scaleLinear().domain(d3.extent(data, function(d){return d[attribut3]})).range([MARGINS.left, plot_width]);

  let scaley_plot2 = d3.scaleLinear().domain(d3.extent(data, function(d){return d[attribut4]})).range([plot_height, MARGINS.top]);

  let g_plot1 = scatter1.append("g")
    .attr("transform", "translate(" + 50 + "," + 50 + ")");

  g_plot1.append("g")
  .attr("transform", "translate(0," + 225 + ")")
  .call(d3.axisBottom(scalex_plot1));

  g_plot1.append("g")
  .call(d3.axisLeft(scaley_plot1));

  let g_plot2 = scatter2.append("g")
  .attr("transform", "translate(" + 50 + "," + 50 + ")");

  g_plot2.append("g")
  .attr("transform", "translate(0," + 225 + ")")
  .call(d3.axisBottom(scalex_plot1));

  g_plot2.append("g")
  .call(d3.axisLeft(scaley_plot1));


  // plot
  scatter1
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr('cx',function(d){ return scalex_plot1(d[attribut1])}) 
    .attr('cy',function(d){ return scaley_plot1(d[attribut2])})
    .attr("r", 5)
    .attr('fill',function(d){return color(d.Species)})
    .attr("transform", "translate(" + 50 + "," + 50 + ")")
    .style('opacity','0.5');

  scatter1.append("text")
    .attr("x", (FRAME_WIDTH / 2) )             
    .attr("y",  (MARGINS.top / 2) + 50)
    .attr("text-anchor", "middle")
    .style("font-size", "15px") 
    .style("text-decoration", "underline")  
    .text("Petal Length vs Sepal Length");

      // plot
  scatter2
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr('cx',function(d){ return scalex_plot2(d[attribut3])}) 
  .attr('cy',function(d){ return scaley_plot2(d[attribut4])})
  .attr("r", 5)
  .attr('fill',function(d){return color(d.Species)})
  .attr("transform", "translate(" + 50 + "," + 50 + ")")
  .style('opacity','0.5');

scatter2.append("text")
  .attr("x", (FRAME_WIDTH / 2) )             
  .attr("y",  (MARGINS.top / 2) + 50)
  .attr("text-anchor", "middle")
  .style("font-size", "15px") 
  .style("text-decoration", "underline")  
  .text("Petal Width vs Sepal Width");
});
