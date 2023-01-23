import {Coords} from "../Coords";
import {EmptyEntityProperties} from "./EmptyEntityProperties";
import {EntityTypeMap} from "./EntityTypeMap";

// lol
type EntityTypeMapWithEmptyEntity = {
    empty: EmptyEntityProperties
} & EntityTypeMap

export type Entity<
    T extends EntityTypeMapWithEmptyEntity[
        keyof EntityTypeMapWithEmptyEntity
        ] = EmptyEntityProperties
> = {
    readonly coords: Coords
    name: string
    readonly typeName: T["typeName"]
} & Omit<T, "typeName">
