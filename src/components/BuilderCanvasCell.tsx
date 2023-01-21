import {useActiveTool} from "../hooks/useActiveTool";
import {MouseEventHandler, ReactNode, useCallback, useMemo, useState} from "react";
import {useWorldEntity} from "../hooks/useWorldEntity";
import {PlatformWorldObject} from "./worldObject/PlatformWorldObject";
import {cnx} from "../core/util";
import {PlatformEntity} from "../lib/entity/PlatformEntity";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {Coords} from "../lib/Coords";
import {SpawnWorldObject} from "./worldObject/SpawnWorldObject";
import {SpawnEntity} from "../lib/entity/SpawnEntity";
import {ToolShell} from "./ToolShell";
import {PressureButtonWorldObject} from "./worldObject/PressureButtonWorldObject";
import {PressureButtonEntity} from "../lib/entity/PressureButtonEntity";

export function BuilderCanvasCell(props: {
    coords: Coords
}) {
    const [activeTool] = useActiveTool();
    const [selectedCoords, setSelectedCoords] = useSelectedEntityCoords();
    const [hovering, setHovering] = useState(false);
    const [entity, setEntity] = useWorldEntity(props.coords);
    const [mouseInitPos, setMouseInitPos] = useState(new Coords(0, 0));

    const entityObject = useMemo<ReactNode>(() => {
        switch (entity?.entityType) {
            case "platform":
                return <PlatformWorldObject orientation={
                    (entity as PlatformEntity).orientation
                }/>;
            case "spawn":
                return <SpawnWorldObject character={
                    (entity as SpawnEntity).character
                }/>;
            case "pressure-button":
                return <PressureButtonWorldObject color={
                    (entity as PressureButtonEntity).colour
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
                    setEntity(new PlatformEntity(props.coords));
                    break;
                }
                case "spawn": {
                    setEntity(new SpawnEntity(props.coords));
                    break;
                }
                case "pressure-button": {
                    setEntity(new PressureButtonEntity(props.coords));
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
                "text-white", "text-sm", "text-opacity-10"
            )}>{props.coords.x}; {props.coords.y}            </p>
            {hovering ? (<ToolShell tool={activeTool}/>) : null}
            {entityObject}
        </div>
    );
}
