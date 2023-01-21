import {ToolboxTool} from "../lib/ToolboxTool";
import {useCallback, useEffect, useState} from "react";
import {PubSubEventHandler} from "../lib/PubSubEventHandler";

const pubsub = new PubSubEventHandler<ToolboxTool>("pointer");

// Initialize toolbox shortcuts
// Refuses to work if I don't put the in an
// anonymous function for some reason
(() => {
    const toolboxKeyMap: Map<string, ToolboxTool> = new Map([
        ["KeyV", "pointer"],
        ["KeyP", "platform"],
        ["KeyS", "switch"],
        ["KeyB", "pressure-button"]
    ]);

    window.addEventListener("keypress", ({code}) => {
        if (toolboxKeyMap.has(code)) {
            pubsub.update(toolboxKeyMap.get(code)!);
        }
    });
})();

export function useActiveTool(): [ToolboxTool, (tool: ToolboxTool) => void] {
    const [tool, setTool] = useState<ToolboxTool>(pubsub.get());

    const set = useCallback((newTool: ToolboxTool) => {
        pubsub.update(newTool);
    }, []);

    useEffect(() => {
        const callback = (t: ToolboxTool) => setTool(t);
        pubsub.on(callback);
        return () => pubsub.off(callback);
    }, []);


    return [tool, set];
}
