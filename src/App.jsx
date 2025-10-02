import React, { useState, useMemo } from 'react'
import AlgorithmSelector from './components/AlgorithmSelector'
import Controls from './components/Controls'
import VisualizerCanvas from './components/VisualizerCanvas'
import Legend from './components/Legend'
import { generateRandomArray } from "./utils/helpers"
import * as algorithms from './algorithms' // index export (we'll provide index approach below)

const DEFAULT_SIZE = 80

export default function App(){
  const [algorithmKey, setAlgorithmKey] = useState('bubbleSort')
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [speed, setSpeed] = useState(1) // multiplier: 1x, higher = faster
  const [arraySeed, setArraySeed] = useState(() => generateRandomArray(DEFAULT_SIZE))
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('sorting') // or 'pathfinding', etc.

  // regenerate array when size changes
  const regenerate = () => {
    setArraySeed(generateRandomArray(size))
    setIsRunning(false)
  }

  // algorithm meta list
  const algorithmList = useMemo(() => ([
    { key: 'bubbleSort', label: 'Bubble Sort', category: 'sorting' },
    { key: 'mergeSort', label: 'Merge Sort', category: 'sorting' },
    { key: 'bfs', label: 'Breadth-First Search', category: 'search' },
    { key: 'dfs', label: 'Depth-First Search', category: 'search' },
    { key: 'dijkstra', label: 'Dijkstra', category: 'pathfinding' },
    { key: 'astar', label: 'A* Search', category: 'pathfinding' }
  ]),[])

  const currentAlg = algorithms[algorithmKey]

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Algorithm Visualizer</h2>
        <p className="small">Visualize sorting and graph algorithms. Select algorithm, adjust speed and array size, then start.</p>

        <AlgorithmSelector
          list={algorithmList}
          selected={algorithmKey}
          onSelect={k => setAlgorithmKey(k)}
        />

        <div style={{marginTop:12}}>
          <label className="small">Array size: {size}</label>
          <input type="range" min="10" max="200" value={size}
            onChange={e => setSize(Number(e.target.value))} />
        </div>

        <div style={{marginTop:8}}>
          <label className="small">Speed: {speed}x</label>
          <input type="range" min="0.25" max="5" step="0.25" value={speed}
            onChange={e => setSpeed(Number(e.target.value))} />
        </div>

        <div style={{marginTop:12}} className="controls-row">
          <Controls
            isRunning={isRunning}
            onStart={() => setIsRunning(true)}
            onPause={() => setIsRunning(false)}
            onReset={() => { setIsRunning(false); regenerate() }}
            onShuffle={() => regenerate()}
          />
        </div>

        <div style={{marginTop:12}}>
          <button className="secondary" onClick={() => {
            // quick toggle of mode for demonstration
            setMode(prev => prev === 'sorting' ? 'pathfinding' : 'sorting')
          }}>Toggle mode (current: {mode})</button>
        </div>

        <div style={{marginTop:16}}>
          <Legend />
        </div>
      </aside>

      <main className="canvas-wrap">
        <VisualizerCanvas
          width={1000}
          height={600}
          array={arraySeed}
          algorithm={currentAlg}
          algorithmKey={algorithmKey}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          speed={speed}
        />
      </main>
    </div>
  )
}
