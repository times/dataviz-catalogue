// set config object
const config = {
  width: 600,
  height: 400,
};

const dataModel = [
  {
    color: '#254251',
    number: 450,
  },
  {
    color: '#e0ab26',
    number: 100,
  },
  {
    color: '#ddd',
    number: 350,
  },
];

const margin = { top: 50, right: 100, bottom: 50, left: 100 },
  width = config.width - margin.left - margin.right,
  height = config.height - margin.top - margin.bottom;

// Clean up before drawing
// By brutally emptying all HTML from plot container div
d3.select('#times-waffle').html('');

const svg = d3
  .select('#times-waffle')
  .at({
    width: config.width,
    height: config.height,
  })
  .st({ backgroundColor: '#F8F7F1' });

// g is our main container
const g = svg.append('g').translate([margin.left, margin.top]);

let seats = [];
for (var i = 0; i < dataModel.length; i++) {
  for (var y = 0; y < dataModel[i].number; y++) {
    seats.push({ color: dataModel[i].color });
  }
}

const grid = d3.grid().points().size([width, height]).cols(30).rows(30);

const points = g.selectAll('.circles').data(grid(seats));
points
  .enter()
  .append('circle')
  .at({
    class: '.circles',
    cx: d => d.x,
    cy: d => d.y,
    r: 1e-6,
    fill: d => d.color,
  })
  .transition()
  .duration(100)
  .delay((d, i) => i * 3)
  .at({ r: 4 })
  .style('opacity', 1);

const yScale = d3.scalePoint().domain(d3.range(30)).range([height, 0]);
g
  .append('line')
  .attr('x1', -10)
  .attr('y1', yScale(10) - 5)
  .attr('x2', width + 10)
  .attr('y2', yScale(10) - 5)
  .attr('stroke', '#4d4d4d')
  .attr('stroke-width', '1px');
g
  .append('text')
  .attr('class', 'label')
  .attr('x', width + 20)
  .attr('y', yScale(10))
  .text('300 things')
  .attr('font-family', 'sans-serif')
  .attr('fill', '#4d4d4d')
  .style('opacity', '1');
