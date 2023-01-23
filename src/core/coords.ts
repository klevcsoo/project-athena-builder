import seedrandom from "seedrandom";

export type Coords = {
    readonly x: number
    readonly y: number
}

export function createCoordinates(x: number, y: number): Coords {
    return {x: x, y: y};
}

export function coordsEqual(c1: Coords, c2: Coords): boolean {
    return c1.x === c2.x && c1.y === c2.y;
}

export function coordsKey(coords: Coords): string {
    const rng = seedrandom(`${coords.x}.${coords.y}`);
    return rng.int32().toString(16);
}
