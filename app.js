// Generated by CoffeeScript 1.6.3
(function() {
  var k, kdTree, _dot,
    __slice = [].slice;

  d3.json('data.json', function(data) {
    var activate, axes, dim, ex, ey, field, g, getX, getY, layout, links, mx, my, nodes, partitionEnd, partitionStart, partitions, r, rect, svg, tree, x, _ref, _ref1, _ref2;
    if ((data != null) && data.length) {
      tree = kdTree(data);
      layout = d3.layout.tree();
      dim = [288, 240];
      activate = function() {
        var b, container, selectors, _i;
        selectors = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), container = arguments[_i++], b = arguments[_i++];
        return function(d) {
          var id, queries, sel, selector, _ref;
          id = ((_ref = d.value) != null ? _ref.id : void 0) || d.id;
          queries = (function() {
            var _j, _len, _results;
            _results = [];
            for (_j = 0, _len = selectors.length; _j < _len; _j++) {
              selector = selectors[_j];
              _results.push("" + selector + "[data-id=\"" + id + "\"]");
            }
            return _results;
          })();
          return sel = (d3.selectAll("" + (queries.join(', ')) + ", " + container)).classed('active', b);
        };
      };
      nodes = layout(tree);
      links = ((((((d3.select('g.tree')).append('svg:g')).classed('links', true)).selectAll('line.link')).data(layout.links(nodes))).enter()).append('svg:line');
      links.attr('x1', function(d) {
        return dim[0] * d.source.x;
      });
      links.attr('y1', function(d) {
        return dim[1] * d.source.y;
      });
      links.attr('x2', function(d) {
        return dim[0] * d.target.x;
      });
      links.attr('y2', function(d) {
        return dim[1] * d.target.y;
      });
      svg = d3.select('svg');
      g = (((((((d3.select('g.tree')).selectAll('g.node')).data(nodes)).enter()).append('svg:g')).classed('node', true)).attr('data-id', function(d) {
        return d.value.id;
      })).attr('transform', function(d) {
        return "translate(" + (dim[0] * d.x) + "," + (dim[1] * d.y) + ")";
      });
      (g.append('svg:circle')).attr('r', 12);
      ((g.append('svg:text')).classed('label', true)).text(function(d, i) {
        return d.value.id;
      });
      ((g.append('svg:text')).classed('coords', true)).text(function(d) {
        var i, v, x;
        v = (function() {
          var _results;
          _results = [];
          for (i in (x = d.value.x)) {
            _results.push(x[i].toFixed(2));
          }
          return _results;
        })();
        return "(" + (v.join(',')) + ")";
      });
      g.on('mouseover', activate('.point', '.partitions line', '.field', true));
      g.on('mouseout', activate('.point', '.partitions line', '.field', false));
      field = d3.select('g.field');
      x = ((d3.scale.linear()).domain([-4, 4])).rangeRound([-480, 480]);
      _ref = [
        (function(d) {
          return d.x[0];
        }), (function(d) {
          return d.x[1];
        })
      ], getX = _ref[0], getY = _ref[1];
      _ref1 = [d3.mean(data, getX), d3.extent(data, getX)], mx = _ref1[0], ex = _ref1[1];
      _ref2 = [d3.mean(data, getY), d3.extent(data, getY)], my = _ref2[0], ey = _ref2[1];
      ((((svg.select('.field > rect')).attr('x', x(ex[0]))).attr('y', x(ey[0]))).attr('width', x(ex[1] - ex[0]))).attr('height', x(ey[1] - ey[0]));
      r = 8;
      axes = (field.append('svg:g')).classed("axes", true);
      (axes.append('svg:circle')).attr('r', x(1));
      ((axes.append('svg:line')).attr('x1', -2 - r + x(ex[0]))).attr('x2', 2 + r + x(ex[1]));
      ((axes.append('svg:line')).attr('y1', -2 - r + x(ey[0]))).attr('y2', 2 + r + x(ey[1]));
      partitionStart = function(k, ek) {
        return function(d) {
          var _ref3;
          if (d.depth % 2 === k) {
            return 0.5 + x(d.value.x[k]);
          } else {
            return x(((_ref3 = d.parent) != null ? _ref3.value.x[k] : void 0) || ek[0]);
          }
        };
      };
      partitionEnd = function(k, ek) {
        return function(d) {
          var e, gp, p, vd, vgp, vp, _ref3, _ref4, _ref5, _ref6;
          if (d.depth % 2 === k) {
            return 0.5 + x(d.value.x[k]);
          } else {
            _ref4 = [d.value.x[k], ((_ref3 = (p = d.parent)) != null ? _ref3.value.x[k] : void 0) || -Infinity], vd = _ref4[0], vp = _ref4[1];
            _ref5 = [p, [ek[0], ek[1]]], gp = _ref5[0], e = _ref5[1];
            while ((gp = gp != null ? (_ref6 = gp.parent) != null ? _ref6.parent : void 0 : void 0) != null) {
              vgp = gp.value.x[k];
              if (vd > vgp) {
                e[0] = Math.max(vgp, e[0]);
              } else {
                e[1] = Math.min(vgp, e[1]);
              }
            }
            return x(e[vd < vp ? 0 : 1]);
          }
        };
      };
      partitions = (((((field.append('svg:g')).classed('partitions', true)).selectAll('line')).data(nodes)).enter()).append('svg:line');
      partitions.attr('data-id', function(d) {
        return d.value.id;
      });
      partitions.attr('x1', partitionStart(0, ex));
      partitions.attr('y1', partitionStart(1, ey));
      partitions.attr('x2', partitionEnd(0, ex));
      partitions.attr('y2', partitionEnd(1, ey));
      g = ((((((field.selectAll('g.point')).data(data)).enter()).append('svg:g')).classed("point", true)).attr('data-id', function(d) {
        return d.id;
      })).attr('transform', function(d) {
        return "translate(" + (x(d.x[0])) + "," + (x(d.x[1])) + ")";
      });
      (g.append('svg:circle')).attr('r', r);
      ((g.append('svg:text')).classed('label', true)).text(function(d) {
        return d.id;
      });
      g.on('mouseover', activate('.node', '.tree', true));
      g.on('mouseout', activate('.node', '.tree', false));
      return rect = ((d3.select('.field')).on('mouseout', function() {
        (d3.selectAll('.nearest')).classed('nearest', false);
        return (d3.select('line.to-nearest')).classed('active', false);
      })).on('mousemove', function() {
        var nearest, nx, v;
        (d3.selectAll('.nearest')).classed('nearest', false);
        mx = (function() {
          var _i, _len, _ref3, _results;
          _ref3 = d3.mouse(this);
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            v = _ref3[_i];
            _results.push(x.invert(v));
          }
          return _results;
        }).call(this);
        if ((nearest = kdTree.nearest(mx, tree)) != null) {
          (d3.select("g.point[data-id=\"" + nearest.value.id + "\"]")).classed('nearest', true);
          nx = nearest.value.x;
          return (((((d3.select('line.to-nearest')).classed('active', true)).attr('x1', x(mx[0]))).attr('y1', x(mx[1]))).attr('x2', x(nx[0]))).attr('y2', x(nx[1]));
        }
      });
    }
  });

  k = 2;

  kdTree = function(data, depth) {
    var axis, children, medianIndex, node, sortedData, _ref;
    if (depth == null) {
      depth = 0;
    }
    if (!data.length) {
      return;
    }
    _ref = [depth++ % k, Math.floor(data.length / 2)], axis = _ref[0], medianIndex = _ref[1];
    sortedData = data.sort(function(d0, d1) {
      return d3.ascending(d0.x[axis], d1.x[axis]);
    });
    children = [kdTree(sortedData.slice(0, medianIndex), depth), kdTree(sortedData.slice(medianIndex + 1), depth)].filter(function(e) {
      return e;
    });
    return node = {
      value: sortedData[medianIndex],
      children: children.length ? children : null
    };
  };

  _dot = function(v0, v1) {
    v1 = v1 != null ? v1 : v0;
    return v0[0] * v1[0] + v0[1] * v1[1];
  };

  kdTree.nearest = function(x, tree, depth, ddBest) {
    var best, c, dd, node, path, root, v, xb, xn, _i, _len, _ref, _ref1, _ref2, _ref3;
    if (depth == null) {
      depth = 0;
    }
    if (ddBest == null) {
      ddBest = Infinity;
    }
    depth = tree.depth != null ? tree.depth : depth;
    path = [node = tree].concat(((function() {
      var _results;
      _results = [];
      while ((c = node.children) != null) {
        _results.push(node = c[x[k = depth++ % 2] - node.value.x[k] < 0 ? 0 : 1]);
      }
      return _results;
    })()));
    _ref = path.reverse();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      dd = _dot([(xn = node.value.x)[0] - x[0], xn[1] - x[1]]);
      if (dd < ddBest) {
        _ref1 = [node, xn, dd], best = _ref1[0], xb = _ref1[1], ddBest = _ref1[2];
      }
      if (node.children != null) {
        if (ddBest > (v = x[k = --depth % 2] - xn[k]) * v) {
          root = node.children[v > 0 ? 0 : 1];
          _ref2 = kdTree.nearest(x, root, null, ddBest), node = _ref2[0], dd = _ref2[1];
          if (node != null) {
            _ref3 = [node, node.value.x, dd], best = _ref3[0], xb = _ref3[1], ddBest = _ref3[2];
          }
        }
      }
    }
    if (depth === 0) {
      return best;
    } else {
      return [best, ddBest];
    }
  };

}).call(this);