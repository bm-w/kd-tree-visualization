(->
  d3.json 'data.json', (data) ->
    if (data? and data.length)
      tree = kdTree data
      layout = (do d3.layout.tree)                                                                                                                      

      dim = [288, 240]

      activate = (selectors..., container, b) ->
        (d) ->
          id = d.value?.id or d.id
          queries = for selector in selectors
            "#{selector}[data-id=\"#{id}\"]"
          sel = (d3.selectAll "#{queries.join(', ')}, #{container}")
            .classed 'active', b

      nodes = layout tree
      links = (do (((((d3.select 'g.tree')
        .append 'svg:g')
        .classed 'links', on)
          .selectAll 'line.link')
          .data layout.links nodes)
          .enter).append 'svg:line'
      links.attr 'x1', (d) -> dim[0] * d.source.x
      links.attr 'y1', (d) -> dim[1] * d.source.y
      links.attr 'x2', (d) -> dim[0] * d.target.x
      links.attr 'y2', (d) -> dim[1] * d.target.y

      svg = d3.select 'svg'
      g = ((((do (((d3.select 'g.tree')
        .selectAll 'g.node')
        .data nodes)
        .enter).append 'svg:g')
          .classed 'node', on)
          .attr 'data-id', (d) -> d.value.id)
          .attr 'transform', (d) ->
            "translate(#{dim[0] * d.x},#{dim[1] * d.y})"
      (g.append 'svg:circle')
        .attr 'r', 12
      ((g.append 'svg:text')
        .classed 'label', on)
        .text (d, i) -> d.value.id
      ((g.append 'svg:text')
        .classed 'coords', on)
        .text (d) ->
          v = for i of (x = d.value.x)
            x[i].toFixed 2
          "(#{v.join ','})"
      g.on 'mouseover', activate '.point', '.partitions line', '.field', on
      g.on 'mouseout', activate '.point', '.partitions line', '.field', off

      field = d3.select 'g.field'

      x = ((do d3.scale.linear)
        .domain [-4, 4])
        .rangeRound [-480, 480]
      [getX, getY] = [((d) -> d.x[0]), ((d) -> d.x[1])]
      [mx, ex] = [(d3.mean data, getX), (d3.extent data, getX)]
      [my, ey] = [(d3.mean data, getY), (d3.extent data, getY)]

      ((((svg.select '.field > rect')
        .attr 'x', x ex[0])
        .attr 'y', x ey[0])
        .attr 'width', x ex[1] - ex[0])
        .attr 'height', x ey[1] - ey[0]

      r = 8
      axes = (field.append 'svg:g')
        .classed "axes", on
      (axes.append 'svg:circle')
        .attr 'r', x 1
      ((axes.append 'svg:line')
        .attr 'x1', -2 - r + x ex[0])
        .attr 'x2', 2 + r + x ex[1]
      ((axes.append 'svg:line')
        .attr 'y1', -2 - r + x ey[0])
        .attr 'y2', 2 + r + x ey[1]

      partitionStart = (k, ek) -> (d) ->
        if d.depth % 2 == k
          0.5 + x d.value.x[k]
        else
          x d.parent?.value.x[k] or ek[0]
      partitionEnd = (k, ek) -> (d) ->
        if d.depth % 2 == k
          0.5 + x d.value.x[k]
        else
          [vd, vp] = [d.value.x[k], (p = d.parent)?.value.x[k] or -Infinity]
          [gp, e] = [p, [ek[0], ek[1]]]
          while (gp = gp?.parent?.parent)?
            vgp = gp.value.x[k]
            if vd > vgp then (e[0] = Math.max vgp, e[0]) else (e[1] = Math.min vgp, e[1])
          x e[if vd < vp then 0 else 1]

      partitions = (do ((((field
        .append 'svg:g')
          .classed 'partitions', on)
          .selectAll 'line')
          .data nodes)
          .enter).append 'svg:line'
      partitions.attr 'data-id', (d) -> d.value.id
      partitions.attr 'x1', partitionStart 0, ex
      partitions.attr 'y1', partitionStart 1, ey
      partitions.attr 'x2', partitionEnd 0, ex
      partitions.attr 'y2', partitionEnd 1, ey

      g = ((((do ((field
        .selectAll 'g.point')
        .data data)
        .enter).append 'svg:g')
          .classed "point", on)
          .attr 'data-id', (d) -> d.id)
          .attr 'transform', (d) ->
            "translate(#{x d.x[0]},#{x d.x[1]})"
      (g.append 'svg:circle')
        .attr 'r', r
      ((g.append 'svg:text')
        .classed 'label', on)
        .text (d) -> d.id
      g.on 'mouseover', activate '.node', '.tree', on
      g.on 'mouseout', activate '.node', '.tree', off

      rect = ((d3.select '.field')
        .on 'mouseout', ->
          (d3.selectAll '.nearest')
            .classed 'nearest', off
          (d3.select 'line.to-nearest')
            .classed 'active', off)
        .on 'mousemove', ->
          (d3.selectAll '.nearest')
            .classed 'nearest', off
          mx = ((x.invert v) for v in d3.mouse this)
          if (nearest = kdTree.nearest mx, tree)?
            (d3.select "g.point[data-id=\"#{nearest.value.id}\"]")
              .classed 'nearest', on
            nx = nearest.value.x
            (((((d3.select 'line.to-nearest')
              .classed 'active', on)
              .attr 'x1', x mx[0])
              .attr 'y1', x mx[1])
              .attr 'x2', x nx[0])
              .attr 'y2', x nx[1]
          

  k = 2
  kdTree = (data, depth=0) ->
    if not data.length
      return

    [axis, medianIndex]= [depth++ % k, Math.floor data.length / 2]
    sortedData = data.sort (d0, d1) ->
      d3.ascending d0.x[axis], d1.x[axis]

    children = [
      kdTree sortedData[...medianIndex], depth
      kdTree sortedData[medianIndex + 1..], depth
    ].filter (e) -> e
    node =
      value: sortedData[medianIndex]
      children: if children.length then children else null
  _dot = (v0, v1) ->
    v1 = if v1? then v1 else v0
    v0[0] * v1[0] + v0[1] * v1[1]
  kdTree.nearest = (x, tree, depth=0, ddBest=Infinity) ->
    depth = if tree.depth? then tree.depth else depth

    path = [node = tree].concat (while (c = node.children)?
      node = c[if x[k = depth++ % 2] - node.value.x[k] < 0 then 0 else 1])

    for node in (do path.reverse)
      dd = _dot [(xn = node.value.x)[0] - x[0],  xn[1] - x[1]]
      if dd < ddBest
        [best, xb, ddBest] = [node, xn, dd]
      if node.children?
        if ddBest > (v = x[k = --depth % 2] - xn[k]) * v
          root = node.children[if v > 0 then 0 else 1]
          [node, dd] = kdTree.nearest x, root, null, ddBest
          if node? then [best, xb, ddBest] = [node, node.value.x, dd]
    if depth == 0 then best else [best, ddBest]
).call this