import {useCallback, useEffect, useState} from "react";
import {Entity} from "../lib/entity/Entity";
import {Coords} from "../lib/Coords";
import {entityMap} from "../core/entity";

export function useWorldEntity(coords: Coords): [
        Entity | undefined, (e: Entity) => void
] {
    const [entity, setEntity] = useState<Entity | undefined>(
        entityMap.get(coords.toString())
    );

    const place = useCallback((e: Entity) => {
        if (entityMap.has(coords.toString())) {
            if (entityMap.get(coords.toString())!.typeName !== e.typeName) {
                entityMap.set(coords.toString(), e);
            }
        } else {
            entityMap.set(coords.toString(), e);
        }
    }, [coords]);

    useEffect(() => {
        const callback = (e: Entity | undefined) => setEntity(e);
        entityMap.on(coords.toString(), callback);
        return () => entityMap.off(coords.toString(), callback);
    }, [coords]);

    return [entity, place];
}
