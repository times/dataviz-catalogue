// set config object
const config = { width: 700, height: 450 };
const margin = { top: 20, left: 20, right: 150 };
const width = config.width - margin.left - margin.right,
  height = config.height - margin.top;

d3.select('#times-treemap').html('');

const svg = d3.select('#times-treemap').at({
  width: config.width,
  height: config.height,
});

// construct an ordinal scale from our colour palette
const timesColors = ['#254251', '#E0AB26', '#F37F2F', '#3292A6', '#6c3c5e'];
const color = d3.scaleOrdinal(timesColors);
const format = d3.format(',d');

d3.json('data.json', function(err, dataset) {
  const treemap = d3
    .treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .round(true)
    .paddingOuter(2)
    .paddingInner(1);

  const root = d3
    .hierarchy(dataset)
    .eachBefore(
      d => (d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name)
    )
    .sum(sumBySize)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  treemap(root);

  // One cell per player
  const container = svg.append('g').at({ class: 'container' });

  const cell = container
    .selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g')
    .translate(d => [d.x0, d.y0]);

  cell
    .append('rect')
    .at({
      id: d => d.data.id,
      class: d => {
        if (d.x1 - d.x0 > 120 && d.y1 - d.y0 > 40) {
          return 'wide';
        }
      },
      width: d => d.x1 - d.x0,
      height: d => d.y1 - d.y0,
      fill: d => color(d.parent.data.id),
    })
    .on('mouseover', function(d) {
      var _this = this;
      d3
        .selectAll('rect')
        .transition()
        .duration(200)
        .style('opacity', function() {
          return this === _this ? 1.0 : 0.6;
        });
    })
    .on('mouseout', function(d) {
      d3.selectAll('rect').transition().duration(500).style('opacity', 1);
    })
    .on('click', function(d) {
      appendPlayerInfo(this, d);
    });

  // Player names
  cell
    .append('text')
    .attr('clip-path', d => 'url(#clip-' + d.data.id + ')')
    .append('tspan')
    .at({
      x: 8,
      y: 8,
      dy: '.8em',
      class: 'playerNames',
    })
    .text(function(d) {
      // Only display text if sibling <rect> element is wide enough
      var parentRect = this.parentNode.previousElementSibling;
      if (d3.select(parentRect).classed('wide')) {
        return d.data.name;
      }
    });

  cell
    .append('text')
    .attr('clip-path', function(d) {
      return 'url(#clip-' + d.data.id + ')';
    })
    .append('tspan')
    .at({
      x: 8,
      y: 20,
      dy: '1.2em',
      class: 'playerNamesFee',
    })
    .text(function(d) {
      // Only display text if sibling <rect> element is wide enough
      var parentRect = this.parentNode.parentNode.firstElementChild;
      if (d3.select(parentRect).classed('wide')) {
        return '£' + d.data.fee.split('.')[0] + 'm';
      }
    });

  // 💩 Manual labelling
  const key = [
    { name: 'Europe', color: '#254251' },
    { name: 'Britain', color: '#E0AB26' },
    { name: 'Africa', color: '#3292A6' },
    { name: 'S. America', color: '#F37F2F' },
  ];

  const legendx = width + 10;
  const legendy = 10;
  const legendheight = 20;

  // Create a legend element
  const legend = container
    .append('g')
    .at({ class: 'legendContainer' })
    .selectAll('g')
    .data(key)
    .enter()
    .append('g')
    .at({ class: 'legend' })
    .attr('transform', (d, i) => {
      var leftmargin = 0;
      var topmargin = 0;
      var x = leftmargin + legendx;
      var y = i * legendheight + legendy + topmargin;
      return 'translate(' + x + ',' + y + ')';
    });

  const legendTitle = container
    .append('g')
    .at({ class: 'legendTitle' })
    .attr('transform', function(d, i) {
      var height = 20;
      var x = legendx;
      var y = i * height + legendy;
      return 'translate(' + x + ',' + y + ')';
    });

  legendTitle.append('text').at({ x: 0, y: 20 }).text('Key');

  legend
    .append('rect')
    .at({
      width: 10,
      height: 10,
    })
    .translate([0, 30])
    .st({
      fill: d => d.color,
      stroke: d => d.color,
    });

  legend
    .append('text')
    .at({
      x: 20,
      y: 40,
    })
    .st({ color: '#666', fill: '#666' })
    .text(d => d.name);

  const linewidth = config.width < 400 ? width - 20 : 100;
  const lineheight = config.width < 400 ? 90 : 110;
  legendTitle.append('line').at({
    x1: 0,
    x2: linewidth,
    y1: 0,
    y2: 0,
    strokeWidth: 2,
    stroke: '#ddd',
  });
  legendTitle.append('line').at({
    x1: 0,
    x2: linewidth,
    y1: lineheight,
    y2: lineheight,
    strokeWidth: 2,
    stroke: '#ddd',
  });

  // Create a legend element
  const titleheight = height;
  const titlemargin = 30;
  var playerInfo = svg
    .append('g')
    .attr('class', 'playerInfoContainer')
    .selectAll('g')
    .data(key)
    .enter()
    .append('g')
    .attr('class', 'playerInfo')
    .attr('transform', function(d, i) {
      var height = 20;
      var x = legendx;
      var y = i * titleheight + 10;
      return 'translate(' + x + ',' + y + ')';
    });

  var playerInfoTitle = svg
    .append('g')
    .attr('class', 'playerInfoTitle')
    .attr('transform', function(d, i) {
      var height = 20;
      var x = legendx;
      var y = titleheight * 0.3 + titlemargin;
      return 'translate(' + x + ',' + y + ')';
    });

  playerInfoTitle.append('text').attr('x', 0).attr('y', 0);

  var playerInfo = svg
    .append('g')
    .attr('class', 'playerInfo')
    .attr('transform', function(d, i) {
      var height = 20;
      var x = legendx;
      var y = titleheight * 0.3 + titlemargin + 30;
      return 'translate(' + x + ',' + y + ')';
    });

  playerInfo
    .append('text')
    .at({
      class: 'playerInfo',
      x: 0,
      y: 10,
    })
    .tspans(function() {
      return d3.wordwrap('Tap an area for more information', 40);
    });

  // Appends player info on click on a rect
  const appendPlayerInfo = (obj, data) => {
    playerInfoTitle.html('');
    playerInfo.html('');

    playerInfo.append('text').at({ x: 0, y: 0, class: 'playerInfo' });

    playerInfoTitle
      .append('text')
      .at({ y: 0 })
      .text('£' + data.data.fee.split('.')[0] + 'm');
    playerInfo
      .append('text')
      .at({ y: -25 })
      .tspans(function() {
        var name = data.data.name;
        return d3.wordwrap(name + ' ' + data.data.fromto, 15);
      })
      .attr('dy', (d, i) => i + 1 * 15);
  };
});

const sumBySize = d => d.fee;
