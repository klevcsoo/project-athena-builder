import {Entity} from "./Entity";

export class SpawnEntity extends Entity {
    private character: "anna" | "ben" = "anna";

    public constructor(positionX: number, positionY: number) {
        super(positionX, positionY, "anna spawn point", "spawn");
    }

    public getCharacter() {
        return this.character
    }

    public setCharacter(c: "anna" | "ben") {
        this.character = c
        this.name = `${c} spawn point`;
    }
}
