// src/algorithms/bfsGrid.js
export function* bfsG(grid, startNode, endNode) {
  // simple queue BFS on 4-neighborhood
  const rows = grid.length
  const cols = grid[0].length
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false))
  const q = []

  q.push(startNode)
  visited[startNode.row][startNode.col] = true
  startNode.previous = null

  while (q.length) {
    const cur = q.shift()
    // yield visit
    yield { row: cur.row, col: cur.col, type: 'visit' }

    if (cur.row === endNode.row && cur.col === endNode.col) {
      // reconstruct path by following 'previous'
      let p = cur
      while (p) {
        yield { row: p.row, col: p.col, type: 'path' }
        p = p.previous
      }
      return
    }

    const neighbors = []
    if (cur.row > 0) neighbors.push(grid[cur.row - 1][cur.col])
    if (cur.row < rows - 1) neighbors.push(grid[cur.row + 1][cur.col])
    if (cur.col > 0) neighbors.push(grid[cur.row][cur.col - 1])
    if (cur.col < cols - 1) neighbors.push(grid[cur.row][cur.col + 1])

    for (const nb of neighbors) {
      if (!visited[nb.row][nb.col] && !nb.isWall) {
        visited[nb.row][nb.col] = true
        nb.previous = cur
        q.push(nb)
        // note: we don't yield neighbor immediately (we yield when it's dequeued),
        // but you could yield a 'discover' event here if you want a different visual.
      }
    }
  }

  // no path found: just return
  return
}
