import {cnx} from "../core/util";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {getEntityAt} from "../hooks/useWorldEntity";
import {useEffect, useState} from "react";
import {Entity} from "../lib/Entity";

export function EntityDetailsLayout() {
    const [coords] = useSelectedEntityCoords();
    const [entity, setEntity] = useState<Entity>();

    useEffect(() => {
        setEntity(getEntityAt(coords));
    }, [coords]);

    return !entity ? null : (
        <div className={cnx(
            "absolute", "top-4", "bottom-4", "right-4", "z-10",
            "max-w-xs", "w-full", "p-2",
            "bg-[#00000060]", "backdrop-blur-lg", "rounded-xl",
            "flex", "flex-col", "items-center", "gap-2",
            "text-white"
        )}>
            {JSON.stringify(entity)}
        </div>
    );
}
