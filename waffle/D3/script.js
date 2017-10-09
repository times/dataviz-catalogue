// set config object
var config = {
  width: 600,
  height: 400,
  ticksCount: 12,
  circleRadius: 70,
};

var margin = { top: 50, right: 100, bottom: 50, left: 100 },
  width = config.width - margin.left - margin.right,
  height = config.height - margin.top - margin.bottom;

// Clean up before drawing
// By brutally emptying all HTML from plot container div
d3.select('#times-waffle').html('');

var svg = d3
  .select('#times-waffle')
  .at({
    width: config.width,
    height: config.height,
  })
  .st({ backgroundColor: '#F8F7F1' });

// g is our main container
var g = svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var seats = [];
for (var i = 0; i < 100; i++) {
  seats.push({ highlight: true });
}
for (var i = 0; i < 550; i++) {
  seats.push({ highlight: false });
}

var grid = d3.grid().points().size([width, height]).cols(30).rows(25);

var points = g.selectAll('.exitpoint').data(grid(seats));
points
  .enter()
  .append('rect')
  .at({
    class: 'rect',
    x: function(d) {
      return d.x;
    },
    y: function(d) {
      return d.y;
    },
    width: 10,
    height: 10,
    fill: function(d) {
      if (d.highlight) {
        return '#254251';
      } else {
        return 'lightgrey';
      }
    },
  })
  .style('opacity', 1);
