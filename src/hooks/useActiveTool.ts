import {ToolboxTool} from "../lib/ToolboxTool";
import {useCallback, useEffect, useState} from "react";

const LS_KEY = "toolbox.active_tool";

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
