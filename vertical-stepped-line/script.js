const annotations = [
  {
    value: -100,
    year: '2013/01',
    path: 'M93,-26L93,36',
    text: 'Arsenal buy Alexis Sánchez',
    textOffset: [-25, -35],
  },
];

// The config object passed by draw() gives us a width and height
const config = { width: 600, height: 450 };
const margin = { top: 30, right: 60, bottom: 0, left: 40 },
  width = config.width - margin.left - margin.right,
  height = config.height - margin.top - margin.bottom;

// Clean up SVG container before drawing
d3.select('#times-vertical-line').html('');

const svg = d3.select('#times-vertical-line').at({
  width: width,
  height: height,
});

// Date parser
const parseTime = d3.timeParse('%Y/%m');

// Scales
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleTime().range([height, 0]);

// Line declaration
const line = d3
  .line()
  .x(d => x(d.value))
  .y(d => y(d.year))
  .curve(d3.curveStepAfter);

// g is our container
const g = svg.append('g').translate([margin.left + 10, margin.top + 10]);

d3.json('data.json', function(err, dataset) {
  dataset.forEach(d => {
    d.year = parseTime(d.year);
    d.value = +d.value;
  });

  // Min, max values from dataset
  // or computed for each club
  const hardCordedDomain = [-140, 140];
  const clubDomain = [
    d3.min(dataset, d => d.value),
    d3.max(dataset, d => d.value),
  ];

  // Set domains
  // Fixed values x-axis
  x.domain(hardCordedDomain);
  y.domain(d3.extent(dataset, d => d.year).reverse());

  // X-axis
  g
    .append('g')
    .at({ class: 'axis axis--x' })
    .translate([30, height])
    .call(d3.axisBottom(x).ticks(10).tickSize(-height, 0, 0).tickPadding(10));

  // text label for the x axis
  g
    .append('text')
    .at({ class: 'label' })
    .translate([x(0), height + 50])
    .style('text-anchor', 'middle')
    .text('Season balance (£m)');
  g
    .append('text')
    .at({ class: 'label' })
    .translate([x(0) - 20, margin.top - 55])
    .style('text-anchor', 'middle')
    .text('⟵ Spent');
  g
    .append('text')
    .at({ class: 'label' })
    .translate([x(0) - 85, margin.top - 55])
    .style('text-anchor', 'middle')
    .text('Received ⟶');

  // Y-axis
  g.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(y));

  // Dashed line on the zero for reference
  // Created before the spending line so it"s under
  g
    .append('line')
    .at({
      class: 'zero',
      x1: x(0),
      y1: 0,
      x2: x(0),
      y2: height,
    })
    .translate([30, 0])
    .style('stroke', '#666');

  // Main spending line
  g
    .append('path')
    .datum(dataset)
    .at({ class: 'line', d: line })
    .translate([30, 0]);

  // Annotations
  var swoopy = d3
    .swoopyDrag()
    .x(d => x(d.value))
    .y(d => y(parseTime(d.year)))
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
