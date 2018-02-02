d3.json('index.json', (error, imgs) => {
  if (error) {
    console.log(error);
    return;
  }

  const body = d3.select('#container');
  const divs = body
    .selectAll('div')
    .data(imgs)
    .enter()
    .append('div')
    .attr('class', 'item');

  divs
    .append('div')
    .text(d => d.title)
    .attr('class', 'chartTitle');

  const links = divs
    .append('a')
    .attr('href', d => d.url)
    .append('img')
    .style('height', '200px')
    .attr('src', d => d.img);
});
