// src/utils/maze.js
import { createGrid } from '../models/Grid'
import { bfsG } from '../algorithms/bfsGrid'

// shuffle helper
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function carveMaze(grid, rows, cols, r, c) {
  const dirs = shuffle([
    [0, 2],
    [0, -2],
    [2, 0],
    [-2, 0],
  ])
  for (const [dr, dc] of dirs) {
    const nr = r + dr
    const nc = c + dc
    if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1) {
      if (grid[nr][nc].isWall) {
        grid[r + dr / 2][c + dc / 2].isWall = false
        grid[nr][nc].isWall = false
        carveMaze(grid, rows, cols, nr, nc)
      }
    }
  }
}

// returns a new grid with walls carved
function generateMazeOnce(rows, cols, start, end) {
  const grid = createGrid(rows, cols)

  // fill walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c].isWall = true
      grid[r][c].isVisited = false
      grid[r][c].isPath = false
      grid[r][c].previous = null
      grid[r][c].isStart = false
      grid[r][c].isEnd = false
    }
  }

  // carve from (1,1)
  grid[1][1].isWall = false
  carveMaze(grid, rows, cols, 1, 1)

  // ensure start/end not walls and mark them
  grid[start.row][start.col].isWall = false
  grid[start.row][start.col].isStart = true
  grid[end.row][end.col].isWall = false
  grid[end.row][end.col].isEnd = true

  return grid
}

// check solvability by running BFS generator until it yields a 'path' step
function isSolvable(grid, start, end) {
  // clone the grid "stateful" references are fine — BFS generator expects grid objects
  // Run the BFS generator synchronously (no animation) and check for path yields
  const gen = bfsG(grid, grid[start.row][start.col], grid[end.row][end.col])
  for (const step of gen) {
    if (step && step.type === 'path') return true
  }
  return false
}

// generate until solvable (maxAttempts default 10)
export function generateSolvableMaze(rows, cols, start, end, maxAttempts = 10) {
  let attempts = 0
  while (attempts < maxAttempts) {
    const g = generateMazeOnce(rows, cols, start, end)
    if (isSolvable(g, start, end)) return g
    attempts++
  }
  // fallback: return a simple open grid if nothing solvable (very unlikely)
  const fallback = createGrid(rows, cols)
  fallback[start.row][start.col].isStart = true
  fallback[end.row][end.col].isEnd = true
  return fallback
}
