// src/components/GridVisualizer.jsx
import React from 'react'
import './GridVisualizer.css'

export default function GridVisualizer({ grid = [], onTileClick = () => {} }) {
  if (!grid || grid.length === 0) return <div>Loading grid...</div>

  return (
    <div className="grid-container" style={{ userSelect: 'none' }}>
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="grid-row">
          {row.map((node, cIdx) => {
            let classes = 'node'
            if (node.isWall) classes += ' wall'
            else if (node.isStart) classes += ' start'
            else if (node.isEnd) classes += ' end'
            else if (node.isPath) classes += ' path'
            else if (node.isVisited) classes += ' visited'

            return (
              <div
                key={cIdx}
                className={classes}
                onClick={() => onTileClick(rIdx, cIdx)}
                title={`r:${rIdx} c:${cIdx}`}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
