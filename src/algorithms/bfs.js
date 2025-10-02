export default {
  generator: function*(arr) {
    // For demo: treat array as nodes in a line. BFS from 0 to end-1.
    const n = arr.length
    const visited = new Array(n).fill(false)
    const q = [0]
    visited[0] = true
    while (q.length) {
      const u = q.shift()
      yield { type: 'markPath', indices: [u] }
      if (u === n-1) break
      for (const v of [u-1, u+1]) {
        if (v >= 0 && v < n && !visited[v]) {
          visited[v] = true
          q.push(v)
          yield { type: 'compare', indices: [u, v] }
        }
      }
    }
    yield { type: 'done' }
  }
}
