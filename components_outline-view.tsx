import { ChevronRight, ChevronDown } from 'lucide-react'
import { useState } from "react"
import { MindMapNode } from "../types/mind-map"
import { cn } from "@/lib/utils"

interface OutlineViewProps {
  nodes: MindMapNode[]
  onNodeClick?: (nodeId: string) => void
  selectedNode?: string | null
}

interface OutlineNodeProps extends OutlineViewProps {
  parentPath?: string
  level: number
}

function OutlineNode({ nodes, parentPath, level, onNodeClick, selectedNode }: OutlineNodeProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const currentLevelNodes = nodes
    .filter((node) => {
      if (!parentPath) return node.data.isRoot
      return node.data.path.startsWith(parentPath + ".") && 
             node.data.path.split(".").length === parentPath.split(".").length + 1
    })
    .sort((a, b) => a.data.path.localeCompare(b.data.path))

  if (currentLevelNodes.length === 0) return null

  return (
    <div className="flex flex-col">
      {currentLevelNodes.map((node) => {
        const hasChildren = nodes.some((n) => n.data.parentId === node.id)
        const isCollapsed = collapsed[node.id]

        return (
          <div key={node.id} className="flex flex-col">
            <div
              className={cn(
                "flex items-center gap-1 py-1 px-2 rounded hover:bg-accent cursor-pointer",
                selectedNode === node.id && "bg-accent",
                level === 0 && "font-semibold"
              )}
              style={{ marginLeft: `${level * 20}px` }}
              onClick={() => onNodeClick?.(node.id)}
            >
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCollapsed((prev) => ({ ...prev, [node.id]: !prev[node.id] }))
                  }}
                  className="p-1 hover:bg-muted rounded"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              )}
              {!hasChildren && <span className="w-6" />}
              <span
                className="flex-1"
                style={{
                  color: node.data.branchColor,
                }}
              >
                {node.data.label}
              </span>
            </div>
            {hasChildren && !isCollapsed && (
              <OutlineNode
                nodes={nodes}
                parentPath={node.data.path}
                level={level + 1}
                onNodeClick={onNodeClick}
                selectedNode={selectedNode}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OutlineView({ nodes, onNodeClick, selectedNode }: OutlineViewProps) {
  return (
    <div className="h-full overflow-auto p-4 bg-background">
      <OutlineNode
        nodes={nodes}
        level={0}
        onNodeClick={onNodeClick}
        selectedNode={selectedNode}
      />
    </div>
  )
}

