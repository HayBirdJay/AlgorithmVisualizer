import React from 'react'

export default function Controls({ isRunning, onStart, onPause, onReset, onShuffle }){
  return (
    <>
      {isRunning ? (
        <button onClick={onPause}>Pause</button>
      ) : (
        <button onClick={onStart}>Start</button>
      )}
      <button className="secondary" onClick={onReset}>Reset</button>
      <button className="secondary" onClick={onShuffle}>Shuffle</button>
    </>
  )
}
