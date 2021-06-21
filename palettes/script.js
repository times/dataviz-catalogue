// set config object
const config = { width: 700, height: 1400, blockWidth: 50 };

const margin = { top: 50, right: 40, bottom: 50, left: 60 },
  width = config.width - margin.left - margin.right,
  height = config.height - margin.top - margin.bottom;

// Clean up before drawing
// By brutally emptying all HTML from plot container div
d3.select("#times-palettes").html("");

const svg = d3
  .select("#times-palettes")
  .attr("width", config.width)
  .attr("height", config.height);

function onHover(duration, type) {
  return function() {
    if (type === "mouseover") {
      d3.select(this)
        .transition()
        .duration(duration)
        .styleTween("opacity", () => d3.interpolate(1, 0.5))
        .attrTween("width", () =>
          d3.interpolate(config.blockWidth, config.blockWidth + 2)
        )
        .attrTween("height", () =>
          d3.interpolate(config.blockWidth, config.blockWidth + 2)
        );
    } else if (type === "mouseout") {
      d3.select(this)
        .transition()
        .duration(duration)
        .styleTween("opacity", () => d3.interpolate(0.5, 1))
        .attrTween("width", () =>
          d3.interpolate(config.blockWidth + 2, config.blockWidth)
        )
        .attrTween("height", () =>
          d3.interpolate(config.blockWidth + 2, config.blockWidth)
        )
        .attr("rx", 2)
        .attr("ry", 2);
    } else if (type === "click") {
      d3.select(this)
        .transition()
        .duration(duration)
        .style("opacity", 0.2)
        .transition()
        .duration(200)
        .style("opacity", 0.6);
    }
  };
}

const makePalette = container => {
  const colour = container
    .selectAll("rect")
    .data(d => d.colours)
    .enter()
    .append("g");

  colour
    .append("rect")
    .attr("x", (d, i) => i * 60)
    .attr("y", 10)
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("width", config.blockWidth)
    .attr("height", config.blockWidth)
    .attr("class", "rect")
    .attr("dataClipboardText", d => d.code)
    .attr("transform", "translate(0,20)")
    // .translate([0, 20])
    .style("fill", d => d.code)
    .on("mouseover", onHover(100, "mouseover"))
    .on("mouseout", onHover(200, "mouseout"))
    .on("click", onHover(20, "click"));

  colour
    .append("text")
    .attr("x", (d, i) => i * 60)
    .attr("y", 0)
    .attr("class", "label")
    .text(d => d.code.toString())
    .attr("transform", `translate(0,${config.blockWidth * 2 - 5})`);
  // .translate([0, config.blockWidth * 2 - 5]);

  colour
    .append("text")
    .attr("x", (d, i) => i * 60)
    .attr("y", 13)
    .attr("class", "label name")
    .text(d => d.label)
    .attr("transform", `translate(0,${config.blockWidth * 2 - 5})`);
  // .translate([0, config.blockWidth * 2 - 5]);
};

d3.json("palettes.json", (error, data) => {
  if (error) throw error;

  const palette = svg
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(10, ${i * 150 + 50})`);
  // .translate((d, i) => [10, i * 150 + 50]);

  palette
    .append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("class", "Headline paletteTitle")
    .text(d => d.name);

  palette.call(makePalette(palette));
});

const clipboard = new Clipboard(".rect");
