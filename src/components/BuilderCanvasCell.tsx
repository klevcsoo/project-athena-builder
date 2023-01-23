import {useActiveTool} from "../hooks/useActiveTool";
import {MouseEventHandler, ReactNode, useCallback, useMemo, useState} from "react";
import {useWorldEntity} from "../hooks/useWorldEntity";
import {PlatformWorldObject} from "./worldObject/PlatformWorldObject";
import {cnx} from "../core/util";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {SpawnWorldObject} from "./worldObject/SpawnWorldObject";
import {ToolShell} from "./ToolShell";
import {PressureButtonWorldObject} from "./worldObject/PressureButtonWorldObject";
import {SwitchWorldObject} from "./worldObject/SwitchWorldObject";
import {ShardWorldObject} from "./worldObject/ShardWorldObject";
import {PlatformProperties} from "../lib/types/entity/PlatformProperties";
import {SpawnProperties} from "../lib/types/entity/SpawnProperties";
import {PressureButtonProperties} from "../lib/types/entity/PressureButtonProperties";
import {SwitchProperties} from "../lib/types/entity/SwitchProperties";
import {ShardProperties} from "../lib/types/entity/ShardProperties";
import {createEntity, Entity} from "../core/entity";
import {Coords, coordsEqual, createCoordinates} from "../core/coords";

export function BuilderCanvasCell(props: {
    coords: Coords
}) {
    const [activeTool] = useActiveTool();
    const [selectedCoords, setSelectedCoords] = useSelectedEntityCoords();
    const [hovering, setHovering] = useState(false);
    const [entity, setEntity] = useWorldEntity(props.coords);
    const [mouseInitPos, setMouseInitPos] = useState(createCoordinates(0, 0));

    const entityObject = useMemo<ReactNode>(() => {
        switch (entity?.typeName) {
            case "platform":
                return <PlatformWorldObject orientation={
                    (entity as Entity<PlatformProperties>).orientation
                }/>;
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
            if (mouseInitPos.x !== event.clientX || mouseInitPos.y !== event.clientY) {
                return;
            }

            setSelectedCoords(createCoordinates(props.coords.x, props.coords.y));

            switch (activeTool) {
                case "platform": {
                    setEntity(createEntity(
                        props.coords, "platform", {
                            orientation: "south"
                        }));
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
                            colour: Math.floor(Math.random() * 0xffffff),
                            channel: crypto.randomUUID()
                        }));
                    break;
                }
                case "switch": {
                    setEntity(createEntity(
                        props.coords, "switch", {
                            colour: Math.floor(Math.random() * 0xffffff),
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
        }} onClick={useTool} onMouseDown={event => {
            setMouseInitPos(createCoordinates(event.clientX, event.clientY));
        }}>
            <p className={cnx(
                "text-white", "text-sm", "text-opacity-10", "mx-1"
            )}>{props.coords.x}; {props.coords.y}            </p>
            {hovering ? (<ToolShell tool={activeTool}/>) : null}
            {entityObject}
        </div>
    );
}
