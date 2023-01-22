import {PubSubMapEventHandler} from "../lib/PubSubMapEventHandler";
import {CoordinatesString} from "../lib/CoordinatesString";
import {Entity} from "../lib/entity/Entity";
import {Coords} from "../lib/Coords";
import {SpawnEntity} from "../lib/entity/SpawnEntity";
import {EntityMapValidityResult} from "../lib/EntityMapValidityResult";
import {LevelData} from "../lib/LevelData";
import {PlatformEntity} from "../lib/entity/PlatformEntity";
import {PressureButtonEntity} from "../lib/entity/PressureButtonEntity";
import {SwitchEntity} from "../lib/entity/SwitchEntity";
import {ShardEntity} from "../lib/entity/ShardEntity";
import {CANVAS_VIRTUAL_HEIGHT, CANVAS_VIRTUAL_WIDTH} from "../components/BuilderCanvas";

export const entityMap = new PubSubMapEventHandler<CoordinatesString, Entity>();
(window as any)["displayEntityMap"] = () => {
    const entities: Entity[] = [];
    for (const e of entityMap.values()) entities.push(e);
    return entities;
};

export function getEntityAt(c: Coords): Entity | undefined {
    return entityMap.get(c.toString());
}

export function updateEntityAt<T extends Entity>(c: Coords, properties: Partial<T>) {
    entityMap.set(c.toString(), {
        ...structuredClone(entityMap.get(c.toString())!),
        ...properties
    });
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

export function convertToEntityMap(levelData: LevelData) {
    for (let i = 0; i < CANVAS_VIRTUAL_WIDTH; i++) {
        for (let j = 0; j < CANVAS_VIRTUAL_HEIGHT; j++) {
            entityMap.delete(new Coords(i, j).toString());
        }
    }

    const annaSpawnCoords = new Coords(
        levelData.spawn.anna.x, levelData.spawn.anna.y
    );
    const annaSpawn = new SpawnEntity(annaSpawnCoords);
    annaSpawn.character = "anna";
    entityMap.set(annaSpawnCoords.toString(), annaSpawn);

    const benSpawnCoords = new Coords(
        levelData.spawn.ben.x, levelData.spawn.ben.y
    );
    const benSpawn = new SpawnEntity(benSpawnCoords);
    benSpawn.character = "ben";
    entityMap.set(benSpawnCoords.toString(), benSpawn);

    for (const e of levelData.entities) {
        const coords = new Coords(e.position.x, e.position.y);
        switch (e.type as Entity["entityType"]) {
            case "platform": {
                const platform = new PlatformEntity(coords);
                platform.orientation = e.details.orientation;
                entityMap.set(coords.toString(), platform);
                break;
            }
            case "pressure-button": {
                const button = new PressureButtonEntity(coords);
                button.colour = e.details.colour;
                button.commsChannel = e.details.channel;
                entityMap.set(coords.toString(), button);
                break;
            }
            case "switch": {
                const switchEntity = new SwitchEntity(coords);
                switchEntity.colour = e.details.colour;
                switchEntity.commsChannel = e.details.channel;
                entityMap.set(coords.toString(), switchEntity);
                break;
            }
            case "shard": {
                const shard = new ShardEntity(coords);
                shard.character = e.details.character;
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
        switch (e.entityType) {
            case "spawn": {
                if ((e as SpawnEntity).character === "anna") {
                    annaSpawn = e.position;
                } else if ((e as SpawnEntity).character === "ben") {
                    benSpawn = e.position;
                }
                break;
            }
            default: {
                entities.push({
                    type: e.entityType,
                    position: e.position,
                    details: e.details
                });
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
