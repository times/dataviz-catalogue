(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports, require('d3-scale'))
    : typeof define === 'function' && define.amd
      ? define(['exports', 'd3-scale'], factory)
      : factory((global.d3_iconarray = global.d3_iconarray || {}), global.d3);
})(this, function(exports, d3) {
  'use strict';

  function iconArrayLayout() {
    var width = undefined;
    var height = undefined;
    var widthFirst = true;
    var maxDimension = undefined;

    function layout(data) {
      setDimensions(data.length);

      return data.map(function(d, i) {
        return {
          data: d,
          position: position(i),
        };
      });
    }

    function position(i) {
      if (widthFirst) {
        return {
          x: i % width,
          y: Math.floor(i / width),
        };
      } else {
        return {
          x: Math.floor(i / height),
          y: i % height,
        };
      }
    }

    function setDimensions(l) {
      //neither width or height is defined
      if (isNaN(width) && isNaN(height)) {
        console.log('no width or height');
        if (widthFirst) {
          width = Math.ceil(Math.sqrt(l));
          height = Math.ceil(l / width);
        } else {
          height = Math.ceil(Math.sqrt(l));
          width = Math.ceil(l / height);
        }
      } else if (isNaN(width)) {
        //width undefined
        width = Math.ceil(l / height);
      } else if (isNaN(height)) {
        //height undefined
        height = Math.ceil(l / width);
      }
    }

    layout.position = function(x) {
      return position(x);
    };

    layout.width = function(x) {
      if (x === undefined) return width;
      width = x;
      return layout;
    };

    layout.height = function(x) {
      if (x === undefined) return height;
      height = x;
      return layout;
    };

    layout.widthFirst = function(b) {
      if (b === undefined) return widthFirst;
      widthFirst = b;
      return layout;
    };

    return layout;
  }

  exports.layout = iconArrayLayout;
});
