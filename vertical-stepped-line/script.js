var annotations = [
  {
    value: -100,
    year: '2013/01',
    path: 'M93,-26L93,36',
    text: 'Arsenal buy Alexis Sánchez',
    textOffset: [-25, -35],
  },
];

// The config object passed by draw() gives us a width and height
var config = { width: 600, height: 450 };
var margin = { top: 30, right: 60, bottom: 50, left: 40 },
  width = config.width - margin.left - margin.right,
  height = config.height - margin.top - margin.bottom;

// Clean up SVG container before drawing
d3.select('#times-vertical-line').html('');

var svg = d3
  .select('#times-vertical-line')
  .attr('width', width)
  .attr('height', height);

// Date parser
var parseTime = d3.timeParse('%Y/%m');

// Scales
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleTime().range([height, 0]);

// Line declaration
var line = d3
  .line()
  .x(function(d) {
    return x(d.value);
  })
  .y(function(d) {
    return y(d.year);
  })
  .curve(d3.curveStepAfter);

// g is our container
var g = svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json('data.json', function(err, dataset) {
  dataset.forEach(function(d) {
    d.year = parseTime(d.year);
    d.value = +d.value;
  });

  // Min, max values from dataset
  // or computed for each club
  var hardCordedDomain = [-140, 140];
  var clubDomain = [
    d3.min(dataset, function(d) {
      return d.value;
    }),
    d3.max(dataset, function(d) {
      return d.value;
    }),
  ];

  // Set domains
  // Fixed values x-axis
  x.domain(hardCordedDomain);
  y.domain(
    d3
      .extent(dataset, function(d) {
        return d.year;
      })
      .reverse()
  );

  // X-axis
  g
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(30, ' + height + ' )')
    .call(d3.axisBottom(x).ticks(10).tickSize(-height, 0, 0).tickPadding(10));

  // text label for the x axis
  g
    .append('text')
    .attr('class', 'label')
    .attr('transform', 'translate(' + x(0) + ' ,' + (height + 50) + ')')
    .style('text-anchor', 'middle')
    .text('Season balance (£m)');
  g
    .append('text')
    .attr('class', 'label')
    .attr(
      'transform',
      'translate(' + (x(0) - 20) + ' ,' + (margin.top - 55) + ')'
    )
    .style('text-anchor', 'middle')
    .text('⟵ Spent');
  g
    .append('text')
    .attr('class', 'label')
    .attr(
      'transform',
      'translate(' + (x(0) + 85) + ' ,' + (margin.top - 55) + ')'
    )
    .style('text-anchor', 'middle')
    .text('Received ⟶');

  // Y-axis
  g.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(y));

  // Dashed line on the zero for reference
  // Created before the spending line so it"s under
  g
    .append('line')
    .attr('class', 'zero')
    .attr('x1', x(0))
    .attr('y1', 0)
    .attr('x2', x(0))
    .attr('y2', height)
    .style('stroke', '#666')
    .attr('transform', 'translate(30,0)');

  // Main spending line
  g
    .append('path')
    .datum(dataset)
    .attr('class', 'line')
    .attr('transform', 'translate(30,0)')
    .attr('d', line);

  // Annotations
  var swoopy = d3
    .swoopyDrag()
    .x(function(d) {
      return x(d.value);
    })
    .y(function(d) {
      return y(parseTime(d.year));
    })
    //.draggable(true)
    .annotations(annotations);

  var swoopySel = g.append('g').attr('class', 'swoop').call(swoopy);

  // SVG arrow marker fix
  svg
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '-10 -10 20 20')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('circle')
    .attr('r', '6')
    .style('fill', '#F37F2F');
  swoopySel.selectAll('path').attr('marker-start', 'url(#arrow)');
});
