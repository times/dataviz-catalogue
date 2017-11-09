// set config object
const config = {
  width: 600,
  height: 350,
  ticksCount: 12,
  circleRadius: 70,
};

const margin = { top: 40, right: 50, bottom: 30, left: 20 },
  width = config.width - margin.left - margin.right,
  height = config.height - margin.top - margin.bottom;

// Clean up before drawing
// By brutally emptying all HTML from plot container div
d3.select('#times-timeline').html('');

const svg = d3
  .select('#times-timeline')
  .at({
    width: config.width,
    height: config.height,
  })
  .st({ backgroundColor: '#F8F7F1' });

// g is our main container
const g = svg.append('g').translate([margin.left, margin.top]);

d3.json('data.json', (err, dataset) => {
  if (err) {
    console.log(err);
  }

  // Constrain to dates
  const parseTime = d3.timeParse('%d/%m/%Y');
  // Map over the data to process it, return a fresh copy, rather than mutating the original data
  const processedData = dataset.map(d =>
    Object.assign({}, d, { date: parseTime(d.Date) })
  );

  /*
   * Scales
   * note that we use give an area to d3's radius parameter
   */
  const area = d3.scaleSqrt().range([3, config.circleRadius]).domain([0, 200]);
  const x = d3
    .scaleLinear()
    .range([0, width])
    .domain([0, processedData.length]);
  x.domain(d3.extent(processedData, d => d.date));

  // X-axis
  g
    .append('g')
    .translate([0, height / 2])
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
  processedData.sort((x, y) => d3.descending(x.Fee, y.Fee));

  let circles = g.selectAll('circle').data(processedData);
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
    .attr('r', d => area(d.Fee))
    .st({ opacity: 0.2 });
});
