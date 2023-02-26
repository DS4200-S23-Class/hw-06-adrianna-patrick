const FRAME_HEIGHT = 300;
const FRAME_WIDTH = 300;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

// frame
let scatter1 = d3
  .select("#scatter1")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame");

// reading in data
d3.csv("data/iris.csv").then((data) => {
  console.log("here");

  // plot
  scatter1
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return d.Petal_Length;
    })
    .attr("cy", (d) => {
      return d.Sepal_Length;
    })
    .attr("r", 5);
});
