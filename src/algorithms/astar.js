export default {
  generator: function*(arr) {
    // Simplified A*: same demo linear heuristic
    const n = arr.length
    const open = new Set([0])
    const cameFrom = {}
    const g = new Array(n).fill(Infinity)
    const f = new Array(n).fill(Infinity)
    const heuristic = i => Math.abs((n-1) - i)
    g[0] = 0
    f[0] = heuristic(0)

    while (open.size) {
      // pick min f
      let u = null
      for (const node of open) {
        if (u === null || f[node] < f[u]) u = node
      }
      if (u === null) break
      if (u === n-1) break
      open.delete(u)
      yield { type: 'markPath', indices: [u] }
      for (const v of [u-1, u+1]) {
        if (v>=0 && v<n) {
          yield { type: 'compare', indices: [u,v] }
          const tentative = g[u] + arr[v]
          if (tentative < g[v]) {
            cameFrom[v] = u
            g[v] = tentative
            f[v] = tentative + heuristic(v)
            open.add(v)
            yield { type: 'set', index: v, value: arr[v] }
          }
        }
      }
    }
    // reconstruct path for demo
    const path = []
    let cur = n-1
    while (cur !== undefined && cur >= 0) {
      path.push(cur)
      cur = cameFrom[cur]
    }
    yield { type: 'markPath', indices: path }
    yield { type: 'done' }
  }
}
