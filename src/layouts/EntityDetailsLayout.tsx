import {cnx} from "../core/util";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {getEntityAt} from "../hooks/useWorldEntity";
import {Fragment, useEffect, useMemo, useState} from "react";
import {Entity} from "../lib/Entity";
import {TextInput} from "../components/ui/TextInput";
import {PlatformEntity} from "../lib/PlatformEntity";
import {DropdownInput} from "../components/ui/DropdownInput";
import {MaterialSymbol} from "../components/ui/MaterialSymbol";

export function EntityDetailsLayout() {
    const [coords] = useSelectedEntityCoords();
    const [entity, setEntity] = useState<Entity>();

    const entityTitle = useMemo<string>(() => {
        if (!entity) return "";

        let s = entity.entityType.substring(1);
        return entity.entityType[0].toLocaleUpperCase() + s;
    }, [entity]);

    useEffect(() => {
        setEntity(getEntityAt(coords));
    }, [coords]);

    return !entity ? null : (
        <div className={cnx(
            "absolute", "top-4", "bottom-4", "right-4", "z-10",
            "max-w-xs", "w-full", "p-4",
            "bg-[#00000060]", "backdrop-blur-lg", "rounded-xl",
            "flex", "flex-col", "items-center", "gap-4",
            "text-white"
        )}>
            <h2 className={"text-2xl"}>{entityTitle}</h2>
            <EntityNameEditor {...entity}/>
            <EntityCoordinates {...entity} />
            {entity.entityType === "platform" ? (
                <Fragment>
                    <PlatformOrientationEditor {...entity as PlatformEntity}/>
                </Fragment>
            ) : null}
        </div>
    );
}

function EntityNameEditor(props: Entity) {
    const [name, setName] = useState(props.name);

    useEffect(() => {
        setName(props.name);
    }, [props.name]);

    return (
        <TextInput text={name} onText={setName} onSubmit={() => {
        }} placeholder={"Entity name"}/>
    );
}

function EntityCoordinates(props: Entity) {
    return (
        <div className={cnx(
            "h-10", "w-full", "px-4",
            "flex", "flex-row", "gap-4", "items-center", "justify-between",
            "bg-neutral-900", "rounded-md"
        )}>
            <MaterialSymbol name={"my_location"}/>
            <div className={cnx(
                "flex", "flex-row", "gap-4", "items-center", "justify-end"
            )}>
                <div className={cnx(
                    "flex", "flex-row", "items-center", "justify-items-stretch"
                )}>
                    <div className={cnx(
                        "w-2", "h-8", "bg-red-600",
                        "rounded-l-md"
                    )}></div>
                    <div className={cnx(
                        "w-16", "h-8", "px-4", "bg-neutral-800", "rounded-r-md",
                        "grid", "place-content-center"
                    )}><b className={"font-mono"}>{props.position.x}</b></div>
                </div>
                <div className={cnx(
                    "flex", "flex-row", "items-center", "justify-items-stretch"
                )}>
                    <div className={cnx(
                        "w-2", "h-8", "bg-green-600",
                        "rounded-l-md"
                    )}></div>
                    <div className={cnx(
                        "w-16", "h-8", "px-4", "bg-neutral-800", "rounded-r-md",
                        "grid", "place-content-center"
                    )}><b className={"font-mono"}>{props.position.y}</b></div>
                </div>
            </div>
        </div>
    );
}

function PlatformOrientationEditor(props: PlatformEntity) {
    const options = useMemo<string[]>(() => {
        return [
            "north", "south", "west", "east",
            "northwest", "northeast", "southwest", "southeast"
        ];
    }, []);
    const [selected, setSelected] = useState<string>(props.orientation);

    useEffect(() => {
        console.log(selected);
    }, [selected]);

    return (
        <div className={cnx(
            "h-10", "w-full", "px-4",
            "flex", "flex-row", "gap-4", "items-center", "justify-between",
            "bg-neutral-900", "rounded-md"
        )}>
            <MaterialSymbol name={"view_in_ar"}/>
            <DropdownInput options={options}
                           selected={selected} onSelected={setSelected}/>
        </div>
    );
}
