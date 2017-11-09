d3.json('index.json', function(error, imgs) {
  var body = d3.select('#container');
  var divs = body
    .selectAll('div')
    .data(imgs)
    .enter()
    .append('div')
    .attr('class', 'item');

  divs
    .append('div')
    .text(function(d) {
      return d.title;
    })
    .attr('class', 'chartTitle');

  var links = divs
    .append('a')
    .attr('href', function(d) {
      return d.url;
    })
    .append('img')
    .style('height', '200px')
    .attr('src', function(d) {
      return d.img;
    });
});
