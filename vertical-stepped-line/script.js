// The config object passed by draw() gives us a width and height
const config = {
  width: 600,
  height: 550,
  mobileWidth: 300,
  mobileHeight: 300,
  parseTime: d3.timeParse('%Y/%m'),
  margin: { top: 30, right: 100, bottom: 100, left: 40 },
  xScale: d3.scaleLinear(),
  yScale: d3.scaleTime(),
  line: d3.line().curve(d3.curveStepAfter),
  xDomain: [-140, 140],
};
const isMobile = window.innerWidth < 600 ? true : false;
const usableWidth =
  (isMobile ? config.mobileWidth : config.width) -
  config.margin.left -
  config.margin.right;
const usableHeight =
  (isMobile ? config.mobileHeight : config.height) -
  config.margin.top -
  config.margin.bottom;

// Clean up SVG container before drawing
d3.select('#times-vertical-line').html('');

const svg = d3.select('#times-vertical-line').at({
  width: isMobile ? config.mobileWidth : config.width,
  height: isMobile ? config.mobileHeight : config.height,
});

// Line declaration
const line = config.line.x(d => x(d.value)).y(d => y(d.year));

// g is our container
const g = svg.append('g').translate([config.margin.left, config.margin.top]);

d3.json('data.json', (err, dataset) => {
  if (err) throw err;

  const processedData = dataset.map(d =>
    Object.assign({}, d, {
      year: config.parseTime(d.year),
      value: parseInt(d.value),
    })
  );

  // Min, max values from dataset
  // or computed for each club
  const clubDomain = [
    d3.min(processedData, d => d.value),
    d3.max(processedData, d => d.value),
  ];

  // Set scales
  // Fixed values x-axis
  const x = config.xScale.range([0, usableWidth]).domain(config.xDomain);

  const y = config.yScale
    .range([usableHeight, 0])
    .domain(d3.extent(processedData, d => d.year).reverse());

  // X-axis
  g
    .append('g')
    .at({ class: 'axis axis--x' })
    .translate([30, usableHeight])
    .call(
      d3
        .axisBottom(x)
        .ticks(isMobile ? 3 : 7)
        .tickSize(-usableHeight, 0, 0)
        .tickPadding(10)
    );

  // text label for the x axis
  g
    .append('text')
    .at({ class: 'label' })
    .translate([x(0), usableHeight + 50])
    .style('text-anchor', 'middle')
    .text('Season balance (£m)');
  g
    .append('text')
    .at({ class: 'label' })
    .translate([x(0) - 20, config.margin.top - 55])
    .style('text-anchor', 'middle')
    .text('⟵ Spent');
  g
    .append('text')
    .at({ class: 'label' })
    .translate([x(0) + 90, config.margin.top - 55])
    .style('text-anchor', 'middle')
    .text('Received ⟶');

  // Y-axis
  g
    .append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y).ticks(isMobile ? 5 : 10));

  // Dashed line on the zero for reference
  // Created before the spending line so it"s under
  g
    .append('line')
    .at({
      class: 'zero',
      x1: x(0),
      y1: 0,
      x2: x(0),
      y2: usableHeight,
    })
    .translate([30, 0])
    .style('stroke', '#666');

  // Main spending line
  g
    .append('path')
    .datum(processedData)
    .at({ class: 'line', d: line })
    .translate([30, 0]);

  // Annotation layer
  const annotations = [
    {
      type: d3.annotation.annotationLabel,
      note: {
        title: 'Arsenal buy Alexis Sánchez',
        label: '',
        wrap: 100,
      },
      x: x(-65.05),
      y: y(new Date('2014/01/01')),
      dy: -50,
      dx: 0,
    },
  ];

  // Include annotations
  const makeAnnotations = d3
    .annotation()
    .type(d3.annotationLabel)
    .annotations(annotations);
  g
    .append('g')
    .attr('class', 'annotation-group')
    .call(makeAnnotations)
    .translate([30, 0]);
});
