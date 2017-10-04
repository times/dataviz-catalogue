// set config object
var config = {
  width: 600,
  height: 350,
  ticksCount: 12,
  circleRadius: 70,
};

var margin = { top: 40, right: 50, bottom: 30, left: 20 },
  width = config.width - margin.left - margin.right,
  height = config.height - margin.top - margin.bottom;

// Clean up before drawing
// By brutally emptying all HTML from plot container div
d3.select('#times-timeline').html('');

var svg = d3
  .select('#times-timeline')
  .at({
    width: config.width,
    height: config.height,
  })
  .st({ backgroundColor: '#F8F7F1' });

// g is our main container
var g = svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json('data.json', function(err, dataset) {
  // Constrain to dates
  var parseTime = d3.timeParse('%d/%m/%Y');
  dataset.forEach(d => {
    d.date = parseTime(d.Date);
  });

  /*
   * Scales
   * note that we use give an area to d3's radius parameter
   */
  var area = d3.scaleSqrt().range([3, config.circleRadius]).domain([0, 200]);
  var x = d3.scaleLinear().range([0, width]).domain([0, dataset.length]);
  x.domain(
    d3.extent(dataset, function(d) {
      return d.date;
    })
  );

  // X-axis
  g
    .append('g')
    .attr('transform', 'translate(0,' + height * 0.5 + ')')
    .call(
      d3
        .axisBottom(x)
        .ticks(config.ticksCount)
        .tickFormat(d3.timeFormat('%d %b'))
        .tickSizeInner(70)
    );

  /*
   * The little things:
   * by sorting this way, the largest bubbles are
   * always at the very back. not data is hidden.
   */
  dataset.sort(function(x, y) {
    return d3.descending(x.Fee, y.Fee);
  });

  let circles = g.selectAll('circle').data(dataset);
  circles
    .enter()
    .append('circle')
    .at({
      class: 'circle',
      cx: function(d) {
        return x(d.date);
      },
      cy: height * 0.5,
    })
    .transition()
    .attr('r', function(d) {
      return area(d.Fee);
    })
    .st({ opacity: 0.2 });
});
