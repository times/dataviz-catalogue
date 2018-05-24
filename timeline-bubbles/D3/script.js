// set config object
const isMobile = window.innerWidth < 600 ? true : false;
const config = {
  width: 600,
  height: 350,
  mobileWidth: 300,
  mobileHeight: 300,
  ticksCount: 12,
  mobileTicksCount: 3,
  circleRadius: 70,
  mobileCircleRadius: 40,
  parseTime: d3.timeParse('%d/%m/%Y'),
  area: d3.scaleSqrt().domain([0, 200]),
  xScale: d3.scaleLinear(),
  bubbleOpacity: 0.2,
  get yTranslation() {
    return isMobile ? config.height / 4 : config.height / 2;
  },
};

const margin = { top: 40, right: 100, bottom: 30, left: 20 },
  width =
    (isMobile ? config.mobileWidth : config.width) - margin.left - margin.right,
  height =
    (isMobile ? config.mobileHeight : config.height) -
    margin.top -
    margin.bottom;

// Clean up before drawing
// By brutally emptying all HTML from plot container div
d3.select('#times-timeline').html('');

const svg = d3
  .select('#times-timeline')
  .at({
    width: isMobile ? config.mobileWidth : config.width,
    height: isMobile ? config.mobileHeight : config.height,
  })
  .st({ backgroundColor: '#F8F7F1' });

// g is our main container
const g = svg.append('g').translate([margin.left, margin.top]);

d3.json('data.json', (err, dataset) => {
  if (err) throw err;

  // Map over the data to process it, return a fresh copy, rather than mutating the original data
  const processedData = dataset.map(d =>
    Object.assign({}, d, { date: config.parseTime(d.Date) })
  );

  /*
   * Scales
   * note that we use give an area to d3's radius parameter
   */
  const area = config.area.range([
    3,
    isMobile ? config.mobileCircleRadius : config.circleRadius,
  ]);
  const x = config.xScale
    .range([0, width])
    .domain(d3.extent(processedData, d => d.date));

  // X-axis
  g
    .append('g')
    .translate([0, config.yTranslation])
    .call(
      d3
        .axisBottom(x)
        .ticks(isMobile ? config.mobileTicksCount : config.ticksCount)
        .tickFormat(d3.timeFormat('%d %b'))
        .tickSizeInner(70)
    );

  // Annotation layer
  const annotations = [
    {
      type: d3.annotation.annotationLabel,
      note: {
        title: 'Something something annotated',
        label: '',
        wrap: 130,
      },
      x: x(new Date('2017-08-07')),
      y: config.yTranslation,
      dy: isMobile ? -30 : -90,
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
    .call(makeAnnotations);

  /*
   * The little things:
   * by sorting this way, the largest bubbles are
   * always at the very back. not data is hidden.
   */
  processedData.sort((x, y) => d3.descending(x.Fee, y.Fee));

  let circles = g.selectAll('circle').data(processedData);
  circles
    .enter()
    .append('circle')
    .at({
      class: 'circle',
      cx: d => x(d.date),
      cy: config.yTranslation,
    })
    .transition()
    .attr('r', d => area(d.Fee))
    .st({ opacity: config.bubbleOpacity });
});
