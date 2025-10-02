export default {
  generator: function*(arr) {
    const n = arr.length
    const visited = new Array(n).fill(false)
    function* dfs(u) {
      visited[u] = true
      yield { type: 'markPath', indices: [u] }
      if (u === n-1) return true
      for (const v of [u+1, u-1]) {
        if (v >= 0 && v < n && !visited[v]) {
          yield { type: 'compare', indices: [u, v] }
          const found = yield* dfs(v)
          if (found) return true
        }
      }
      return false
    }
    yield* dfs(0)
    yield { type: 'done' }
  }
}
