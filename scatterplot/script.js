/*
 * Annotation layer
 * DO uncomment further below
 *    draggable(true)
 */
var annotations = [{
    "Fee": "50",
    "Age": "25",
    "path": "M54,-11L7,-11",
    "text": "Oscar",
    "textOffset": [
      59,
      -8
    ]
  },{
    "Fee": "20",
    "Age": "27",
    "path": "M0,-66L0,-29",
    "text": "Morgan Schneiderlin",
    "textOffset": [
      4,
      -64
    ]
  }];

// set config object
var config = { width: 600, height: 450 };

var margin = {top: 20, right: 40, bottom: 50, left: 60},
    width = config.width - margin.left - margin.right,
    height = config.height - margin.top - margin.bottom;

// Clean up before drawing
// By brutally emptying all HTML from plot container div
d3.select("#times-scatterplot").html("");

var svg = d3.select("#times-scatterplot")
            .attr("width", config.width)
            .attr("height", config.height);

/*
 * Scales
 * Both scales run full height and full width
 * and are linear
 * More about scales: https://github.com/d3/d3/blob/master/API.md#scales-d3-scale
 */
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// g is our main container
var g = svg.append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data.json", function(err, dataset) {

  /*
   * Constrain variables to numbers
   */
  dataset.forEach(function(d) {
    d.Age = +d.Age;
    d.Fee = +d.Fee;
  });

  /*
   * d3.extent should return a [min,max] array
   * We're hard-coding the y-axis extent in this case
   */
  var xExtent = d3.extent(dataset, function(d) { return d.Age; });
  //var yExtent = d3.extent(dataset, function(d) { return d.Fee; });
  var yExtent = d3.extent([0,65]);

  x.domain(xExtent);
  y.domain(yExtent);

  // X-axis
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
            .ticks(10)
            .tickSizeInner(0)
            .tickPadding(20));

  // text label for the x axis
  g.append("text")             
    .attr("class", "label")
    .attr("transform",
        "translate(" + (width/2) + " ," + 
        (height + margin.top + 40) + ")")
    .style("text-anchor", "middle")
    .text("Age");

  // Y-axis
  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickPadding(20)
            .tickFormat(function(d) { return d + "m"; }))

    // text label for the y axis
    g.append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "0em")
    .style("text-anchor", "middle")
    .text("Fee (£)");   

  // Add the scatterplot
  g.selectAll("dot")
    .data(dataset)
    .attr("class", "dots")
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return x(d.Age); })
    .attr("cy", function(d) { return y(d.Fee); })
    .style("fill", "#254251");

    // Annotations
  var swoopy = d3.swoopyDrag()
    .x(function(d){ return x(d.Age) })
    .y(function(d){ return y(d.Fee) })
    //.draggable(true)
    .annotations(annotations)

    var swoopySel = g.append("g")
    .attr("class", "annotations")
    .call(swoopy);

  // SVG arrow marker fix
  // Do not change
  svg.append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "-10 -10 20 20")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("circle")
    .attr("r", "6")
    .style("fill", "#F37F2F")
    swoopySel.selectAll("path").attr("marker-start", "url(#arrow)")
})
