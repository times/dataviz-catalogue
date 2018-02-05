// set config object
const config = { width: 700, height: 900, blockWidth: 50 };

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

function onHover(duration, type) {
  return function() {
    if (type === 'mouseover') {
      d3
        .select(this)
        .transition()
        .duration(duration)
        .styleTween('opacity', () => d3.interpolate(1, 0.5))
        .attrTween('width', () =>
          d3.interpolate(config.blockWidth, config.blockWidth + 2)
        )
        .attrTween('height', () =>
          d3.interpolate(config.blockWidth, config.blockWidth + 2)
        )
        .at({
          rx: 30,
          ry: 30,
        });
    } else if (type === 'mouseout') {
      d3
        .select(this)
        .transition()
        .duration(duration)
        .styleTween('opacity', () => d3.interpolate(0.5, 1))
        .attrTween('width', () =>
          d3.interpolate(config.blockWidth + 2, config.blockWidth)
        )
        .attrTween('height', () =>
          d3.interpolate(config.blockWidth + 2, config.blockWidth)
        )
        .at({
          rx: 2,
          ry: 2,
        });
    } else if (type === 'click') {
      d3
        .select(this)
        .transition()
        .duration(duration)
        .style('opacity', 0.2)
        .transition()
        .duration(200)
        .style('opacity', 0.6);
    }
  };
}

const makePalette = container => {
  const colour = container
    .selectAll('rect')
    .data(d => d.colours)
    .enter()
    .append('g');

  colour
    .append('rect')
    .at({
      x: (d, i) => i * 60,
      y: 10,
      rx: 2,
      ry: 2,
      width: config.blockWidth,
      height: config.blockWidth,
      class: 'rect',
      dataClipboardText: d => d.code,
    })
    .translate([0, 20])
    .style('fill', d => d.code)
    .on('mouseover', onHover(100, 'mouseover'))
    .on('mouseout', onHover(200, 'mouseout'))
    .on('click', onHover(20, 'click'));

  colour
    .append('text')
    .at({ x: (d, i) => i * 60, y: 0, class: 'label' })
    .text(d => d.code.toString())
    .translate([0, config.blockWidth * 2 - 5]);

  colour
    .append('text')
    .at({ x: (d, i) => i * 60, y: 13, class: 'label name' })
    .text(d => d.label)
    .translate([0, config.blockWidth * 2 - 5]);
};

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
    .text(d => d.name);

  palette.call(makePalette(palette));
});

const clipboard = new Clipboard('.rect');
