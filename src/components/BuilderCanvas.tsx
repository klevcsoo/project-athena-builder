import {MouseEventHandler, ReactNode, useCallback, useMemo, useState} from "react";
import {clamp, cnx} from "../core/util";
import {useActiveTool} from "../hooks/useActiveTool";
import {PointerToolShell} from "./pointer/PointerToolShell";
import {PlatformToolShell} from "./platform/PlatformToolShell";
import {SpawnToolShell} from "./spawn/SpawnToolShell";
import {useWorldEntity} from "../hooks/useWorldEntity";
import {PlatformEntity} from "./platform/PlatformEntity";

const CANVAS_VIRTUAL_WIDTH = 40 as const; // units
const CANVAS_VIRTUAL_HEIGHT = 20 as const; // units
const CANVAS_UNIT_SIZE = 100 as const; // px
const CANVAS_REAL_WIDTH = CANVAS_VIRTUAL_WIDTH * CANVAS_UNIT_SIZE; // px
const CANVAS_REAL_HEIGHT = CANVAS_VIRTUAL_HEIGHT * CANVAS_UNIT_SIZE; // px

export function BuilderCanvas() {
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const [dragging, setDragging] = useState(false);

    const beginDrag = useCallback<MouseEventHandler<HTMLTableElement>>(event => {
        setStartX(event.clientX);
        setStartY(event.clientY);
        setOffsetX(event.currentTarget.offsetLeft);
        setOffsetY(event.currentTarget.offsetTop);
        setDragging(true);
    }, []);

    const endDrag = useCallback<MouseEventHandler<HTMLTableElement>>(() => {
        setDragging(false);
    }, []);

    const updateDrag = useCallback<MouseEventHandler<HTMLTableElement>>(event => {
        if (!dragging) return;

        const elem = event.currentTarget;
        const tx = offsetX + event.clientX - startX;
        const ty = offsetY + event.clientY - startY;
        const x = clamp(tx, -CANVAS_REAL_WIDTH + window.innerWidth, 0);
        const y = clamp(ty, -CANVAS_REAL_HEIGHT + window.innerHeight, 0);
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
    }, [dragging, startX, startY, offsetX, offsetY]);

    return (
        <table width={CANVAS_REAL_WIDTH} style={{
            height: CANVAS_REAL_HEIGHT,
            left: `${-(CANVAS_REAL_WIDTH / 2) + window.innerWidth / 2}px`,
            top: `${-(CANVAS_REAL_HEIGHT / 2) + window.innerHeight / 2}px`,
        }} className={cnx(
            "absolute", "table-fixed",
            "bg-slate-900", dragging ? "cursor-move" : "cursor-default",
            "border-2", "border-slate-600"
        )} onMouseDown={beginDrag} onMouseUp={endDrag} onMouseMove={updateDrag}
               onMouseLeave={endDrag}>
            <tbody className={cnx("border-collapse", "border-spacing-0")}>
            {[...new Array(CANVAS_VIRTUAL_HEIGHT)].map((_, y) => (
                <tr>
                    {[...new Array(CANVAS_VIRTUAL_WIDTH)].map((_, x) => (
                        <td width={CANVAS_UNIT_SIZE} height={CANVAS_UNIT_SIZE}>
                            <BuilderCanvasCell x={x - CANVAS_VIRTUAL_WIDTH / 2}
                                               y={y - CANVAS_VIRTUAL_HEIGHT / 2}
                                               key={y * CANVAS_VIRTUAL_WIDTH + x}/>
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function BuilderCanvasCell(props: {
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
