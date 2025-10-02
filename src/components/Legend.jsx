import React from 'react'

export default function Legend(){
  return (
    <div className="legend">
      <div><span className="sw" style={{background:'#60a5fa'}}/> Active</div>
      <div><span className="sw" style={{background:'#34d399'}}/> Compare</div>
      <div><span className="sw" style={{background:'#f97316'}}/> Swap / Path</div>
    </div>
  )
}
