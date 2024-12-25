export const branchColors = [
  "rgb(56, 127, 237)", // Blue
  "rgb(82, 196, 26)",  // Green
  "rgb(250, 176, 5)",  // Orange
  "rgb(235, 87, 87)",  // Red
  "rgb(147, 51, 234)"  // Purple
]

export const getBranchColor = (index: number): string => {
  return branchColors[index % branchColors.length]
}

export const getLighterShade = (color: string, factor: number = 0.2): string => {
  const rgb = color.match(/\d+/g)?.map(Number)
  if (!rgb) return color
  
  const lighter = rgb.map(c => Math.round(c + (255 - c) * factor))
  return `rgb(${lighter.join(", ")})`
}

