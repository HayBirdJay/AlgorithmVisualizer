/**
 * Merge sort generator - yields set operations when values are placed.
 * This implementation will perform the algorithm on an array copy and yield 'compare' and 'set' steps.
 */

export default {
  generator: function*(arr) {
    const aux = arr.slice()
    function* merge(l, m, r) {
      let i = l, j = m+1, k = l
      while (i <= m && j <= r) {
        yield { type: 'compare', indices: [i, j] }
        if (aux[i] <= aux[j]) {
          arr[k++] = aux[i++]
          yield { type: 'set', index: k-1, value: arr[k-1] }
        } else {
          arr[k++] = aux[j++]
          yield { type: 'set', index: k-1, value: arr[k-1] }
        }
      }
      while (i <= m) {
        arr[k++] = aux[i++]
        yield { type: 'set', index: k-1, value: arr[k-1] }
      }
      while (j <= r) {
        arr[k++] = aux[j++]
        yield { type: 'set', index: k-1, value: arr[k-1] }
      }
      // copy back to aux for next merges
      for (let t = l; t <= r; t++) aux[t] = arr[t]
    }

    function* mergeSortRec(l, r) {
      if (l >= r) return
      const mid = Math.floor((l + r) / 2)
      yield* mergeSortRec(l, mid)
      yield* mergeSortRec(mid+1, r)
      yield* merge(l, mid, r)
    }

    yield* mergeSortRec(0, arr.length - 1)
    yield { type: 'done' }
  }
}
