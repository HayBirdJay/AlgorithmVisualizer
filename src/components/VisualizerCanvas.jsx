import React, { useRef, useEffect } from 'react'
import useVisualizer from '../hooks/useVisualizer'

/**
 * VisualizerCanvas: draws bars on canvas and uses useVisualizer hook
 * Props:
 *  - width, height: canvas size
 *  - array: initial numeric array
 *  - algorithm: object: { generator: function(...) } OR null
 *  - algorithmKey: string name
 *  - isRunning, setIsRunning, speed
 */
export default function VisualizerCanvas({ width=800, height=400, array=[], algorithm, algorithmKey, isRunning, setIsRunning, speed }) {
  const canvasRef = useRef(null)

  // Hook handles stepping the algorithm generator and managing state for drawing
  const {
    visualState, // { arr, highlights: { compare:[], active:[], path:[] }, meta }
    start,
    pause,
    reset
  } = useVisualizer({ array, algorithm, speed, onFinish: () => setIsRunning(false) })

  // Sync isRunning prop -> start/pause
  useEffect(() => {
    if (isRunning) start()
    else pause()
  }, [isRunning, start, pause])

  // Draw whenever visualState changes
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0,0,width,height)
    const arr = visualState.arr || array
    if (!arr || arr.length === 0) return

    const pad = 8
    const barGap = 1
    const barWidth = Math.max(1, (width - pad*2 - (arr.length - 1)*barGap) / arr.length)
    const maxVal = Math.max(...arr)
    const minVal = Math.min(...arr)

    const normalize = v => (v - minVal) / (maxVal - minVal || 1)

    // draw background
    ctx.fillStyle = '#07112a'
    ctx.fillRect(0,0,width,height)

    // draw bars
    for (let i=0;i<arr.length;i++){
      const x = pad + i * (barWidth + barGap)
      const h = Math.max(2, normalize(arr[i]) * (height - pad*2))
      const y = height - pad - h

      // determine color
      let color = '#60a5fa' // default
      if (visualState.highlights){
        const { compare = [], active = [], path = [] } = visualState.highlights
        if (compare.includes(i)) color = '#34d399'
        if (active.includes(i)) color = '#f97316'
        if (path.includes(i)) color = '#f43f5e'
      }

      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth, h)
    }

    // optionally draw meta text
    ctx.fillStyle = '#cbd5e1'
    ctx.font = '12px system-ui'
    ctx.fillText(`${algorithmKey}`, 12, 16)
    if (visualState.meta && visualState.meta.step !== undefined) {
      ctx.fillText(`step: ${visualState.meta.step}`, 12, 32)
    }
  }, [visualState, width, height, array, algorithmKey])

  return (
    <>
      <canvas ref={canvasRef} width={width} height={height} style={{borderRadius:8, width:'100%', height:'100%'}} />
    </>
  )
}
