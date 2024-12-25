"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, FileText, FolderOpen, Heart, MoreVertical, Plus, Search, Star, Users } from 'lucide-react'
import { useMindMapStore } from "@/store/mind-maps"

const templates = [
  {
    id: "blank",
    name: "Blank Map",
    icon: Plus,
    description: "Start from scratch",
  },
  {
    id: "mental",
    name: "Mental Map",
    icon: FileText,
    description: "Organize your thoughts",
  },
  {
    id: "org",
    name: "Organization Chart",
    icon: Users,
    description: "Create a hierarchy",
  },
]

export function Dashboard() {
  const router = useRouter()
  const { maps, addMap } = useMindMapStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newMapName, setNewMapName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleCreateMap = () => {
    if (!newMapName.trim()) return

    const newMap = {
      id: Date.now().toString(),
      name: newMapName,
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [
        {
          id: "1",
          type: "custom",
          data: {
            label: newMapName,
            isRoot: true,
            level: 0,
            path: "1",
          },
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
    }

    addMap(newMap)
    setIsCreateDialogOpen(false)
    setNewMapName("")
    setSelectedTemplate(null)
    router.push(`/editor/${newMap.id}`)
  }

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId)
    setNewMapName("")
    setIsCreateDialogOpen(true)
  }

  const filteredMaps = maps.filter((map) =>
    map.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background p-4">
        <div className="flex items-center gap-2 mb-8">
          <FileText className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Mind Maps</h1>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Team Maps
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <FolderOpen className="mr-2 h-4 w-4" />
            My Maps
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Recent
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Star className="mr-2 h-4 w-4" />
            Favorites
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">All Maps</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search maps..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Map
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Mind Map</DialogTitle>
                      <DialogDescription>
                        Give your mind map a name to get started
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        placeholder="Mind Map Name"
                        value={newMapName}
                        onChange={(e) => setNewMapName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateMap} disabled={!newMapName.trim()}>
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleTemplateClick(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center gap-2">
                      <template.icon className="h-8 w-8" />
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="all">All Maps</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="mt-4">
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMaps.map((map) => (
                    <Card
                      key={map.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => router.push(`/editor/${map.id}`)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{map.name}</CardTitle>
                            <CardDescription>
                              Updated {map.updatedAt.toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Heart className="mr-2 h-4 w-4" />
                                Add to favorites
                              </DropdownMenuItem>
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

