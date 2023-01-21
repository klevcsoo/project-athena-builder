import {Entity} from "./Entity";
import {Coords} from "../Coords";

export class ShardEntity extends Entity {
    public character: "anna" | "ben" | "both" = "both";

    public constructor(coordinates: Coords) {
        const name = `shard-${Math.floor(Math.random() * 8192).toString(16)}`;
        super(coordinates, name, "shard");
    }
}
