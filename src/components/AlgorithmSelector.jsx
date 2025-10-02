import React from 'react'

export default function AlgorithmSelector({ list, selected, onSelect }){
  return (
    <div style={{marginTop:12}}>
      <label className="small">Algorithm</label>
      <select value={selected} onChange={e => onSelect(e.target.value)} style={{width:'100%', padding:8, borderRadius:8}}>
        {list.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
      </select>
    </div>
  )
}
