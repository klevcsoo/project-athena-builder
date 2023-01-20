import {PubSubMapEventHandler} from "../lib/PubSubMapEventHandler";
import {CoordinatesString} from "../lib/CoordinatesString";
import {Entity} from "../lib/Entity";
import {Coords} from "../lib/Coords";
import {SpawnEntity} from "../lib/SpawnEntity";
import {EntityMapValidityResult} from "../lib/EntityMapValidityResult";

export const entityMap = new PubSubMapEventHandler<CoordinatesString, Entity>();

export function getEntityAt(c: Coords): Entity | undefined {
    return entityMap.get(c.toString());
}

export function updateEntityAt<T extends Entity>(c: Coords, properties: Partial<T>) {
    entityMap.set(c.toString(), {...entityMap.get(c.toString())!, ...properties});
}

export function destroyEntityAt(c: Coords) {
    entityMap.delete(c.toString());
}

export function checkEntityMapValidity(): EntityMapValidityResult {
    let spawnPointCount = 0;
    let annaSpawnExists = false;
    let benSpawnExists = false;
    for (const entity of entityMap.values()) {
        if (entity.entityType === "spawn") {
            spawnPointCount++;
            if ((entity as SpawnEntity).character === "anna") {
                annaSpawnExists = true;
            } else if ((entity as SpawnEntity).character === "ben") {
                benSpawnExists = true;
            }
        }
    }

    if (spawnPointCount > 2) {
        return "spawn-points.too-many";
    } else if (!annaSpawnExists) {
        return "spawn-points.missing-anna";
    } else if (!benSpawnExists) {
        return "spawn-points.missing-ben";
    } else {
        return "ok";
    }
}
