import {cnx} from "../core/util";
import {useActiveTool} from "../hooks/useActiveTool";
import {ToolboxTool, toolIconMap} from "../lib/ToolboxTool";
import {useMemo} from "react";
import {MaterialSymbol} from "../components/ui/MaterialSymbol";

export function ToolboxLayout() {
    return (
        <div className={cnx(
            "absolute", "inset-4", "z-30",
            "w-16", "p-2",
            "bg-[#00000060]", "backdrop-blur-lg", "rounded-xl",
            "flex", "flex-col", "items-center", "gap-2"
        )}>
            <ToolboxButton tool={"pointer"}/>
            <ToolboxButton tool={"platform"}/>
            <ToolboxButton tool={"spawn"}/>
            <ToolboxButton tool={"pressure-button"}/>
            <ToolboxButton tool={"switch"}/>
        </div>
    );
}

function ToolboxButton(props: {
    tool: ToolboxTool
}) {
    const [tool, setTool] = useActiveTool();
    const isActive = useMemo<boolean>(() => {
        return props.tool === tool;
    }, [props.tool, tool]);

    return (
        <button type={"button"} className={cnx(
            "w-full", "aspect-square",
            "bg-neutral-900", "rounded-lg",
            "grid", "place-content-center",
            "hover:bg-neutral-800", "group",
            isActive ? cnx(
                "bg-neutral-50",
                "hover:bg-neutral-100"
            ) : ""
        )} onClick={() => setTool(props.tool)}>
            <MaterialSymbol name={toolIconMap[props.tool]} className={cnx(
                "text-white",
                "group-hover:text-blue-400",
                isActive ? "text-black" : ""
            )}/>
        </button>
    );
}
