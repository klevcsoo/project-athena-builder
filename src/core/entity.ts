import {PubSubMapEventHandler} from "../lib/PubSubMapEventHandler";
import {EntityMapValidityResult} from "../lib/types/EntityMapValidityResult";
import {LevelData} from "../lib/types/LevelData";
import {CANVAS_VIRTUAL_HEIGHT, CANVAS_VIRTUAL_WIDTH} from "../components/BuilderCanvas";
import {EntityTypeMap} from "../lib/types/entity/EntityTypeMap";
import {SpawnProperties} from "../lib/types/entity/SpawnProperties";
import {PressureButtonProperties} from "../lib/types/entity/PressureButtonProperties";
import {SwitchProperties} from "../lib/types/entity/SwitchProperties";
import {ShardProperties} from "../lib/types/entity/ShardProperties";
import {EmptyEntityProperties} from "../lib/types/entity/EmptyEntityProperties";
import {Coords, coordsKey, createCoordinates} from "./coords";

// lol
type BaseEntityMap = { empty: EmptyEntityProperties } & EntityTypeMap
export type Entity<
    T extends BaseEntityMap[keyof BaseEntityMap] = EmptyEntityProperties
> = {
    readonly coords: Coords
    elevation: number
    name: string
    readonly typeName: T["typeName"]
} & Omit<T, "typeName">

export const entityMap = new PubSubMapEventHandler<string, Entity>();
(window as any)["displayEntityMap"] = () => {
    const entities: Entity[] = [];
    for (const e of entityMap.values()) entities.push(e);
    return entities;
};

export function createEntity<T extends keyof EntityTypeMap>(
    coords: Coords, typeName: T, elevation: number,
    properties: Omit<EntityTypeMap[T], "typeName">
): Entity<EntityTypeMap[T]> {
    return {
        name: `${typeName}-${Math.floor(Math.random() * 8192).toString(16)}`,
        typeName: typeName,
        coords: coords,
        elevation: elevation,
        ...properties
    };
}

export function getEntityAt(c: Coords): Entity | undefined {
    return entityMap.get(coordsKey(c));
}

export function updateEntityAt<
    T extends EntityTypeMap[keyof EntityTypeMap]
>(c: Coords, properties: Partial<Omit<Entity<T>, "typeName">>) {
    const key = coordsKey(c);
    if (entityMap.has(key)) {
        entityMap.set(key, {
            ...structuredClone(entityMap.get(key)!),
            ...properties
        });
    }
}

export function destroyEntityAt(c: Coords) {
    entityMap.delete(coordsKey(c));
}

export function checkEntityMapValidity(): EntityMapValidityResult {
    let spawnPointCount = 0;
    let annaSpawnExists = false;
    let benSpawnExists = false;
    for (const entity of entityMap.values()) {
        if (entity.typeName === "spawn") {
            spawnPointCount++;
            if ((entity as Entity<SpawnProperties>).character === "anna") {
                annaSpawnExists = true;
            } else if ((entity as Entity<SpawnProperties>).character === "ben") {
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

export function convertToEntityMap(levelData: LevelData) {
    for (let i = 0; i < CANVAS_VIRTUAL_WIDTH; i++) {
        for (let j = 0; j < CANVAS_VIRTUAL_HEIGHT; j++) {
            entityMap.delete(coordsKey(createCoordinates(i, j)));
        }
    }

    const annaSpawnCoords = createCoordinates(
        levelData.spawn.anna.x, levelData.spawn.anna.y
    );
    const annaSpawn = createEntity(
        annaSpawnCoords, "spawn",
        levelData.spawn.anna.z, {character: "anna"}
    );
    entityMap.set(coordsKey(annaSpawnCoords), annaSpawn);

    const benSpawnCoords = createCoordinates(
        levelData.spawn.ben.x, levelData.spawn.ben.y
    );
    const benSpawn = createEntity(
        benSpawnCoords, "spawn",
        levelData.spawn.ben.z, {character: "ben"}
    );
    entityMap.set(coordsKey(benSpawnCoords), benSpawn);

    for (const e of levelData.entities) {
        console.log(e.elevation);
        const coords = createCoordinates(e.coords.x, e.coords.y);
        const key = coordsKey(coords);
        switch (e.typeName as Entity["typeName"]) {
            case "platform": {
                const platform = createEntity(
                    coords, "platform", e.elevation, {}
                );
                entityMap.set(key, platform);
                break;
            }
            case "pressure-button": {
                const button = createEntity(
                    coords, "pressure-button", e.elevation, {
                        channel: (e as Entity<PressureButtonProperties>).channel,
                        colour: (e as Entity<PressureButtonProperties>).colour
                    }
                );
                entityMap.set(key, button);
                break;
            }
            case "switch": {
                const switchEntity = createEntity(
                    coords, "switch", e.elevation, {
                        channel: (e as Entity<SwitchProperties>).channel,
                        colour: (e as Entity<SwitchProperties>).colour
                    }
                );
                entityMap.set(key, switchEntity);
                break;
            }
            case "shard": {
                const shard = createEntity(
                    coords, "shard", e.elevation, {
                        character: (e as Entity<ShardProperties>).character
                    }
                );
                entityMap.set(key, shard);
                break;
            }
            default: {
                throw new Error("Failed to load level: Unsupported entity");
            }
        }
    }
}

export function convertToLevelData(): LevelData {
    let annaSpawn: Coords & { z: number } | undefined = undefined;
    let benSpawn: Coords & { z: number } | undefined = undefined;
    const entities: LevelData["entities"] = [];

    for (const e of entityMap.values()) {
        switch (e.typeName) {
            case "spawn": {
                if ((e as Entity<SpawnProperties>).character === "anna") {
                    annaSpawn = {...e.coords, z: e.elevation};
                } else if ((e as Entity<SpawnProperties>).character === "ben") {
                    benSpawn = {...e.coords, z: e.elevation};
                }
                break;
            }
            default: {
                entities.push(e);
            }
        }
    }

    if (!annaSpawn || !benSpawn) {
        throw new Error("Missing spawn point");
    }

    return {
        spawn: {
            anna: annaSpawn,
            ben: benSpawn
        },
        entities: entities
    };
}
