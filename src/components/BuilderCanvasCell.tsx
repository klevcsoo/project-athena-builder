import {useActiveTool} from "../hooks/useActiveTool";
import {MouseEventHandler, ReactNode, useCallback, useMemo, useState} from "react";
import {useWorldEntity} from "../hooks/useWorldEntity";
import {PlatformWorldObject} from "./worldObject/PlatformWorldObject";
import {cnx} from "../core/util";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {Coords} from "../lib/Coords";
import {SpawnWorldObject} from "./worldObject/SpawnWorldObject";
import {ToolShell} from "./ToolShell";
import {PressureButtonWorldObject} from "./worldObject/PressureButtonWorldObject";
import {SwitchWorldObject} from "./worldObject/SwitchWorldObject";
import {ShardWorldObject} from "./worldObject/ShardWorldObject";
import {Entity} from "../lib/entity/Entity";
import {PlatformProperties} from "../lib/entity/PlatformProperties";
import {SpawnProperties} from "../lib/entity/SpawnProperties";
import {PressureButtonProperties} from "../lib/entity/PressureButtonProperties";
import {SwitchProperties} from "../lib/entity/SwitchProperties";
import {ShardProperties} from "../lib/entity/ShardProperties";
import {createEntity} from "../core/entity";

export function BuilderCanvasCell(props: {
    coords: Coords
}) {
    const [activeTool] = useActiveTool();
    const [selectedCoords, setSelectedCoords] = useSelectedEntityCoords();
    const [hovering, setHovering] = useState(false);
    const [entity, setEntity] = useWorldEntity(props.coords);
    const [mouseInitPos, setMouseInitPos] = useState(new Coords(0, 0));

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

            setSelectedCoords(new Coords(props.coords.x, props.coords.y));

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
            selectedCoords.toString() === props.coords.toString() ?
                "border-opacity-100" : ""
        )} onMouseEnter={() => {
            setHovering(true);
        }} onMouseLeave={() => {
            setHovering(false);
        }} onClick={useTool} onMouseDown={event => {
            setMouseInitPos(new Coords(event.clientX, event.clientY));
        }}>
            <p className={cnx(
                "text-white", "text-sm", "text-opacity-10", "mx-1"
            )}>{props.coords.x}; {props.coords.y}            </p>
            {hovering ? (<ToolShell tool={activeTool}/>) : null}
            {entityObject}
        </div>
    );
}
