import {useCallback, useEffect, useState} from "react";
import {Coords} from "../lib/Coords";

const LS_KEY = "entity_details.selected";

export function useSelectedEntityCoords(): [Coords, (c: Coords) => void] {
    const [coords, setCoords] = useState<Coords>(new Coords(0, 0));

    const set = useCallback((c: Coords) => {
        localStorage.setItem(LS_KEY, `${c}`);
    }, []);

    useEffect(() => {
        if (!localStorage.getItem(LS_KEY)) {
            localStorage.setItem(LS_KEY, `0;0`);
        }

        const id = setInterval(() => {
            const raw = localStorage.getItem(LS_KEY) as any as string;
            setCoords(new Coords(
                parseInt(raw.split(";")[0]), parseInt(raw.split(";")[1])
            ));
        }, 100);

        return () => clearInterval(id);
    }, []);

    return [coords, set];
}
