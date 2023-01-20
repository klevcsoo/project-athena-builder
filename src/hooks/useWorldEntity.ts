import {useCallback, useEffect, useMemo, useState} from "react";
import {Entity} from "../lib/Entity";
import {Coords} from "../lib/Coords";
import {CoordinatesString} from "../lib/CoordinatesString";

const entities: Map<CoordinatesString, Entity> = new Map();

export function useWorldEntity(coords: { x: number; y: number }): [
        Entity | undefined, (e: Entity) => void
] {
    const coordsString = useMemo<CoordinatesString>(() => {
        return `${coords.x};${coords.y}`;
    }, [coords]);

    const [entity, setEntity] = useState<Entity | undefined>(
        entities.has(coordsString) ? entities.get(coordsString) : undefined
    );

    const place = useCallback((e: Entity) => {
        if (entities.has(coordsString)) setEntity(undefined);
        else setEntity(e);
    }, [coordsString]);

    useEffect(() => {
        if (!entity) entities.delete(coordsString);
        else entities.set(coordsString, entity);
    }, [entity, coordsString]);

    return [entity, place];
}

export function getEntityAt(c: Coords): Entity | undefined {
    return entities.get(c.toString());
}
