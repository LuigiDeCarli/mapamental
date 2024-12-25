import { MindMapNode } from "../types/mind-map"

export class TopicManager {
  private nodes: MindMapNode[]

  constructor(nodes: MindMapNode[]) {
    this.nodes = nodes
  }

  private getNodeByPath(path: string): MindMapNode | undefined {
    return this.nodes.find(node => node.data.path === path)
  }

  private getChildrenPaths(parentPath: string): string[] {
    return this.nodes
      .filter(node => node.data.path.startsWith(parentPath + "."))
      .map(node => node.data.path)
  }

  private getNextSiblingPath(path: string): string {
    const parts = path.split(".")
    const lastNum = parseInt(parts[parts.length - 1])
    parts[parts.length - 1] = (lastNum + 1).toString()
    return parts.join(".")
  }

  private getChildPath(parentPath: string): string {
    const children = this.nodes
      .filter(node => node.data.path.startsWith(parentPath + "."))
      .map(node => node.data.path)
    
    if (children.length === 0) {
      return `${parentPath}.1`
    }

    const lastChild = children.sort().pop()!
    const lastNum = parseInt(lastChild.split(".").pop()!)
    return `${parentPath}.${lastNum + 1}`
  }

  public getNewNodePath(currentPath: string, isChild: boolean): string {
    if (isChild) {
      return this.getChildPath(currentPath)
    } else {
      return this.getNextSiblingPath(currentPath)
    }
  }

  public getMarkdownStructure(): string {
    const indent = (level: number) => "    ".repeat(level)
    
    const buildStructure = (path: string = "1", level: number = 0): string => {
      const node = this.getNodeByPath(path)
      if (!node) return ""

      let result = `${indent(level)}${node.data.label}\n`
      
      const childPaths = this.nodes
        .filter(n => n.data.parentId === node.id)
        .map(n => n.data.path)
        .sort()

      for (const childPath of childPaths) {
        result += buildStructure(childPath, level + 1)
      }

      return result
    }

    return buildStructure()
  }
}

