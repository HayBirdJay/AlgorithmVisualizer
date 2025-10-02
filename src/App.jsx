import React, { useEffect, useState, useRef } from 'react'
import GridVisualizer from './components/GridVisualizer'
import Legend from './components/Legend'

import { createGrid } from './models/Grid'
import { generateSolvableMaze } from './utils/maze'
import { animate } from './utils/animation'
import { bfsG } from './algorithms/bfsGrid'

const ROWS = 21   // odd numbers work nicely for maze carving
const COLS = 41
const START = { row: 1, col: 1 }
const END = { row: ROWS - 2, col: COLS - 2 }

export default function App() {
  const [grid, setGrid] = useState(() => createGrid(ROWS, COLS))
  const [isRunning, setIsRunning] = useState(false)
  const runningRef = useRef(false)

  // initial solvable maze on mount
  useEffect(() => {
    const g = generateSolvableMaze(ROWS, COLS, START, END)
    setGrid(g)
  }, [])

  // Clear visited/path flags helper
  const clearSearchState = (g) => {
    for (let r = 0; r < g.length; r++) {
      for (let c = 0; c < g[0].length; c++) {
        g[r][c].isVisited = false
        g[r][c].isPath = false
        g[r][c].previous = null
      }
    }
  }

  const handleGenerateMaze = () => {
    if (isRunning) return
    const g = generateSolvableMaze(ROWS, COLS, START, END)
    setGrid(g)
  }

  const handleRunBFS = async () => {
    if (isRunning) return
    setIsRunning(true)
    runningRef.current = true

    // ensure any previous search marks are removed
    clearSearchState(grid)
    // ensure start/end flags are set
    grid[START.row][START.col].isStart = true
    grid[END.row][END.col].isEnd = true

    // pass the live grid nodes to the generator
    const gen = bfsG(grid, grid[START.row][START.col], grid[END.row][END.col])

    // applyBatchedSteps will be called with arrays of step objects
    await animate(
      gen,
      (steps) => {
        // apply each step to grid nodes (mutating in place)
        for (const s of steps) {
          if (!s) continue
          const node = grid[s.row][s.col]
          if (!node) continue
          if (s.type === 'visit') node.isVisited = true
          else if (s.type === 'path') node.isPath = true
        }
        // trigger react update by creating a new outer array reference
        setGrid(prev => {
          // shallow copy outer array so React sees change
          return prev.map(row => row)
        })
      },
      { delay: 20, batchSize: 6 } // tune these for speed vs smoothness
    )

    setIsRunning(false)
    runningRef.current = false
  }

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16 }}>
      <aside style={{ width: 260 }}>
        <h2>Pathfinding — Grid BFS Demo</h2>
        <p className="small">Rows: {ROWS} · Cols: {COLS}</p>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={handleGenerateMaze} disabled={isRunning}>Generate Maze</button>
          <button onClick={handleRunBFS} disabled={isRunning}>Run BFS</button>
          <button onClick={() => { if (!isRunning) { clearSearchState(grid); setGrid(prev => prev.map(r=>r)); } }}>Clear</button>
        </div>

        <div style={{ marginTop: 14 }}>
          <Legend />
        </div>
      </aside>

      <main style={{ flex: 1 }}>
        <GridVisualizer grid={grid} onTileClick={(r, c) => {
          if (isRunning) return
          // toggle wall by clicking (don't toggle start/end)
          const node = grid[r][c]
          if (node.isStart || node.isEnd) return
          node.isWall = !node.isWall
          setGrid(prev => prev.map(row => row))
        }} />
      </main>
    </div>
  )
}
