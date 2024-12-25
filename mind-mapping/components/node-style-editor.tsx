"use client"

import { NodeStyle } from "../types/mind-map"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Circle } from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"

interface NodeStyleEditorProps {
  style: NodeStyle
  onChange: (style: NodeStyle) => void
}

export function NodeStyleEditor({ style, onChange }: NodeStyleEditorProps) {
  const updateStyle = (updates: Partial<NodeStyle>) => {
    onChange({ ...style, ...updates })
  }

  return (
    <div className="p-4 border rounded-lg bg-background shadow-lg">
      <Tabs defaultValue="shape">
        <TabsList className="w-full">
          <TabsTrigger value="shape" className="flex-1">Shape</TabsTrigger>
          <TabsTrigger value="border" className="flex-1">Border</TabsTrigger>
          <TabsTrigger value="text" className="flex-1">Text</TabsTrigger>
        </TabsList>

        <TabsContent value="shape" className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Background Color</label>
            <div className="flex gap-2">
              {["#FFFFFF", "#F3F4F6", "#E5E7EB", "#D1D5DB"].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: color }}
                  onClick={() => updateStyle({ backgroundColor: color })}
                />
              ))}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Circle className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="grid grid-cols-5 gap-2">
                    {/* Add color picker content */}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Border Radius</label>
            <Slider
              value={[style.borderRadius || 4]}
              min={0}
              max={20}
              step={1}
              onValueChange={([value]) => updateStyle({ borderRadius: value })}
            />
          </div>
        </TabsContent>

        <TabsContent value="border" className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Border Style</label>
            <div className="flex gap-2">
              <Button
                variant={style.borderStyle === "solid" ? "default" : "outline"}
                onClick={() => updateStyle({ borderStyle: "solid" })}
              >
                Solid
              </Button>
              <Button
                variant={style.borderStyle === "dashed" ? "default" : "outline"}
                onClick={() => updateStyle({ borderStyle: "dashed" })}
              >
                Dashed
              </Button>
              <Button
                variant={style.borderStyle === "dotted" ? "default" : "outline"}
                onClick={() => updateStyle({ borderStyle: "dotted" })}
              >
                Dotted
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Border Width</label>
            <Slider
              value={[style.borderWidth || 1]}
              min={1}
              max={5}
              step={1}
              onValueChange={([value]) => updateStyle({ borderWidth: value })}
            />
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <div className="flex gap-2">
            <Toggle
              pressed={style.fontWeight === "bold"}
              onPressedChange={(pressed) =>
                updateStyle({ fontWeight: pressed ? "bold" : "normal" })
              }
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle>
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle>
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>

          <div className="flex gap-2">
            <Toggle>
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle>
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle>
              <AlignRight className="h-4 w-4" />
            </Toggle>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <Slider
              value={[style.fontSize || 14]}
              min={10}
              max={24}
              step={1}
              onValueChange={([value]) => updateStyle({ fontSize: value })}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

