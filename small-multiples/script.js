/*
 * Sample dataset
 */
const dataset = [];
const labels = ['rock', 'pop', 'electro', 'world', 'folk', 'hip hop'];
labels.map(function(symbol) {
  for (var i = 2008; i < 2017; i++) {
    dataset.push({
      symbol: symbol,
      date: i,
      price: Math.floor(Math.random() * 80) + 1,
    });
  }
});

const width = document
  .getElementsByClassName('container')[0]
  .getBoundingClientRect().width;
const config = {
  parseDate: d3.timeParse('%Y'),
  chartWidth: width < 450 ? width * 0.7 : width / 3,
  chartHeight: 100,
  chartMargin: { top: 20, right: 0, bottom: 10, left: 20 },
  area: d3.area().curve(d3.curveStep),
  line: d3.line().curve(d3.curveStep),
  xScale: d3.scaleTime(),
  yScale: d3.scaleLinear(),
};

const usableWidth =
  config.chartWidth - config.chartMargin.left - config.chartMargin.right;
const usableHeight =
  config.chartHeight - config.chartMargin.top - config.chartMargin.bottom;

const symbols = d3
  .nest()
  .key(d => d.symbol)
  .entries(dataset);

// this function appends an SVG and a mini chart to a div
function makeSmallChart(d, i) {
  const { values } = d;
  const xScale = config.xScale
    .domain(d3.extent(values, d => d.date))
    .range([0, usableWidth]);

  const yScale = config.yScale
    .domain(d3.extent(values, d => d.price))
    .range([usableHeight, 0]);

  const line = config.line.x(d => xScale(d.date)).y(d => yScale(d.price));
  const area = config.area
    .x(d => xScale(d.date))
    .y1(d => yScale(d.price))
    .y0(yScale(0));

  const chart = d3
    .select(this)
    .append('svg')
    .at({ width: config.chartWidth, height: config.chartHeight })
    .append('g')
    .translate([config.chartMargin.left, config.chartMargin.top]);

  chart.append('path').at({ d: area(d.values), class: 'area' });
  chart.append('path').at({
    d: line(d.values),
    class: 'line',
  });
}

d3
  .select('.container')
  .selectAll('.chart')
  .data(symbols)
  .enter()
  .append('div')
  .attr('class', 'chart')
  .each(makeSmallChart);
