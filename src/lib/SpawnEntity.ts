import {Entity} from "./Entity";
import {Coords} from "./Coords";

export class SpawnEntity extends Entity {
    private character: "anna" | "ben" = "anna";

    public constructor(coordinates: Coords) {
        super(coordinates, "anna spawn point", "spawn");
    }

    public getCharacter() {
        return this.character;
    }

    public setCharacter(c: "anna" | "ben") {
        this.character = c;
        this.name = `${c} spawn point`;
    }
}
