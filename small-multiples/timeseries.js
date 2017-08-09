function timeSeriesChart() {
  var margin = { top: 20, right: 20, bottom: 20, left: 20 },
    //width = 200,
    //height = 120,
    xValue = function(d) {
      return d[0];
    },
    yValue = function(d) {
      return d[1];
    },
    xScale = d3.scaleTime(),
    yScale = d3.scaleLinear(),
    xAxis = d3.axisBottom().scale(xScale).tickSize(6, 0),
    area = d3.area().x(X).y1(Y).curve(d3.curveStep),
    line = d3.line().x(X).y(Y).curve(d3.curveStep),
    values = function(d) {
      return d;
    },
    title = null,
    titleX = -30,
    titleY = 25,
    xExtent = null;

  function chart(selection) {
    selection.each(function(d) {
      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      var data = values(d).map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      // Update the x-scale.
      xScale
        .domain(
          xExtent ||
            d3.extent(data, function(d) {
              return d[0];
            })
        )
        .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      yScale
        .domain([
          0,
          d3.max(data, function(d) {
            return d[1];
          }),
        ])
        .range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll('svg').data([data]);
      var svgEnter = svg.enter().append('svg');

      // Otherwise, create the skeletal chart.
      var gEnter = svgEnter.append('g');
      gEnter.append('text').attr('class', 'title');
      gEnter.append('path').attr('class', 'area');
      gEnter.append('path').attr('class', 'line');
      gEnter.append('g').attr('class', 'x axis');

      // Update the outer dimensions.
      svg = svg.merge(svgEnter);
      svg.attr('width', width).attr('height', height);

      // Update the inner dimensions.
      var g = svg
        .select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // Update the area path.
      g.select('.area').attr('d', area.y0(yScale.range()[0]));

      // Update the line path.
      g.select('.line').attr('d', line);

      // Update the x-axis.
      g
        .select('.x.axis')
        .attr('transform', 'translate(0,' + yScale.range()[0] + ')')
        .call(xAxis.ticks(3));

      // Update the title.
      if (title) {
        g
          .select('.title')
          .attr('x', titleX)
          .attr('y', titleY)
          .attr('text-anchor', 'end')
          .text(title(d));
      }
    });
  }

  // The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(d[0]);
  }

  // The x-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    return yScale(d[1]);
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.values = function(_) {
    if (!arguments.length) return values;
    values = _;
    return chart;
  };

  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };

  chart.titleX = function(_) {
    if (!arguments.length) return titleX;
    titleX = _;
    return chart;
  };

  chart.titleY = function(_) {
    if (!arguments.length) return titleY;
    titleY = _;
    return chart;
  };

  chart.xExtent = function(_) {
    if (!arguments.length) return xExtent;
    xExtent = _;
    return chart;
  };

  return chart;
}
