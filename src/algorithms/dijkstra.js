export default {
  generator: function*(arr) {
    // Demo linear Dijkstra: nodes 0..n-1 with weight = arr[i]
    const n = arr.length
    const dist = new Array(n).fill(Infinity)
    const visited = new Array(n).fill(false)
    dist[0] = 0
    for (let i=0;i<n;i++){
      // pick min
      let u = -1
      for (let j=0;j<n;j++) if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j
      if (u === -1 || dist[u] === Infinity) break
      visited[u] = true
      yield { type: 'markPath', indices: [u] }
      if (u === n-1) break
      for (const v of [u-1, u+1]) {
        if (v>=0 && v<n && !visited[v]) {
          const alt = dist[u] + arr[v]
          yield { type: 'compare', indices: [u, v] }
          if (alt < dist[v]) {
            dist[v] = alt
            yield { type: 'set', index: v, value: arr[v] } // visually indicate cost update
          }
        }
      }
    }
    yield { type: 'done' }
  }
}
