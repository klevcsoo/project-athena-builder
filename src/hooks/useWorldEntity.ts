import {ToolboxTool} from "../lib/ToolboxTool";
import {useCallback, useEffect, useMemo, useState} from "react";

type CoordinateString = `${number};${number}`

const entities: Map<CoordinateString, ToolboxTool> = new Map();

export function useWorldEntity(coords: { x: number; y: number }): {
    entity: ToolboxTool | undefined
    placeEntity(entityType: ToolboxTool): void
} {
    const coordsString = useMemo<CoordinateString>(() => {
        return `${coords.x};${coords.y}`;
    }, [coords]);

    const [entity, setEntity] = useState<ToolboxTool | undefined>(
        entities.has(coordsString) ? entities.get(coordsString) : undefined
    );

    const place = useCallback((e: ToolboxTool) => {
        setEntity(e);
    }, []);

    useEffect(() => {
        if (!entity) entities.delete(coordsString);
        else entities.set(coordsString, entity);
    }, [entity, coordsString]);

    return {
        entity: entity,
        placeEntity: place
    };
}
