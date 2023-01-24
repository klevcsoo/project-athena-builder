import {Coords, coordsString, elevationMap} from "../core/coords";
import {useCallback, useEffect, useMemo, useState} from "react";


export function useElevation(coords: Coords): [number, (increase: number) => void] {
    const key = useMemo<string>(() => coordsString(coords), []);
    const [elevation, setElevation] = useState(elevationMap.get(key) || 0);

    const increase = useCallback((by: number) => {
        const prevState = elevationMap.get(key)!;
        if (prevState + by < 0) return;
        elevationMap.set(key, prevState + by);
    }, [key]);

    useEffect(() => {
        if (!elevationMap.has(key)) elevationMap.set(key, 0);

        const callback = (e: number | undefined) => setElevation(e || 0);
        elevationMap.on(key, callback);
        return () => elevationMap.off(key, callback);
    }, [key]);

    return [elevation, increase];
}
