import {ToolboxTool} from "../lib/ToolboxTool";
import {useCallback, useEffect, useState} from "react";

const LS_KEY = "toolbox.active_tool";
const toolboxKeyMap: Map<string, ToolboxTool> = new Map([
    ["KeyV", "pointer"],
    ["KeyP", "platform"]
]);

// Initialize toolbox shortcuts
// Refuses to work if I don't put the in an
// anonymous function for some reason
(() => {
    window.addEventListener("keypress", ({code}) => {
        if (toolboxKeyMap.has(code)) {
            localStorage.setItem(LS_KEY, toolboxKeyMap.get(code)!);
        }
    });
})();

export function useActiveTool(): [ToolboxTool, (tool: ToolboxTool) => void] {
    const [tool, setTool] = useState<ToolboxTool>(localStorage.getItem(LS_KEY) as any);

    // Not exactly an elegant solution, but refuses to work if
    // I leave the checking to React
    useEffect(() => {
        const id = setInterval(() => {
            setTool(localStorage.getItem(LS_KEY) as any);
        }, 100);

        return () => clearInterval(id);
    }, []);

    const set = useCallback((newTool: ToolboxTool) => {
        localStorage.setItem(LS_KEY, newTool);
    }, []);

    return [tool, set];
}
