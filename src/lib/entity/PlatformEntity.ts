import {Entity} from "./Entity";
import {Coords} from "../Coords";
import {CardinalDirection} from "../CardinalDirection";

export class PlatformEntity extends Entity {
    public orientation: CardinalDirection = "south";

    public constructor(coordinates: Coords) {
        const name = `platform-${Math.floor(Math.random() * 8192).toString(16)}`;
        super(coordinates, name, "platform");
    }
}
