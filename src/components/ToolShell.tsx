import {cnx} from "../core/util";
import {MaterialSymbol} from "./ui/MaterialSymbol";
import {ToolboxTool, toolIconMap} from "../lib/ToolboxTool";
import {Fragment, useMemo} from "react";

export function ToolShell(props: {
    tool: ToolboxTool
}) {
    const icon = useMemo<string | void>(() => {
        if (props.tool !== "pointer") return toolIconMap[props.tool];
    }, [props.tool]);

    return (
        <Fragment>
            <div className={cnx(
                "absolute", "inset-0", "z-20",
                "w-full", "h-full",
                "border-2", "border-white",
                "animate-breathe"
            )}></div>
            {!icon ? null : (
                <div className={cnx(
                    "absolute", "inset-0", "z-20",
                    "w-full", "h-full", "p-2",
                    "grid", "place-content-center",
                    "text-center", "text-white"
                )}>
                    <MaterialSymbol name={icon} className={"text-4xl"}/>
                    <p className={"text-xs"}>
                        {props.tool.replace("-", " ")}
                    </p>
                </div>
            )}
        </Fragment>
    );
}
