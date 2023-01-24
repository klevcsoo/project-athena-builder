import {SpawnProperties} from "./SpawnProperties";
import {PressureButtonProperties} from "./PressureButtonProperties";
import {SwitchProperties} from "./SwitchProperties";
import {ShardProperties} from "./ShardProperties";
import {DoorProperties} from "./DoorProperties";

export type EntityTypeMap = {
    ["spawn"]: SpawnProperties
    ["pressure-button"]: PressureButtonProperties
    ["switch"]: SwitchProperties
    ["shard"]: ShardProperties
    ["door"]: DoorProperties
}
