import {useCallback} from "react";
import {sleep} from "../core/util";
import {convertToLevelData} from "../core/entity";

export function useExportLevel() {
    return useCallback(async (filename: string) => {
        await sleep(2000); // creates the illusion of progress lol

        const levelDataText = JSON.stringify(convertToLevelData());
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
