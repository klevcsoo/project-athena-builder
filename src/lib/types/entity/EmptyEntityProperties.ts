import {EntityTypeMap} from "./EntityTypeMap";

export type EmptyEntityProperties = {
    typeName: EntityTypeMap[keyof EntityTypeMap]["typeName"]
}
