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

const parseDate = d3.timeParse('%Y');

const chart = timeSeriesChart()
  .x(d => parseDate(d.date))
  .y(d => +d.price)
  .width(200)
  .height(100)
  .values(d => d.values)
  .margin({ top: 20, right: 20, bottom: 20, left: 10 });

chart.xExtent(d3.extent(dataset, chart.x()));

var symbols = d3.nest().key(d => d.symbol).entries(dataset);

d3
  .select('.container')
  .selectAll('.chart')
  .data(symbols)
  .enter()
  .append('div')
  .attr('class', 'chart')
  .call(chart);
