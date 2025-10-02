/**
 * bubbleSort generator - yields visualization operations
 *
 * yields objects like:
 *  { type: 'compare', indices: [i,j] }
 *  { type: 'swap', indices: [i,j] }
 *  { type: 'set', index, value }
 *  { type: 'done', indices: [...] }
 */

export default {
  generator: function*(arr) {
    const n = arr.length
    for (let i = 0; i < n-1; i++) {
      for (let j = 0; j < n-1-i; j++) {
        yield { type: 'compare', indices: [j, j+1] }
        if (arr[j] > arr[j+1]) {
          // swap in array and yield swap op
          [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
          yield { type: 'swap', indices: [j, j+1] }
        }
      }
    }
    yield { type: 'done' }
  }
}
