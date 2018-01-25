// set config object
const config = { width: 700, height: 450, blockWidth: 50 };

const margin = { top: 50, right: 40, bottom: 50, left: 60 },
  width = config.width - margin.left - margin.right,
  height = config.height - margin.top - margin.bottom;

// Clean up before drawing
// By brutally emptying all HTML from plot container div
d3.select('#times-palettes').html('');

const svg = d3.select('#times-palettes').at({
  width: config.width,
  height: config.height,
});

d3.json('palettes.json', (error, data) => {
  if (error) throw error;

  const palette = svg
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .translate((d, i) => [10, i * 150 + 50]);

  palette
    .append('text')
    .at({
      x: 0,
      y: 10,
      class: 'Headline paletteTitle',
    })
    .text(d => {
      console.log('d', d);
      return d.name;
    });

  const colour = palette
    .selectAll('rect')
    .data(d => d.colours)
    .enter()
    .append('g');

  colour
    .append('rect')
    .at({
      x: (d, i) => i * 60,
      y: 10,
      width: config.blockWidth,
      height: config.blockWidth,
    })
    .translate([0, 20])
    .style('fill', d => d.code);

  colour
    .append('text')
    .at({ x: (d, i) => i * 60, y: 0, class: 'label' })
    .text(d => d.label)
    .translate([0, config.blockWidth * 2 - 5]);
});
