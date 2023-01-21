export type ToolboxTool =
    "pointer" | "platform" | "spawn" | "pressure-button" | "switch"

export const toolIconMap: { [key in ToolboxTool]: string } = {
    "pointer": "arrow_selector_tool",
    "platform": "smart_button",
    "spawn": "person_pin_circle",
    "pressure-button": "space_bar",
    "switch": "switch"
};
