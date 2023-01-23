export type ToolboxTool =
    "pointer" | "platform" | "spawn" | "pressure-button" | "switch" | "shard"

export const toolIconMap: { [key in ToolboxTool]: string } = {
    "pointer": "arrow_selector_tool",
    "platform": "check_box_outline_blank",
    "spawn": "person_pin_circle",
    "pressure-button": "space_bar",
    "switch": "switch",
    "shard": "diamond"
};
