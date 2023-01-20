import {Entity} from "./Entity";
import {Coords} from "./Coords";

type OrientationV = "north" | "south"
type OrientationH = "west" | "east"
export type PlatformEntityOrientation =
    `${OrientationV}${OrientationH}` | OrientationV | OrientationH

export class PlatformEntity extends Entity {
    public orientation: PlatformEntityOrientation = "south";

    public constructor(coordinates: Coords) {
        const name = `platform-${Math.floor(Math.random() * 8192).toString(16)}`;
        super(coordinates, name, "platform");
    }
}
