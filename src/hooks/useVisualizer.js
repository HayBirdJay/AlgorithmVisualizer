import { useRef, useCallback, useState, useEffect } from 'react'

/**
 * useVisualizer:
 * - Accepts initial array, algorithm object (should export a generator factory)
 * - algorithm should be function(array) => generator which yields operation objects:
 *    { type: 'compare'|'swap'|'set'|'markPath'|'done', payload: {...} }
 * - The hook maintains `visualState` the component uses to draw
 * - Handles stepping with requestAnimationFrame and speed multiplier
 */

export default function useVisualizer({ array=[], algorithm=null, speed=1, onFinish=null }) {
  const genRef = useRef(null)
  const animRef = useRef(null)
  const lastTimeRef = useRef(0)
  const intervalRef = useRef(1000/30) // default base fps tick
  const [visualState, setVisualState] = useState({
    arr: [...array],
    highlights: { compare: [], active: [], path: [] },
    meta: { step: 0 }
  })

  // Create (or recreate) generator when algorithm or array changes
  useEffect(() => {
    reset()
    // eslint-disable-next-line
  }, [algorithm, array])

  const reset = useCallback(() => {
    cancelAnimationFrame(animRef.current)
    genRef.current = null
    setVisualState({
      arr: [...array],
      highlights: { compare: [], active: [], path: [] },
      meta: { step: 0 }
    })
  }, [array])

  const applyOp = useCallback((op) => {
    setVisualState(prev => {
      const next = {
        arr: [...prev.arr],
        highlights: { ...prev.highlights, compare: [], active: [], path: [] },
        meta: { step: (prev.meta.step || 0) + 1 }
      }
      switch (op.type) {
        case 'compare':
          next.highlights.compare = op.indices || []
          break
        case 'swap': {
          const [i,j] = op.indices
          const tmp = next.arr[i]; next.arr[i] = next.arr[j]; next.arr[j] = tmp
          next.highlights.active = [i,j]
          break
        }
        case 'set': {
          const { index, value } = op
          next.arr[index] = value
          next.highlights.active = [index]
          break
        }
        case 'markPath':
          next.highlights.path = op.indices || []
          break
        case 'done':
          // mark any final highlights if provided
          if (op.indices) next.highlights.active = op.indices
          break
        default:
          break
      }
      return next
    })
  }, [])

  const stepGenerator = useCallback((timestamp) => {
    if (!genRef.current) return
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const elapsed = timestamp - lastTimeRef.current
    const wait = Math.max(1, intervalRef.current / Math.max(0.001, speed))
    if (elapsed >= wait) {
      lastTimeRef.current = timestamp
      const { value, done } = genRef.current.next()
      if (done) {
        if (value && typeof value === 'object' && value.type) applyOp(value)
        cancelAnimationFrame(animRef.current)
        genRef.current = null
        if (onFinish) onFinish()
        return
      } else if (value && typeof value === 'object' && value.type) {
        applyOp(value)
      }
    }
    animRef.current = requestAnimationFrame(stepGenerator)
  }, [applyOp, speed, onFinish])

  const start = useCallback(() => {
    if (!genRef.current) {
      if (!algorithm) return
      // algorithm is expected to be a function that returns a generator given the array
      genRef.current = algorithm.generator ? algorithm.generator([...visualState.arr]) : algorithm([...visualState.arr])
    }
    lastTimeRef.current = 0
    animRef.current = requestAnimationFrame(stepGenerator)
  }, [algorithm, stepGenerator, visualState.arr])

  const pause = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = null
  }, [])

  // cleanup
  useEffect(() => () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
  }, [])

  return { visualState, start, pause, reset }
}
