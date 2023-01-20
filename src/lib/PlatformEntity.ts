import {Entity} from "./Entity";

type OrientationV = "north" | "south"
type OrientationH = "west" | "east"

export class PlatformEntity extends Entity {
    public orientation:
        `${OrientationV}${OrientationH}` | OrientationV | OrientationH
        = "south";

    public constructor(positionX: number, positionY: number) {
        super(positionX, positionY, "platform", "platform");
    }
}
