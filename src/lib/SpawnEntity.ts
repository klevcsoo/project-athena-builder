import {Entity} from "./Entity";
import {Coords} from "./Coords";

export class SpawnEntity extends Entity {
    public character: "anna" | "ben" = "anna";

    public constructor(coordinates: Coords) {
        const name = `spawn-${Math.floor(Math.random() * 8192).toString(16)}`;
        super(coordinates, name, "spawn");
    }
}
