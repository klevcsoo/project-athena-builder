export const possible = ["north", "south", "west", "east"] as const;

export type CardinalDirection = typeof possible[number]
