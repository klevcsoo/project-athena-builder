import {PubSubMapEventHandler} from "../lib/PubSubMapEventHandler";
import {CoordinatesString} from "../lib/CoordinatesString";
import {Entity} from "../lib/entity/Entity";
import {Coords} from "../lib/Coords";
import {EntityMapValidityResult} from "../lib/EntityMapValidityResult";
import {LevelData} from "../lib/LevelData";
import {CANVAS_VIRTUAL_HEIGHT, CANVAS_VIRTUAL_WIDTH} from "../components/BuilderCanvas";
import {EntityTypeMap} from "../lib/entity/EntityTypeMap";
import {SpawnProperties} from "../lib/entity/SpawnProperties";
import {PlatformProperties} from "../lib/entity/PlatformProperties";
import {PressureButtonProperties} from "../lib/entity/PressureButtonProperties";
import {SwitchProperties} from "../lib/entity/SwitchProperties";
import {ShardProperties} from "../lib/entity/ShardProperties";

export const entityMap = new PubSubMapEventHandler<CoordinatesString, Entity>();
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
    return entityMap.get(c.toString());
}

export function updateEntityAt<
    T extends EntityTypeMap[keyof EntityTypeMap]
>(
    c: Coords, properties: Partial<Omit<T, "typeName">>
) {
    const key = c.toString();

    if (entityMap.has(key)) {
        entityMap.set(key, {
            ...structuredClone(entityMap.get(key)!),
            ...properties
        });
    }
}

export function destroyEntityAt(c: Coords) {
    entityMap.delete(c.toString());
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
            entityMap.delete(new Coords(i, j).toString());
        }
    }

    const annaSpawnCoords = new Coords(
        levelData.spawn.anna.x, levelData.spawn.anna.y
    );
    const annaSpawn = createEntity(annaSpawnCoords, "spawn", {character: "anna"});
    entityMap.set(annaSpawnCoords.toString(), annaSpawn);

    const benSpawnCoords = new Coords(
        levelData.spawn.ben.x, levelData.spawn.ben.y
    );
    const benSpawn = createEntity(benSpawnCoords, "spawn", {character: "ben"});
    entityMap.set(benSpawnCoords.toString(), benSpawn);

    for (const e of levelData.entities) {
        const coords = new Coords(e.coords.x, e.coords.y);
        switch (e.typeName as Entity["typeName"]) {
            case "platform": {
                const platform = createEntity(coords, "platform", {
                    orientation: (e as Entity<PlatformProperties>).orientation
                });
                entityMap.set(coords.toString(), platform);
                break;
            }
            case "pressure-button": {
                const button = createEntity(
                    coords, "pressure-button", {
                        channel: (e as Entity<PressureButtonProperties>).channel,
                        colour: (e as Entity<PressureButtonProperties>).colour
                    }
                );
                entityMap.set(coords.toString(), button);
                break;
            }
            case "switch": {
                const switchEntity = createEntity(
                    coords, "switch", {
                        channel: (e as Entity<SwitchProperties>).channel,
                        colour: (e as Entity<SwitchProperties>).colour
                    }
                );
                entityMap.set(coords.toString(), switchEntity);
                break;
            }
            case "shard": {
                const shard = createEntity(
                    coords, "shard", {character: (e as Entity<ShardProperties>).character}
                );
                entityMap.set(coords.toString(), shard);
                break;
            }
            default: {
                throw new Error("Failed to load level: Unsupported entity");
            }
        }
    }
}

export function convertToLevelData(): LevelData {
    let annaSpawn: Coords | undefined = undefined;
    let benSpawn: Coords | undefined = undefined;
    const entities: LevelData["entities"] = [];

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
