import {Entity} from "./Entity";
import {Coords} from "./Coords";

type OrientationV = "north" | "south"
type OrientationH = "west" | "east"

export class PlatformEntity extends Entity {
    public orientation:
        `${OrientationV}${OrientationH}` | OrientationV | OrientationH
        = "south";

    public constructor(coordinates: Coords) {
        super(coordinates, "platform", "platform");
    }
}
