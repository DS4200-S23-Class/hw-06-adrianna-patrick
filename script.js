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

let plot_width = FRAME_WIDTH - MARGINS.left - MARGINS.right;
let plot_height = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;

let bar_x = d3.scaleBand()
  .range([0, plot_width])
  .padding(0.1);
let bar_y = d3.scaleLinear()
  .range([plot_height, 0]);

let bar_svg = d3.select("#bar").append("svg")
    .attr("width", plot_width + MARGINS.left + MARGINS.right)
    .attr("height", plot_height + MARGINS.top + MARGINS.bottom)
    .append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");

function isBrushed(brush_coords, cx, cy) {
  let x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
 return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
}

// reading in data
d3.csv("data/iris.csv").then((data) => {

  let brushedDots = []  

  let attribut1 = "Sepal_Length";
  let attribut2 = "Petal_Length";

  let attribut3 = "Sepal_Width";
  let attribut4 = "Petal_Width";

  let color = d3.scaleOrdinal()
      .range(["red", "green", "blue"]);
    
  let scalex_plot1 = d3.scaleLinear().domain(d3.extent(data, function(d){return d[attribut1]})).range([MARGINS.left, plot_width]);

  let scaley_plot1 = d3.scaleLinear().domain(d3.extent(data, function(d){return d[attribut2]})).range([plot_height, MARGINS.top]);

  let scalex_plot2 = d3.scaleLinear().domain(d3.extent(data, function(d){return d[attribut3]})).range([MARGINS.left, plot_width]);

  let scaley_plot2 = d3.scaleLinear().domain(d3.extent(data, function(d){return d[attribut4]})).range([plot_height, MARGINS.top]);


  let brush = d3.brush()
    .extent([
      [d3.min(scalex_plot2.range()) - 50, d3.min(scaley_plot2.range()) - 50],
      [d3.max(scalex_plot2.range()) + 50, d3.max(scaley_plot2.range()) + 50]
    ])
    .on("start brush", function(event) {
      if (event.selection === null) {
          brushedDots = [];
      } else {
        const [[x0, y0], [x1, y1]] = event.selection;
        brushedDots = data.filter(d => {
          return x0 <= scalex_plot2(d.Sepal_Width) &&
            x1 >= scalex_plot2(d.Sepal_Width) &&
            y0 <= scaley_plot2(d.Petal_Width) &&
            y1 >= scaley_plot2(d.Petal_Width);
        }).map(d => d.id);
        
        scatter2.selectAll("circle")
        .style("opacity", function(d) {
          if (brushedDots.includes(d.id)) {
            return "1.0";
          } else {
            return "0.5";
          }
        })
        .classed("selected", function(d) {
          if (brushedDots.includes(d.id)) {
            return true;
          } else {
            return false;
          }
        });

        scatter1.selectAll("circle")
        .style("opacity", function(d) {
          if (brushedDots.includes(d.id)) {
            return "1.0";
          } else {
            return "0.5";
          }
        })
        .classed("selected", function(d) {
          if (brushedDots.includes(d.id)) {
            return true;
          } else {
            return false;
          }
        });

        bar_svg.selectAll(".bar")
        .style("opacity", function(d) {
          if (brushedDots.includes(d.id)) {
            return "1.0";
          } else {
            return "0.02";
          }
        })
        .classed("selected", function(d) {
          if (brushedDots.includes(d.id)) {
            return true;
          } else {
            return false;
          }
        });
      } 
    })

  let g_plot1 = scatter1.append("g")
    .attr("transform", "translate(" + 50 + "," + 50 + ")");

  g_plot1.append("g")
  .attr("transform", "translate(0," + 225 + ")")
  .call(d3.axisBottom(scalex_plot1));

  g_plot1.append("g")
  .call(d3.axisLeft(scaley_plot1));

  let g_plot2 = scatter2.append("g")
  .attr("transform", "translate(" + 50 + "," + 50 + ")")
  .call(brush);

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
  .style('opacity', '0.5');

scatter2.append("text")
  .attr("x", (FRAME_WIDTH / 2) )             
  .attr("y",  (MARGINS.top / 2) + 50)
  .attr("text-anchor", "middle")
  .style("font-size", "15px") 
  .style("text-decoration", "underline")  
  .text("Petal Width vs Sepal Width");

  let countObj = {};

  data.forEach(function(d) {
      let species = d.Species;
      if(countObj[species] === undefined) {
          countObj[species] = 1;
      } else {
          countObj[species] = countObj[species] + 1;
      }
  });

  data.forEach(function(d) {
      let species = d.Species;
      d.count = countObj[species];
  });

  bar_x.domain(data.map(function(d) { return d.Species; }));
  bar_y.domain([0, d3.max(data, function(d) { return d.count; })]);

  bar_svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return bar_x(d.Species); })
        .attr("width", bar_x.bandwidth())
        .attr("y", function(d) { return bar_y(d.count); })
        .style('opacity','0.02')
        .attr('fill',function(d){return color(d.Species)})
        .attr("height", function(d) { return plot_height - bar_y(d.count); })
        
    
    // add the x Axis
    bar_svg.append("g")
        .attr("transform", "translate(0," + plot_height + ")")
        .call(d3.axisBottom(bar_x));
    
    // add the y Axis
    bar_svg.append("g")
        .call(d3.axisLeft(bar_y));

    bar_svg.append("text")
        .attr("x", (FRAME_WIDTH / 2) - 40 )             
        .attr("y",  MARGINS.top - 60)
        .attr("text-anchor", "middle")
        .style("font-size", "15px") 
        .style("text-decoration", "underline")  
        .text("Species Count");
});
