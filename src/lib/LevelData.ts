import {Entity} from "./entity/Entity";

export type LevelData = {
    spawn: {
        anna: {
            x: number
            y: number
        }
        ben: {
            x: number,
            y: number
        }
    }
    entities: Entity[]
}
