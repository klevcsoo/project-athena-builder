import seedrandom from "seedrandom";
import {PubSubMapEventHandler} from "../lib/PubSubMapEventHandler";

export const elevationMap = new PubSubMapEventHandler<string, number>();
(window as any)["displayElevationMap"] = () => {
    const keys: string[] = [];
    for (const key of elevationMap.keys()) keys.push(key);

    const values: number[] = [];
    for (const value of elevationMap.values()) values.push(value);

    const map: { [key: string]: number } = {};
    for (let i = 0; i < keys.length; i++) {
        map[keys[i]] = values[i];
    }

    console.table(map);
};

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

export function coordsString(coords: Coords): string {
    return `${coords.x}.${coords.y}`;
}
