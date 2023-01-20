const errorMap = {
    EntityComponentSystem: "Error in an ECSystem.",
    EntityRegistry: "Error in entity registry.",
    EntityPropertyUpdate: "Error while updating entity properties.",
    PlayerCharacter: "Invalid player character name",
    WorldGeneration: "Error while generating world"
} as const;

export function runtimeError<K extends keyof typeof errorMap>(
    type: K, message: string | undefined
) {
    let actualMessage = message ?? errorMap[type];
    if (!actualMessage.endsWith(".")) actualMessage += ".";
    throw new Error(`${type} Error: ${actualMessage}`);
}
