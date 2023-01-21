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
    entities: {
        type: string
        position: {
            x: number
            y: number
        }
        details?: any
    }[]
}
