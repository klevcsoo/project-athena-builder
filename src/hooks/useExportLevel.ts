import {useCallback} from "react";
import {sleep} from "../core/util";
import {entityMap} from "../core/entity";
import {Entity} from "../lib/Entity";

export function useExportLevel() {
    return useCallback(async (filename: string) => {
        await sleep(2000); // creates the illusion of progress lol

        const entityList: Entity[] = [];
        for (const e of entityMap.values()) {
            entityList.push(e);
        }

        const entitiesAsText = JSON.stringify(entityList);
        console.log(entitiesAsText);
    }, []);
}
