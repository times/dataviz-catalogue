var dataset = [];
var labels = ['rock', 'pop', 'electro', 'world', 'folk', 'hip hop'];
labels.map(function(symbol) {
  for (var i = 2008; i < 2017; i++) {
    dataset.push({
      symbol: symbol,
      date: i,
      price: Math.floor(Math.random() * 80) + 1,
    });
  }
});

var parseDate = d3.timeParse('%Y');

var chart = timeSeriesChart()
  .x(function(d) {
    return parseDate(d.date);
  })
  .y(function(d) {
    return +d.price;
  })
  .width(200)
  .height(100)
  .values(function(d) {
    return d.values;
  })
  //.title(d => d.key)
  .margin({ top: 20, right: 20, bottom: 20, left: 10 });

chart.xExtent(d3.extent(dataset, chart.x()));

var symbols = d3
  .nest()
  .key(function(d) {
    return d.symbol;
  })
  .entries(dataset);

d3
  .select('.container')
  .selectAll('.chart')
  .data(symbols)
  .enter()
  .append('div')
  .attr('class', 'chart')
  .call(chart);
