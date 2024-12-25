import { create } from 'zustand'
import { MindMap } from '../types/mind-map'

interface MindMapStore {
  maps: MindMap[]
  currentMap: MindMap | null
  addMap: (map: MindMap) => void
  updateMap: (map: MindMap) => void
  setCurrentMap: (map: MindMap | null) => void
}

export const useMindMapStore = create<MindMapStore>((set) => ({
  maps: [],
  currentMap: null,
  addMap: (map) => set((state) => ({ maps: [...state.maps, map] })),
  updateMap: (updatedMap) =>
    set((state) => ({
      maps: state.maps.map((map) => (map.id === updatedMap.id ? updatedMap : map)),
    })),
  setCurrentMap: (map) => set({ currentMap: map }),
}))

