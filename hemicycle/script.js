const config = {
  width: 800,
  height: 500,
  rows: 10,
  columns: 35,
  mobileRows: 10,
  mobileColumns: 35,
  mobileWidth: 300,
  mobileHeight: 400,
};
const isMobile = window.innerWidth < 600 ? true : false;

// Sample data: Bundestag election 2017 results
const data = [
  { party: 'Left', color: '#8C3473', seats: '64', percent: '8.6' },
  { party: 'SPD', color: '#EB001F', seats: '193', percent: '25.7' },
  { party: 'Greens', color: '#58AB27', seats: '63', percent: '8.4' },
  { party: 'CDU', color: '#000000', seats: '253', percent: '34.1' },
  { party: 'Ind', color: '#DDDDDD', seats: '1', percent: '37.2' },
  { party: 'CSU', color: '#0188ca', seats: '56', percent: '7.4' },
];
const flatData = [];
data.map(d => {
  for (let i = 0; i < d.seats; i++) {
    flatData.push({ party: d.party, color: d.color });
  }
});

const svg = d3
  .select('#chart')
  .at({
    width: isMobile ? config.mobileWidth : config.width,
    height: isMobile ? config.mobileHeight : config.height,
    id: 'chart',
  })
  .st({ backgroundColor: '#F8F7F1' })
  .append('g')
  .translate(
    isMobile
      ? [config.mobileWidth / 2, config.mobileHeight / 2 + 50]
      : [config.width / 2, config.height / 2 + 50]
  );

// Setup for hemicycle layout: essentially a matrix at an angle
const layout = d3_iconarray
  .layout()
  .height(isMobile ? config.mobileRows : config.rows)
  .width(isMobile ? config.mobileColumns : config.columns)
  .widthFirst(false);
const distanceScale = d3
  .scaleLinear()
  .domain([0, layout.height()])
  .range(isMobile ? [30, 150] : [100, 250]);
const angleScale = d3
  .scaleLinear()
  .domain([0, layout.width()])
  .range([-210, -75]);

const iconArray = layout(flatData);

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
