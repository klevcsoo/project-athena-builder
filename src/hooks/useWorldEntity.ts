import {useCallback, useEffect, useMemo, useState} from "react";
import {Entity, entityMap} from "../core/entity";
import {Coords, coordsKey} from "../core/coords";

export function useWorldEntity(coords: Coords): [
        Entity | undefined, (e: Entity) => void
] {
    const key = useMemo<string>(() => {
        return coordsKey(coords);
    }, [coords]);

    const [entity, setEntity] = useState<Entity | undefined>(
        entityMap.get(key)
    );

    const place = useCallback((e: Entity) => {
        if (entityMap.has(key)) {
            if (entityMap.get(key)!.typeName !== e.typeName) {
                entityMap.set(key, e);
            }
        } else {
            entityMap.set(key, e);
        }
    }, [key]);

    useEffect(() => {
        const callback = (e: Entity | undefined) => setEntity(e);
        entityMap.on(key, callback);
        return () => entityMap.off(key, callback);
    }, [key]);

    return [entity, place];
}
