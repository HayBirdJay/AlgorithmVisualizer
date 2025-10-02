// src/components/GridControls.jsx
import React, { useState } from "react"
import { generateSolvableMaze } from "../utils/maze"

export default function GridControls({ setGrid }) {
  const [rows] = useState(20)
  const [cols] = useState(40)
  const start = { row: 1, col: 1 }
  const end = { row: rows - 2, col: cols - 2 }

  const handleMaze = () => {
    const newGrid = generateSolvableMaze(rows, cols, start, end)
    setGrid(newGrid)
  }

  return (
    <button
      onClick={handleMaze}
      className="p-2 rounded bg-purple-500 text-white hover:bg-purple-600"
    >
      Generate Maze
    </button>
  )
}
