// set config object
var config = { width: 700, height: 450 };
var margin = {top: 20, left: 20, right: 150};
var width = config.width - margin.left - margin.right,
    height = config.height - margin.top;

d3.select("#times-treemap").html("")

var svg = d3.select("#times-treemap")
            .attr("width", config.width)
            .attr("height", config.height)

// construct an ordinal scale from our colour palette
var timesColors = ["#254251", "#E0AB26", "#F37F2F", "#3292A6", "#6c3c5e"];
color = d3.scaleOrdinal(timesColors),
      format = d3.format(",d");

d3.json("data.json", function(err, dataset) {

  var treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .round(true)
    .paddingOuter(2)
    .paddingInner(1);

  var root = d3.hierarchy(dataset)
    .eachBefore(function(d) {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; 
    })
    .sum(sumBySize)
    .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

  treemap(root);

  // One cell per player
  var container = svg.append("g")
    .attr("class", "container");

  var cell = container.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

  cell.append("rect")
    .attr("id", function(d) {  return d.data.id; })
    .attr("class", function(d) {
      if (d.x1 - d.x0 > 120 && d.y1 - d.y0 > 40) { return "wide"; }
    })
  .attr("width", function(d) { return d.x1 - d.x0; })
    .attr("height", function(d) { return d.y1 - d.y0; })
    .attr("fill", function(d) { return color(d.parent.data.id); })
    .on("mouseover", function(d) {
      var _this = this;
      d3.selectAll("rect")
        .transition()
        .duration(200)
        .style("opacity", function() {
          return (this === _this) ? 1.0 : 0.6;
        });
    })
  .on("mouseout", function(d) {
    d3.selectAll("rect")
      .transition()
      .duration(500)
      .style("opacity", 1);
  })
  .on("click", function(d) {
    appendPlayerInfo(this, d)
  })

  // Player names
  cell.append("text")
    .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    .append("tspan")
    .attr("x", 8)
    .attr("y", 8)
    .attr("dy", ".8em")
    .attr("class", "playerNames")
    .text(function(d) {
      // Only display text if sibling <rect> element is wide enough
      var parentRect = this.parentNode.previousElementSibling;
      if (d3.select(parentRect).classed("wide")) { return d.data.name; }
    })

  cell.append("text")
    .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    .append("tspan")
    .attr("x", 8)
    .attr("y", 20)
    .attr("dy", "1.2em")
    .attr("class", "playerNamesFee")
    .text(function(d) {
      // Only display text if sibling <rect> element is wide enough
      var parentRect = this.parentNode.parentNode.firstElementChild;
      if (d3.select(parentRect).classed("wide")) { return "£" + d.data.fee.split(".")[0] + "m"; }

    })

  // 💩 Manual labelling
  var key = [
    { "name": "Europe", "color": "#254251"},
    { "name": "Britain", "color": "#E0AB26"},
    { "name": "Africa", "color": "#3292A6"},
    { "name": "S. America", "color": "#F37F2F"},
  ];

  var legendx = (config.width < 400) ? 10 : width+10;
  var legendy = (config.width < 400) ? 310 : 10;
  var legendheight = (config.width < 400) ? 10 : 20;

  // Create a legend element
  var legend = container.append("g")
    .attr("class", "legendContainer")
    .selectAll("g")
    .data(key)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      var leftmargin = 0;
      var topmargin = 0;
      var x = leftmargin + legendx ;
      var y = i * legendheight + legendy + topmargin;
      return "translate(" + x + "," + y + ")";
    })

  var legendTitle = container.append("g")
    .attr("class", "legendTitle")
    .attr("transform", function(d, i) {
      var height = 20;
      var x = legendx;
      var y = i * height + legendy;
      return "translate(" + x + "," + y + ")";
    });

  legendTitle.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .text("Key");

  legend.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("transform", "translate(0,30)")
    .style("fill", function(d) { return d.color; })
    .style("stroke", function(d) { return d.color; });

  legend.append("text")
    .attr("x", 20)
    .attr("y", 40)
    .style("color", "#666666")
    .style("fill", "#666666")
    .text(function(d) { return d.name; });

  var linewidth = (config.width < 400) ? width-20 : 100;
  var lineheight = (config.width < 400) ? 90 : 110;
  legendTitle.append("line")
    .attr("x1", 0)
    .attr("x2", linewidth)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke-width", 2)
    .attr("stroke", "#ddd");
  legendTitle.append("line")
    .attr("x1", 0)
    .attr("x2", linewidth)
    .attr("y1", lineheight)
    .attr("y2", lineheight)
    .attr("stroke-width", 2)
    .attr("stroke", "#ddd");

  // Create a legend element
  var titleheight = (config.width < 400) ? 0 : height;
  var titlemargin = (config.width < 400) ? 0 : 30;
  var playerInfo = svg.append("g")
    .attr("class", "playerInfoContainer")
    .selectAll("g")
    .data(key)
    .enter().append("g")
    .attr("class", "playerInfo")
    .attr("transform", function(d, i) {
      var height = 20;
      var x = legendx;
      var y = i * titleheight + 10;
      return "translate(" + x + "," + y + ")";
    })

  var playerInfoTitle = svg.append("g")
    .attr("class", "playerInfoTitle")
    .attr("transform", function(d, i) {
      var height = 20;
      var x = legendx;
      var y = titleheight*0.3 + titlemargin;
      return "translate(" + x + "," + y + ")";
    });

  playerInfoTitle.append("text")
    .attr("x", 0)
    .attr("y", 0)

    var playerInfo = svg.append("g")
    .attr("class", "playerInfo")
    .attr("transform", function(d, i) {
      var height = 20;
      var x = legendx;
      var y = titleheight*0.3 + titlemargin + 30;
      return "translate(" + x + "," + y + ")";
    });

  var introy = (config.width < 400) ? -20 : 10;
  playerInfo.append("text")
    .attr("class", function() {
      if(config.width < 400) {
        return "playerInfo mobile";
      } else {
        return "playerInfo";
      }
    })
  .attr("x", 0)
    .attr("y", introy)
    .tspans(function() {
      if (config.width > 400) {
        return d3.wordwrap('Tap an area for more information', 15)
      } else {
        return d3.wordwrap('Tap an area for more information', 40)
      }
    })


  // Appends player info on click on a rect
  var _this = this;
  function appendPlayerInfo(obj, data) {
    playerInfoTitle.html("");
    playerInfo.html("");

    playerInfo.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("class", "playerInfo");

    playerInfoTitle.append("text")
      .attr("y", (window.innerWidth < 520) ? 20 : 0)
      .text("£" + data.data.fee.split(".")[0] + "m")
      playerInfo.append("text")
      .attr("y", (window.innerWidth < 520) ? 10 : -25)
      .tspans(function() {
        var name = data.data.name;
        return d3.wordwrap(name + " " + data.data.fromto, 15);
        })
      .attr("dy", function(d, i) { return i+1 * 15})

  }
})

function sumBySize(d) {
  return d.fee;
}

