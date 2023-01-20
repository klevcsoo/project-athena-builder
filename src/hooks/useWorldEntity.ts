import {useCallback, useEffect, useState} from "react";
import {Entity} from "../lib/Entity";
import {Coords} from "../lib/Coords";
import {CoordinatesString} from "../lib/CoordinatesString";
import {PubSubMapEventHandler} from "../lib/PubSubMapEventHandler";

const pubsub = new PubSubMapEventHandler<CoordinatesString, Entity>();

export function useWorldEntity(coords: Coords): [
        Entity | undefined, (e: Entity) => void
] {
    const [entity, setEntity] = useState<Entity | undefined>(
        pubsub.get(coords.toString())
    );

    const place = useCallback((e: Entity) => {
        if (pubsub.has(coords.toString())) {
            pubsub.delete(coords.toString());
        } else {
            pubsub.set(coords.toString(), e);
        }
    }, [coords]);

    useEffect(() => {
        const callback = (e: Entity | undefined) => setEntity(e);
        pubsub.on(coords.toString(), callback);
        return () => pubsub.off(coords.toString(), callback);
    }, [coords]);

    return [entity, place];
}

export function getEntityAt(c: Coords): Entity | undefined {
    return pubsub.get(c.toString());
}

export function updateEntityAt<T extends Entity>(c: Coords, properties: Partial<T>) {
    pubsub.set(c.toString(), {...pubsub.get(c.toString())!, ...properties});
}
