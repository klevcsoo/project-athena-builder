import {Coords, coordsKey} from "../core/coords";
import {PubSubMapEventHandler} from "../lib/PubSubMapEventHandler";
import {useCallback, useEffect, useMemo, useState} from "react";

const pubsub = new PubSubMapEventHandler<string, number>();

export function useElevation(coords: Coords): [number, (increase: number) => void] {
    const key = useMemo<string>(() => coordsKey(coords), []);
    const [elevation, setElevation] = useState(pubsub.get(key) || 0);

    const increase = useCallback((by: number) => {
        const prevState = pubsub.get(key)!;
        if (prevState + by < 0) return;
        pubsub.set(key, prevState + by);
    }, [key]);

    useEffect(() => {
        if (!pubsub.has(key)) pubsub.set(key, 0);

        const callback = (e: number | undefined) => setElevation(e || 0);
        pubsub.on(key, callback);
        return () => pubsub.off(key, callback);
    }, [key]);

    return [elevation, increase];
}
