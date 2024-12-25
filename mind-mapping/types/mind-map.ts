import { Node, Edge } from 'reactflow'

export interface MindMap {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  thumbnail?: string
  nodes: MindMapNode[]
  edges: Edge[]
}

export interface NodeStyle {
  backgroundColor?: string
  borderColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderWidth?: number
  textColor?: string
  fontSize?: number
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  padding?: number
  borderRadius?: number
}

export interface MindMapNode extends Node {
  data: {
    label: string
    isRoot?: boolean
    parentId?: string
    level: number
    branchIndex?: number
    branchColor?: string
    collapsed?: boolean
    path: string
    style?: NodeStyle
  }
}

export interface MindMapData {
  nodes: MindMapNode[]
  edges: Edge[]
}

export interface MindMapProps {
  initialData?: MindMapData
  onChange?: (data: MindMapData) => void
  readOnly?: boolean
}

export type ViewMode = 'mindmap' | 'outline'

