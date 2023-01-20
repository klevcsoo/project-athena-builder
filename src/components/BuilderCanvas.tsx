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

    const mouseDown = useCallback<MouseEventHandler<HTMLDivElement>>(event => {
        setStartX(event.clientX);
        setStartY(event.clientY);
        setOffsetX(event.currentTarget.offsetLeft);
        setOffsetY(event.currentTarget.offsetTop);
        setDragging(true);
    }, []);

    const mouseUp = useCallback<MouseEventHandler<HTMLDivElement>>(() => {
        setDragging(false);
    }, []);

    const mouseMove = useCallback<MouseEventHandler<HTMLDivElement>>(event => {
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
        <div className={cnx(
            "absolute", "grid",
            "bg-slate-900", dragging ? "cursor-move" : "cursor-default",
            "border-2", "border-slate-600"
        )} style={{
            width: `${CANVAS_REAL_WIDTH}px`,
            height: `${CANVAS_REAL_HEIGHT}px`,
            left: `${-(CANVAS_REAL_WIDTH / 2) + window.innerWidth / 2}px`,
            top: `${-(CANVAS_REAL_HEIGHT / 2) + window.innerHeight / 2}`,
            transform: `scale(1)`,
            gridTemplateColumns: `repeat(${CANVAS_VIRTUAL_WIDTH}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${CANVAS_VIRTUAL_HEIGHT}, minmax(0, 1fr))`
        }} onMouseDown={mouseDown} onMouseUp={mouseUp} onMouseMove={mouseMove}
             onMouseLeave={mouseUp}>
            {[...new Array(CANVAS_VIRTUAL_WIDTH * CANVAS_VIRTUAL_HEIGHT)]
                .map((_, index) => (
                    <BuilderCanvasCell key={index} index={index}/>
                ))
            }
        </div>
    );
}

function BuilderCanvasCell(props: {
    index: number
}) {
    const [activeTool] = useActiveTool();
    const [hovering, setHovering] = useState(false);

    const coords = useMemo<{ x: number, y: number }>(() => {
        const y = Math.floor(props.index / CANVAS_VIRTUAL_WIDTH);
        const x = props.index - y * CANVAS_VIRTUAL_WIDTH;
        return {x: x, y: y};
    }, [props.index]);

    const {entity, placeEntity} = useWorldEntity(coords);

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
        <div key={props.index} className={cnx(
            "relative",
            "border", "border-dashed", "border-white",
            "border-opacity-10"
        )} onMouseEnter={() => {
            setHovering(true);
        }} onMouseLeave={() => {
            setHovering(false);
        }} onClick={useTool}>
            <p className={cnx(
                "text-white", "text-sm", "text-opacity-10"
            )}>{coords.x}; {coords.y}            </p>
            {hovering ? toolShell : null}
            {entityObject}
        </div>
    );
}
