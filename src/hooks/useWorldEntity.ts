import {useCallback, useEffect, useState} from "react";
import {Entity} from "../lib/Entity";
import {Coords} from "../lib/Coords";
import {CoordinatesString} from "../lib/CoordinatesString";

const entities: Map<CoordinatesString, Entity> = new Map();
(window as any)["displayEntities"] = () => {
    console.dir(entities.entries());
};

export function useWorldEntity(coords: Coords): [
        Entity | undefined, (e: Entity) => void
] {
    const [entity, setEntity] = useState<Entity | undefined>(
        entities.has(coords.toString()) ? entities.get(coords.toString()) : undefined
    );

    const place = useCallback((e: Entity) => {
        entities.set(coords.toString(), e);
    }, [coords]);

    useEffect(() => {
        if (!entity) entities.delete(coords.toString());
        else entities.set(coords.toString(), entity);
    }, [entity, coords]);

    useEffect(() => {
        const id = setInterval(() => {
            setEntity(entities.get(coords.toString()));
        }, 100);

        return () => clearInterval(id);
    }, [coords]);

    return [entity, place];
}

export function getEntityAt(c: Coords): Entity | undefined {
    return entities.get(c.toString());
}

export function updateEntityAt<T extends Entity>(c: Coords, properties: Partial<T>) {
    entities.set(c.toString(), {...entities.get(c.toString())!, ...properties});
}
