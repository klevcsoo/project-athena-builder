/**
 * Combines Tailwind classnames into a string. (WebStorm is a piece of work)
 * @param classNames the classnames to be combined
 */
export function cnx(...classNames: string[]): string {
    return classNames.map(value => value.trim()).join(" ");
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0
 * and 255(x * 255).clamp(0, 255).
 * @param n input value
 * @param min lower boundary of the output range
 * @param max upper boundary of the output range
 * @returns a number in the range [min, max]
 */
export function clamp(n: number, min: number, max: number): number {
    return Math.min(Math.max(n, min), max);
}

export function isDevEnv() {
    return (
        window.location.hostname === "localhost" ||
        window.location.hostname.endsWith("devtunnels.ms")
    );
}
