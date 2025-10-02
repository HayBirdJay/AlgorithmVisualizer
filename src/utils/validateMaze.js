// src/utils/validateMaze.js
import { bfs } from "../algorithms/bfsGrid"

export function isMazeSolvable(grid, startNode, endNode) {
  const gen = bfs(grid, startNode, endNode)
  for (let step of gen) {
    if (step.type === "path") {
      return true
    }
  }
  return false
}
