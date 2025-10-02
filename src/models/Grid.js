// src/models/Grid.js
export function createNode(row, col) {
  return {
    row,
    col,
    isWall: false,
    isVisited: false,
    isPath: false,
    isStart: false,
    isEnd: false,
    previous: null,
  }
}

export function createGrid(rows = 21, cols = 41) {
  const grid = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      row.push(createNode(r, c))
    }
    grid.push(row)
  }
  return grid
}
