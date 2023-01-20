import {cnx} from "../core/util";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {Entity} from "../lib/Entity";
import {TextInput} from "../components/ui/TextInput";
import {PlatformEntity, PlatformEntityOrientation} from "../lib/PlatformEntity";
import {DropdownInput} from "../components/ui/DropdownInput";
import {MaterialSymbol} from "../components/ui/MaterialSymbol";
import {SpawnEntity} from "../lib/SpawnEntity";
import {destroyEntityAt, getEntityAt, updateEntityAt} from "../core/entity";
import {BasicButton} from "../components/ui/BasicButton";

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
            "absolute", "top-4", "bottom-4", "right-4", "z-30",
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
            {entity.entityType === "spawn" ? (
                <Fragment>
                    <SpawnPointCharacterEditor {...entity as SpawnEntity}/>
                </Fragment>
            ) : null}
            <DeleteEntityButton entity={entity} onDelete={() => {
                setEntity(undefined);
            }}/>
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
            updateEntityAt(props.position, {name: name});
        }} placeholder={"Entity name"}/>
    );
}

function EntityCoordinates(props: Entity) {
    return (
        <div className={cnx(
            "h-12", "w-full", "px-4",
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
    const options = useMemo<PlatformEntityOrientation[]>(() => {
        return [
            "north", "south", "west", "east",
            "northwest", "northeast", "southwest", "southeast"
        ];
    }, []);
    const [selected, setSelected] = useState<string>(props.orientation);

    useEffect(() => {
        setSelected(props.orientation);
    }, [props.orientation]);

    return (
        <div className={cnx(
            "h-12", "w-full", "px-4",
            "flex", "flex-row", "gap-4", "items-center", "justify-between",
            "bg-neutral-900", "rounded-md"
        )}>
            <MaterialSymbol name={"view_in_ar"}/>
            <DropdownInput
                options={options}
                selected={selected}
                onSelected={value => {
                    setSelected(value);
                    updateEntityAt<PlatformEntity>(props.position, {
                        orientation: value as PlatformEntityOrientation
                    });
                }}/>
        </div>
    );
}

function SpawnPointCharacterEditor(props: SpawnEntity) {
    const options = useMemo<["anna", "ben"]>(() => {
        return ["anna", "ben"];
    }, []);
    const [selected, setSelected] = useState<"anna" | "ben">(props.character);

    useEffect(() => {
        setSelected(props.character);
    }, [props.character]);

    return (
        <div className={cnx(
            "h-12", "w-full", "px-4",
            "flex", "flex-row", "gap-4", "items-center", "justify-between",
            "bg-neutral-900", "rounded-md"
        )}>
            <MaterialSymbol name={"person"}/>
            <DropdownInput
                options={options}
                selected={selected}
                onSelected={value => {
                    setSelected(value as any);
                    updateEntityAt<SpawnEntity>(props.position, {
                        character: value as any
                    });
                }}/>
        </div>
    );
}

function DeleteEntityButton(props: {
    entity: Entity,
    onDelete(): void
}) {
    const doDelete = useCallback(() => {
        destroyEntityAt(props.entity.position);
        props.onDelete();
    }, [props]);

    return (
        <BasicButton text={"Delete entity"} onClick={doDelete} warning/>
    );
}
