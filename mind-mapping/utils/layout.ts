import { MindMapNode } from "../types/mind-map"
import { getBranchColor, getLighterShade } from "./colors"

interface Position {
  x: number
  y: number
}

const HORIZONTAL_SPACING = 250
const VERTICAL_SPACING = 100

export function calculateLayout(nodes: MindMapNode[]): MindMapNode[] {
  const rootNode = nodes.find((node) => node.data.isRoot)
  if (!rootNode) return nodes

  const updatedNodes = [...nodes]
  const processedNodes = new Set<string>([rootNode.id])
  let branchIndex = 0

  function processNode(nodeId: string, level: number, verticalIndex: number) {
    const children = updatedNodes.filter(
      (node) => node.data.parentId === nodeId && !processedNodes.has(node.id)
    )

    if (children.length === 0) return

    const startY = verticalIndex - ((children.length - 1) * VERTICAL_SPACING) / 2
    const parentNode = updatedNodes.find((node) => node.id === nodeId)!
    const parentX = parentNode.position.x

    children.forEach((child, index) => {
      const childIndex = updatedNodes.findIndex((node) => node.id === child.id)
      if (childIndex === -1) return

      // Assign branch color
      const color = level === 1 
        ? getBranchColor(branchIndex)
        : getLighterShade(parentNode.data.branchColor || getBranchColor(0), (level - 1) * 0.2)

      updatedNodes[childIndex] = {
        ...child,
        position: {
          x: parentX + HORIZONTAL_SPACING,
          y: startY + index * VERTICAL_SPACING,
        },
        data: {
          ...child.data,
          branchColor: color,
          branchIndex: level === 1 ? branchIndex : parentNode.data.branchIndex,
        },
      }

      processedNodes.add(child.id)
      processNode(child.id, level + 1, startY + index * VERTICAL_SPACING)
    })

    if (level === 1) branchIndex++
  }

  processNode(rootNode.id, 1, 0)
  return updatedNodes
}

