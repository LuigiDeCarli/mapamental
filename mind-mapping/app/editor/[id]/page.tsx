"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import MindMap from "@/components/mind-map"
import { useMindMapStore } from "@/store/mind-maps"

export default function EditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { currentMap, maps, setCurrentMap, updateMap } = useMindMapStore()

  useEffect(() => {
    const map = maps.find((m) => m.id === params.id)
    if (map) {
      setCurrentMap(map)
    } else {
      router.push("/")
    }
  }, [params.id, maps, setCurrentMap, router])

  if (!currentMap) {
    return null
  }

  return (
    <div className="h-screen">
      <MindMap
        initialData={{
          nodes: currentMap.nodes,
          edges: currentMap.edges,
        }}
        onChange={(data) => {
          updateMap({
            ...currentMap,
            nodes: data.nodes,
            edges: data.edges,
            updatedAt: new Date(),
          })
        }}
      />
    </div>
  )
}

