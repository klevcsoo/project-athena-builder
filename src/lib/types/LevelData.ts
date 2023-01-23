import {Entity} from "../../core/entity";

export type LevelData = {
    spawn: {
        anna: {
            x: number
            y: number
            z: number
        }
        ben: {
            x: number
            y: number
            z: number
        }
    }
    entities: Entity[]
}
