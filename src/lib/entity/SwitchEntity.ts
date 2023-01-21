import {Entity} from "./Entity";
import {Coords} from "../Coords";

export class SwitchEntity extends Entity {
    public commsChannel: string =
        `channel-${Math.floor(Math.random() * 8192).toString(16)}`;
    public colour: number = Math.floor(Math.random() * 0xffffff);

    public constructor(
        coordinates: Coords,
    ) {
        const name = `switch-${Math.floor(Math.random() * 8192).toString(16)}`;
        super(coordinates, name, "switch");
    }
}
