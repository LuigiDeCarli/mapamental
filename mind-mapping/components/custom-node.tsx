"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { cn } from "@/lib/utils"
import { Circle } from 'lucide-react'

const CustomNode = memo(({ data, isConnectable, selected }: NodeProps) => {
  const isRoot = data.isRoot
  const level = data.level || 0
  const branchColor = data.branchColor || "rgb(var(--primary))"
  const style = data.style || {}

  return (
    <div
      className={cn(
        "group relative px-4 py-2 rounded-lg transition-all duration-200",
        "hover:shadow-lg hover:ring-2 hover:ring-offset-2",
        isRoot ? "bg-background" : "bg-white",
        selected ? "ring-2 ring-offset-2" : ""
      )}
      style={{
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor || branchColor,
        borderStyle: style.borderStyle || "solid",
        borderWidth: `${style.borderWidth || 1}px`,
        borderRadius: `${style.borderRadius || 4}px`,
        color: style.textColor,
        fontSize: `${style.fontSize || 14}px`,
        fontWeight: style.fontWeight || (isRoot ? "semibold" : "normal"),
        ...(selected && { ringColor: branchColor }),
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="!bg-transparent !border-none !h-full !w-8 !left-[-2rem]"
      />
      <div className="flex items-center gap-2">
        {!isRoot && (
          <Circle
            className="w-2 h-2 shrink-0"
            style={{ fill: branchColor, color: branchColor }}
          />
        )}
        <div
          className={cn(
            "transition-colors duration-200",
            selected ? "text-primary" : "text-foreground"
          )}
          style={{ color: selected ? branchColor : undefined }}
        >
          {data.label}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="!bg-transparent !border-none !h-full !w-8 !right-[-2rem]"
      />
    </div>
  )
})
CustomNode.displayName = "CustomNode"

export default CustomNode

