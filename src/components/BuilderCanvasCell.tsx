import {useActiveTool} from "../hooks/useActiveTool";
import {MouseEventHandler, ReactNode, useCallback, useMemo, useState} from "react";
import {useWorldEntity} from "../hooks/useWorldEntity";
import {cnx} from "../core/util";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {SpawnWorldObject} from "./worldObject/SpawnWorldObject";
import {ToolShell} from "./ToolShell";
import {PressureButtonWorldObject} from "./worldObject/PressureButtonWorldObject";
import {SwitchWorldObject} from "./worldObject/SwitchWorldObject";
import {ShardWorldObject} from "./worldObject/ShardWorldObject";
import {SpawnProperties} from "../lib/types/entity/SpawnProperties";
import {PressureButtonProperties} from "../lib/types/entity/PressureButtonProperties";
import {SwitchProperties} from "../lib/types/entity/SwitchProperties";
import {ShardProperties} from "../lib/types/entity/ShardProperties";
import {createEntity, Entity} from "../core/entity";
import {Coords, coordsEqual, createCoordinates} from "../core/coords";
import {useElevation} from "../hooks/useElevation";

export function BuilderCanvasCell(props: {
    coords: Coords
}) {
    const [activeTool] = useActiveTool();
    const [selectedCoords, setSelectedCoords] = useSelectedEntityCoords();
    const [elevation, increaseElevation] = useElevation(props.coords);
    const [hovering, setHovering] = useState(false);
    const [entity, setEntity] = useWorldEntity(props.coords);
    const [mouseInitPos, setMouseInitPos] = useState(createCoordinates(0, 0));

    const entityObject = useMemo<ReactNode>(() => {
        switch (entity?.typeName) {
            case "spawn":
                return <SpawnWorldObject character={
                    (entity as Entity<SpawnProperties>).character
                }/>;
            case "pressure-button":
                return <PressureButtonWorldObject colour={
                    (entity as Entity<PressureButtonProperties>).colour
                }/>;
            case "switch":
                return <SwitchWorldObject colour={
                    (entity as Entity<SwitchProperties>).colour
                }/>;
            case "shard":
                return <ShardWorldObject character={
                    (entity as Entity<ShardProperties>).character
                }/>;
            default:
                return null;
        }
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
                case "elevation": {
                    increaseElevation(event.button === 2 ? -1 : 1);
                    break;
                }
                case "spawn": {
                    setEntity(createEntity(
                        props.coords, "spawn", 0, {
                            character: "anna"
                        }));
                    break;
                }
                case "pressure-button": {
                    setEntity(createEntity(
                        props.coords, "pressure-button", 0, {
                            colour: Math.floor(Math.random() * 0xffffff),
                            channel: crypto.randomUUID()
                        }));
                    break;
                }
                case "switch": {
                    setEntity(createEntity(
                        props.coords, "switch", 0, {
                            colour: Math.floor(Math.random() * 0xffffff),
                            channel: crypto.randomUUID()
                        }));
                    break;
                }
                case "shard": {
                    setEntity(createEntity(
                        props.coords, "shard", 0, {
                            character: "both"
                        }));
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
