import {Entity} from "../../core/entity";

export type LevelData = {
    spawn: {
        anna: {
            x: number
            y: number
        }
        ben: {
            x: number
            y: number
        }
    }
    entities: Entity[]
    elevationMap: { [x: number]: { [y: number]: number } }
}
