export abstract class Entity {
    protected constructor(
        public readonly positionX: number,
        public readonly positionY: number,
        public name: string,
        public entityType: "platform" | "spawn"
    ) {
    }
}