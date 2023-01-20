import {CoordinatesString} from "./CoordinatesString";

export class Coords {
    public constructor(
        public readonly x: number,
        public readonly y: number
    ) {
    }

    public toString(): CoordinatesString {
        return `${this.x};${this.y}`;
    }
}
