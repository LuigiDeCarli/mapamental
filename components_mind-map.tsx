"use client"

import { useCallback, useState, useEffect, KeyboardEvent } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  NodeTypes,
  EdgeTypes,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Toggle } from "@/components/ui/toggle"
import { ListTree, Network } from 'lucide-react'
import CustomNode from "./custom-node"
import CurvedEdge from "./curved-edge"
import { MindMapProps, MindMapNode, ViewMode } from "../types/mind-map"
import { calculateLayout } from "../utils/layout"
import { getBranchColor } from "../utils/colors"
import { TopicManager } from "../utils/topic-manager"
import OutlineView from "./outline-view"
import { Eye, List } from 'lucide-react'

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

const edgeTypes: EdgeTypes = {
  curved: CurvedEdge,
}

const initialNodes: MindMapNode[] = [
  {
    id: "1",
    type: "custom",
    data: { 
      label: "Main Idea",
      isRoot: true,
      level: 0,
      branchColor: getBranchColor(0),
      path: "1"
    },
    position: { x: 0, y: 0 },
  },
]

export default function MindMap({
  initialData,
  onChange,
  readOnly = false,
}: MindMapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialData?.nodes || initialNodes
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || [])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newNodeText, setNewNodeText] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("mindmap")
  const [keyType, setKeyType] = useState<'Tab' | 'Enter' | null>(null)

  const topicManager = new TopicManager(nodes)

  const updateLayout = useCallback(() => {
    setNodes((nds) => calculateLayout(nds))
  }, [setNodes])

  const addNode = useCallback(
    (parentId: string | null, label: string, isChild: boolean = true) => {
      const parentNode = parentId ? nodes.find((node) => node.id === parentId) : null
      if (parentId && !parentNode) return

      const newNodeId = `${Date.now()}`
      const newPath = topicManager.getNewNodePath(parentNode?.data.path || "1", isChild)

      const newNode: MindMapNode = {
        id: newNodeId,
        type: "custom",
        data: {
          label,
          level: isChild ? (parentNode?.data.level || 0) + 1 : parentNode?.data.level || 0,
          parentId: isChild ? parentId : parentNode?.data.parentId,
          path: newPath,
        },
        position: parentNode?.position || { x: 0, y: 0 },
      }

      const newEdge = parentId
        ? {
            id: `e${parentId}-${newNodeId}`,
            source: parentId,
            target: newNodeId,
            type: "curved",
          }
        : null

      setNodes((nds) => {
        const newNodes = nds.concat(newNode)
        const layoutedNodes = calculateLayout(newNodes)
        onChange?.({ nodes: layoutedNodes, edges: newEdge ? edges.concat(newEdge) : edges })
        return layoutedNodes
      })

      if (newEdge) {
        setEdges((eds) => eds.concat(newEdge))
      }

      return newNodeId
    },
    [nodes, edges, onChange, setNodes, setEdges, topicManager]
  )

  const deleteNode = useCallback(
    (nodeId: string) => {
      const nodeToDelete = nodes.find(node => node.id === nodeId)
      if (!nodeId || nodeToDelete?.data.isRoot) return

      // Get all descendant nodes
      const descendantPaths = nodes
        .filter(node => node.data.path.startsWith(nodeToDelete.data.path + "."))
        .map(node => node.id)

      const nodesToDelete = [nodeId, ...descendantPaths]

      setNodes((nds) => {
        const updatedNodes = nds.filter((node) => !nodesToDelete.includes(node.id))
        onChange?.({ nodes: updatedNodes, edges })
        return updatedNodes
      })

      setEdges((eds) => {
        const updatedEdges = eds.filter(
          (edge) => !nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)
        )
        onChange?.({ nodes, edges: updatedEdges })
        return updatedEdges
      })

      setSelectedNode(null)
    },
    [nodes, edges, onChange, setNodes, setEdges]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!selectedNode || isEditing || readOnly) return

      if (event.key === "Tab" || event.key === "Enter") {
        event.preventDefault()
        setIsEditing(true)
        setNewNodeText("")
        setKeyType(event.key as 'Tab' | 'Enter')
      } else if (event.key === "Delete") {
        event.preventDefault()
        deleteNode(selectedNode)
      }
    },
    [selectedNode, isEditing, readOnly, deleteNode]
  )

  const handleNewNode = useCallback(
    (isChild: boolean = true) => {
      if (!newNodeText.trim() || !selectedNode) return

      const newNodeId = addNode(selectedNode, newNodeText, isChild)
      setNewNodeText("")
      setIsEditing(false)
      setKeyType(null)
      setSelectedNode(newNodeId)
      updateLayout()

      // Log the markdown structure (for debugging)
      console.log(topicManager.getMarkdownStructure())
    },
    [selectedNode, newNodeText, addNode, updateLayout, topicManager]
  )

  useEffect(() => {
    updateLayout()
  }, [updateLayout])

  return (
    <div 
      className="relative w-full h-[600px] border rounded-lg"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      {viewMode === "mindmap" ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge({ ...params, type: 'curved' }, eds))}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          fitView
          className="bg-background"
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'curved',
            style: { stroke: '#999', strokeWidth: 2 },
          }}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      ) : (
        <OutlineView
          nodes={nodes}
          onNodeClick={setSelectedNode}
          selectedNode={selectedNode}
        />
      )}

      <div className="absolute bottom-4 right-4 flex flex-col gap-4">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setViewMode(viewMode === "mindmap" ? "outline" : "mindmap")}
          >
            {viewMode === "mindmap" ? (
              <>
                <List className="w-4 h-4 mr-2" />
                Show Outline
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Mind Map
              </>
            )}
          </Button>
        </div>

        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <p className="text-sm text-muted-foreground mb-2">Keyboard Shortcuts:</p>
          <div className="grid gap-1 text-sm">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
              <span>Add child node</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
              <span>Add sibling node</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Delete</kbd>
              <span>Delete selected node</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
              <span>Cancel editing</span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add New {selectedNode ? (keyType === "Tab" ? "Child" : "Sibling") : ""} Node
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              value={newNodeText}
              onChange={(e) => setNewNodeText(e.target.value)}
              placeholder="Enter node text"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNewNode(keyType === "Tab")
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleNewNode(keyType === "Tab")}>
                Add Node
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

