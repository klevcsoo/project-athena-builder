import {useCallback} from "react";
import {sleep} from "../core/util";
import {entityMap} from "../core/entity";
import {LevelData} from "../lib/LevelData";
import {Coords} from "../lib/Coords";
import {SpawnEntity} from "../lib/entity/SpawnEntity";

export function useExportLevel() {
    return useCallback(async (filename: string) => {
        await sleep(2000); // creates the illusion of progress lol

        const levelDataText = JSON.stringify(convert());
        const buffer: Uint8Array = new TextEncoder().encode(levelDataText);
        const blob = new Blob([buffer], {type: "octet/stream"});
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename.endsWith(".lvl") ? filename : filename + ".lvl";
        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(url);
        a.remove();
    }, []);
}

function convert(): LevelData {
    let annaSpawn: Coords | undefined = undefined;
    let benSpawn: Coords | undefined = undefined;
    const entities: LevelData["entities"] = [];

    for (const e of entityMap.values()) {
        switch (e.entityType) {
            case "spawn": {
                if ((e as SpawnEntity).character === "anna") {
                    annaSpawn = e.position;
                } else if ((e as SpawnEntity).character === "ben") {
                    benSpawn = e.position;
                }
                break;
            }
            default: {
                entities.push({
                    type: e.entityType,
                    position: e.position,
                    details: e.details
                });
            }
        }
    }

    if (!annaSpawn || !benSpawn) {
        throw new Error("Missing spawn point");
    }

    return {
        spawn: {
            anna: annaSpawn,
            ben: benSpawn
        },
        entities: entities
    };
}
