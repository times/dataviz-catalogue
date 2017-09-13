var config = {
  width: 800,
  height: 600,
  rows: 10,
  columns: 35,
};

var data = [
  { party: 'Left', color: '#8C3473', seats: '64', percent: '8.6' },
  { party: 'SPD', color: '#EB001F', seats: '193', percent: '25.7' },
  { party: 'Greens', color: '#58AB27', seats: '63', percent: '8.4' },
  { party: 'CDU', color: '#000000', seats: '253', percent: '34.1' },
  { party: 'Ind', color: '#DDDDDD', seats: '1', percent: '37.2' },
  { party: 'CSU', color: '#0188ca', seats: '56', percent: '7.4' },
];
var flatData = [];
data.map(d => {
  for (let i = 0; i < d.seats; i++) {
    flatData.push({ party: d.party, color: d.color });
  }
});

var svg = d3
  .select('#chart')
  .at({
    width: config.width,
    height: config.height,
    id: 'chart',
  })
  .st({ backgroundColor: '#F8F7F1' })
  .append('g')
  .translate([config.width / 2, config.height / 2]);

var layout = d3_iconarray
  .layout()
  .height(config.rows)
  .width(config.columns)
  .widthFirst(false);
var distanceScale = d3
  .scaleLinear()
  .domain([0, layout.height()])
  .range([100, 250]);
var angleScale = d3
  .scaleLinear()
  .domain([0, layout.width()])
  .range([-210, -75]);

var iconArray = layout(flatData);

svg
  .selectAll('circle')
  .data(iconArray)
  .enter()
  .append('circle')
  .at({
    r: 4,
    fill: d => d.data.color,
  })
  .attr('transform', function(d, i) {
    const rotation = angleScale(d.position.x);
    const distance = distanceScale(d.position.y);
    if (i < 315) {
      return 'rotate(' + rotation + ') translate(' + distance + ',-5)';
    } else {
      return 'rotate(' + rotation + ') translate(' + distance + ',5)';
    }
  });
