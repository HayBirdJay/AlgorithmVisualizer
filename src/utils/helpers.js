// src/utils/helpers.js
export function generateRandomArray(n = 50, min = 5, max = 100) {
  return Array.from({ length: n }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}
