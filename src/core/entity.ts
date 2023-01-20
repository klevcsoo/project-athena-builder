import {PubSubMapEventHandler} from "../lib/PubSubMapEventHandler";
import {CoordinatesString} from "../lib/CoordinatesString";
import {Entity} from "../lib/Entity";
import {Coords} from "../lib/Coords";

export const entityMap = new PubSubMapEventHandler<CoordinatesString, Entity>();

export function getEntityAt(c: Coords): Entity | undefined {
    return entityMap.get(c.toString());
}

export function updateEntityAt<T extends Entity>(c: Coords, properties: Partial<T>) {
    entityMap.set(c.toString(), {...entityMap.get(c.toString())!, ...properties});
}
