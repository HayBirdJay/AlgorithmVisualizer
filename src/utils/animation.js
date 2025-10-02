// src/utils/animation.js
export async function animate(generator, applySteps, options = {}) {
  const { delay = 20, batchSize = 5 } = options
  let batch = []
  for (const step of generator) {
    batch.push(step)
    if (batch.length >= batchSize) {
      applySteps(batch)
      batch = []
      // small delay between batches to allow rendering & control speed
      await new Promise((res) => setTimeout(res, delay))
    }
  }
  if (batch.length > 0) applySteps(batch)
}
