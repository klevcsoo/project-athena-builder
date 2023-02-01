import {useActiveTool} from "../hooks/useActiveTool";
import {MouseEventHandler, ReactNode, useCallback, useMemo, useState} from "react";
import {useWorldEntity} from "../hooks/useWorldEntity";
import {cnx} from "../core/util";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {ToolShell} from "./ToolShell";
import {createEntity, entityWorldObjects,} from "../core/entity";
import {Coords, coordsEqual, createCoordinates} from "../core/coords";
import {useElevation} from "../hooks/useElevation";
import {randomColour} from "../core/colour";

export function BuilderCanvasCell(props: {
    coords: Coords
}) {
    const [activeTool] = useActiveTool();
    const [selectedCoords, setSelectedCoords] = useSelectedEntityCoords();
    const [elevation, increaseElevation] = useElevation(props.coords);
    const [entity, setEntity] = useWorldEntity(props.coords);

    const [mouseInitPos, setMouseInitPos] = useState(createCoordinates(0, 0));
    const [hovering, setHovering] = useState(false);

    const entityObject = useMemo<ReactNode>(() => {
        if (!!entity) return entityWorldObjects[entity.typeName](entity as any);
        else return null;
    }, [entity]);

    const useTool = useCallback<MouseEventHandler<HTMLDivElement>>(
        (event) => {
            if (event.button === 2) event.preventDefault();

            if (mouseInitPos.x !== event.clientX ||
                mouseInitPos.y !== event.clientY) {
                return;
            }

            setSelectedCoords(props.coords);

            switch (activeTool) {
                case "pointer":
                    break;
                case "elevation": {
                    increaseElevation(event.button === 2 ? -1 : 1);
                    break;
                }
                case "spawn": {
                    setEntity(createEntity(
                        props.coords, "spawn", {
                            character: "anna"
                        }));
                    break;
                }
                case "pressure-button": {
                    setEntity(createEntity(
                        props.coords, "pressure-button", {
                            colour: randomColour(),
                            channel: crypto.randomUUID()
                        }));
                    break;
                }
                case "switch": {
                    setEntity(createEntity(
                        props.coords, "switch", {
                            colour: randomColour(),
                            channel: crypto.randomUUID()
                        }));
                    break;
                }
                case "shard": {
                    setEntity(createEntity(
                        props.coords, "shard", {
                            character: "both"
                        }));
                    break;
                }
                case "door": {
                    setEntity(createEntity(
                        props.coords, "door", {
                            colour: randomColour(),
                            channel: crypto.randomUUID()
                        }
                    ));
                    break;
                }
                case "level-finish": {
                    setEntity(createEntity(
                        props.coords, "level-finish", {
                            character: "both"
                        }
                    ));
                    break;
                }
                default: {
                    break;
                }
            }
        }, [activeTool, setEntity, setSelectedCoords, props.coords, mouseInitPos]
    );

    return (
        <div className={cnx(
            "relative", "w-full", "h-full",
            "border", "border-dashed", "border-white",
            "border-opacity-10",
            coordsEqual(selectedCoords, props.coords) ?
                "border-opacity-100" : ""
        )} onMouseEnter={() => {
            setHovering(true);
        }} onMouseLeave={() => {
            setHovering(false);
        }} onClick={useTool} onContextMenu={useTool} onMouseDown={event => {
            setMouseInitPos(createCoordinates(event.clientX, event.clientY));
        }}>
            <p className={cnx(
                "text-white", "text-sm", "text-opacity-10", "mx-1"
            )}>{props.coords.x}; {props.coords.y}</p>
            {elevation === 0 ? null : (
                <div className={cnx(
                    "absolute", "inset-0",
                    "bg-slate-800", "rounded-md"
                )}></div>
            )}
            {entityObject}
            {elevation === 0 ? null : (
                <div className={cnx(
                    "absolute", "right-2", "top-1", "z-30",
                    "bg-black", "px-1", "rounded-sm",
                    "text-white", "text-sm",
                    "font-bold"
                )}>{elevation}</div>
            )}
            {hovering ? (<ToolShell tool={activeTool}/>) : null}
        </div>
    );
}
