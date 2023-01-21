import {Coords} from "../Coords";

export abstract class Entity {
    protected constructor(
        public readonly position: Coords,
        public name: string,
        public entityType: "platform" | "spawn" | "pressure-button" | "switch" | "shard"
    ) {
    }
}
