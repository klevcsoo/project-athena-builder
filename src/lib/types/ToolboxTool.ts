export const toolIconMap = {
    "pointer": "arrow_selector_tool",
    "elevation": "altitude",
    "spawn": "person_pin_circle",
    "pressure-button": "space_bar",
    "switch": "switch",
    "shard": "diamond"
} as const;

export type ToolboxTool = keyof typeof toolIconMap
