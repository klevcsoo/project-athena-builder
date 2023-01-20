import {useActiveTool} from "../hooks/useActiveTool";
import {ReactNode, useCallback, useMemo, useState} from "react";
import {useWorldEntity} from "../hooks/useWorldEntity";
import {PointerToolShell} from "./pointer/PointerToolShell";
import {PlatformToolShell} from "./platform/PlatformToolShell";
import {SpawnToolShell} from "./spawn/SpawnToolShell";
import {PlatformEntity} from "./platform/PlatformEntity";
import {cnx} from "../core/util";

export function BuilderCanvasCell(props: {
    x: number
    y: number
}) {
    const [activeTool] = useActiveTool();
    const [hovering, setHovering] = useState(false);

    const {entity, placeEntity} = useWorldEntity(props);

    const toolShell = useMemo<ReactNode>(() => {
        switch (activeTool) {
            case "pointer":
                return <PointerToolShell/>;
            case "platform":
                return <PlatformToolShell/>;
            case "spawn":
                return <SpawnToolShell/>;
            default: {
                setHovering(false);
                throw new Error("Invalid tool name");
            }
        }
    }, [activeTool]);

    const entityObject = useMemo<ReactNode>(() => {
        switch (entity) {
            case "platform":
                return <PlatformEntity/>;
            default:
                return null;
        }
    }, [entity]);

    const useTool = useCallback(() => {
        if (activeTool === "platform") {
            placeEntity("platform");
        }
    }, [activeTool, placeEntity]);

    return (
        <div className={cnx(
            "relative", "w-full", "h-full",
            "border", "border-dashed", "border-white",
            "border-opacity-10"
        )} onMouseEnter={() => {
            setHovering(true);
        }} onMouseLeave={() => {
            setHovering(false);
        }} onClick={useTool}>
            <p className={cnx(
                "text-white", "text-sm", "text-opacity-10"
            )}>{props.x}; {props.y}            </p>
            {hovering ? toolShell : null}
            {entityObject}
        </div>
    );
}