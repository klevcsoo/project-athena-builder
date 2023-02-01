export function createColour(hex: string): number {
    return parseInt(hex.replace("#", ""), 16);
}

export function randomColour(max: number = 0xffffff): number {
    return Math.floor(Math.random() * max);
}

export function colourString(c: number): string {
    return "#" + c.toString(16);
}
