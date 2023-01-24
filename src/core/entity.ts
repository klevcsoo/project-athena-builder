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
import {Coords, coordsKey, coordsString, createCoordinates, elevationMap} from "./coords";

// lol
type BaseEntityMap = { empty: EmptyEntityProperties } & EntityTypeMap
export type Entity<
    T extends BaseEntityMap[keyof BaseEntityMap] = EmptyEntityProperties
> = {
    readonly coords: Coords
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
    coords: Coords, typeName: T, properties: Omit<EntityTypeMap[T], "typeName">
): Entity<EntityTypeMap[T]> {
    return {
        name: `${typeName}-${Math.floor(Math.random() * 8192).toString(16)}`,
        typeName: typeName,
        coords: coords,
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

export function convertToLevelData(): LevelData {
    let annaSpawn: Coords | undefined = undefined;
    let benSpawn: Coords | undefined = undefined;
    const entities: LevelData["entities"] = [];
    const elevationData: LevelData["elevationMap"] = {};

    for (const e of entityMap.values()) {
        switch (e.typeName) {
            case "spawn": {
                if ((e as Entity<SpawnProperties>).character === "anna") {
                    annaSpawn = e.coords;
                } else if ((e as Entity<SpawnProperties>).character === "ben") {
                    benSpawn = e.coords;
                }
                break;
            }
            default: {
                entities.push(e);
            }
        }
    }

    for (const key of elevationMap.keys()) {
        const coords = createCoordinates(
            parseInt(key.split(".")[0]), parseInt(key.split(".")[1])
        );
        elevationData[coords.x] = {
            ...elevationData[coords.x],
            [coords.y]: elevationMap.get(key)!
        };
    }

    if (!annaSpawn || !benSpawn) {
        throw new Error("Missing spawn point");
    }

    return {
        spawn: {
            anna: annaSpawn,
            ben: benSpawn
        },
        entities: entities,
        elevationMap: elevationData
    };
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
    const annaSpawn = createEntity(annaSpawnCoords, "spawn", {character: "anna"});
    entityMap.set(coordsKey(annaSpawnCoords), annaSpawn);

    const benSpawnCoords = createCoordinates(
        levelData.spawn.ben.x, levelData.spawn.ben.y
    );
    const benSpawn = createEntity(benSpawnCoords, "spawn", {character: "ben"});
    entityMap.set(coordsKey(benSpawnCoords), benSpawn);

    for (const e of levelData.entities) {
        const coords = createCoordinates(e.coords.x, e.coords.y);
        const key = coordsKey(coords);
        switch (e.typeName as Entity["typeName"]) {
            case "pressure-button": {
                const button = createEntity(
                    coords, "pressure-button", {
                        channel: (e as Entity<PressureButtonProperties>).channel,
                        colour: (e as Entity<PressureButtonProperties>).colour
                    }
                );
                entityMap.set(key, button);
                break;
            }
            case "switch": {
                const switchEntity = createEntity(
                    coords, "switch", {
                        channel: (e as Entity<SwitchProperties>).channel,
                        colour: (e as Entity<SwitchProperties>).colour
                    }
                );
                entityMap.set(key, switchEntity);
                break;
            }
            case "shard": {
                const shard = createEntity(
                    coords, "shard", {
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

    for (const x of Object.keys(levelData.elevationMap).map(value => {
        return parseInt(value);
    })) {
        for (const y of Object.keys(levelData.elevationMap[x]).map(value => {
            return parseInt(value);
        })) {
            elevationMap.set(
                coordsString(createCoordinates(x, y)),
                levelData.elevationMap[x][y]
            );
        }
    }
}
