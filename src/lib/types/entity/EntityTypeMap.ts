import {SpawnProperties} from "./SpawnProperties";
import {PressureButtonProperties} from "./PressureButtonProperties";
import {SwitchProperties} from "./SwitchProperties";
import {ShardProperties} from "./ShardProperties";
import {DoorProperties} from "./DoorProperties";
import {LevelFinishProperties} from "./LevelFinishProperties";

export type EntityTypeMap = {
    ["spawn"]: SpawnProperties
    ["pressure-button"]: PressureButtonProperties
    ["switch"]: SwitchProperties
    ["shard"]: ShardProperties
    ["door"]: DoorProperties,
    ["level-finish"]: LevelFinishProperties
}
