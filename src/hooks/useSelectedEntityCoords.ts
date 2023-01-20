import {useCallback, useEffect, useState} from "react";
import {Coords} from "../lib/Coords";
import {PubSubEventHandler} from "../lib/PubSubEventHandler";

const pubsub = new PubSubEventHandler(new Coords(0, 0));

export function useSelectedEntityCoords(): [Coords, (c: Coords) => void] {
    const [coords, setCoords] = useState<Coords>(pubsub.get());

    const set = useCallback((c: Coords) => {
        pubsub.update(c);
    }, []);

    useEffect(() => {
        const callback = (c: Coords) => setCoords(c);
        pubsub.on(callback);
        return () => pubsub.off(callback);
    }, []);

    return [coords, set];
}
