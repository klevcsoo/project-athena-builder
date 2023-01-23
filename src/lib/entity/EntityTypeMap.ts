import {PlatformProperties} from "./PlatformProperties";
import {SpawnProperties} from "./SpawnProperties";
import {PressureButtonProperties} from "./PressureButtonProperties";
import {SwitchProperties} from "./SwitchProperties";
import {ShardProperties} from "./ShardProperties";

export type EntityTypeMap = {
    ["platform"]: PlatformProperties
    ["spawn"]: SpawnProperties
    ["pressure-button"]: PressureButtonProperties
    ["switch"]: SwitchProperties
    ["shard"]: ShardProperties
}

export const entityNameMap: {
    [key in keyof EntityTypeMap]: key
} = {
    ["platform"]: "platform",
    ["spawn"]: "spawn",
    ["pressure-button"]: "pressure-button",
    ["switch"]: "switch",
    ["shard"]: "shard"
};
