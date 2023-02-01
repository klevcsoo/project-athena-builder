import {cnx} from "../core/util";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {TextInput} from "../components/ui/TextInput";
import {DropdownInput} from "../components/ui/DropdownInput";
import {MaterialSymbol} from "../components/ui/MaterialSymbol";
import {Entity, entityMap, updateEntity} from "../core/entity";
import {BasicButton} from "../components/ui/BasicButton";
import {ColourInput} from "../components/ui/ColourInput";
import {SpawnProperties} from "../lib/types/entity/SpawnProperties";
import {PressureButtonProperties} from "../lib/types/entity/PressureButtonProperties";
import {SwitchProperties} from "../lib/types/entity/SwitchProperties";
import {ShardProperties} from "../lib/types/entity/ShardProperties";
import {coordsKey} from "../core/coords";

export function EntityDetailsLayout() {
    const [coords] = useSelectedEntityCoords();
    const [entity, setEntity] = useState<Entity>();

    const entityTitle = useMemo<string>(() => {
        if (!entity) return "";

        let s = entity.typeName.substring(1);
        return entity.typeName[0].toLocaleUpperCase() + s;
    }, [entity]);

    useEffect(() => {
        setEntity(entityMap.get(coordsKey(coords)));
    }, [coords]);

    return !entity ? null : (
        <div className={cnx(
            "absolute", "top-4", "bottom-4", "right-4", "z-40",
            "max-w-xs", "w-full", "p-4",
            "bg-[#00000060]", "backdrop-blur-lg", "rounded-xl",
            "flex", "flex-col", "items-center", "gap-4",
            "text-white"
        )}>
            <h2 className={"text-2xl"}>{entityTitle}</h2>
            <EntityNameEditor entity={entity}/>
            <EntityCoordinates entity={entity}/>
            {entity.typeName === "spawn" ? (
                <Fragment>
                    <SpawnPointCharacterEditor
                        entity={entity as Entity<SpawnProperties>}/>
                </Fragment>
            ) : null}
            {entity.typeName === "pressure-button" ? (
                <Fragment>
                    <CommsChannelEditor
                        entity={entity as Entity<PressureButtonProperties>}/>
                    <ColourEditor
                        entity={entity as Entity<PressureButtonProperties>}/>
                </Fragment>
            ) : null}
            {entity.typeName === "switch" ? (
                <Fragment>
                    <CommsChannelEditor
                        entity={entity as Entity<SwitchProperties>}/>
                    <ColourEditor
                        entity={entity as Entity<SwitchProperties>}/>
                </Fragment>
            ) : null}
            {entity.typeName === "shard" ? (
                <Fragment>
                    <ShardCharacterEditor
                        entity={entity as Entity<ShardProperties>}/>
                </Fragment>
            ) : null}
            {entity.typeName === "door" ? (
                <Fragment>
                    <CommsChannelEditor
                        entity={entity as Entity<PressureButtonProperties>}/>
                    <ColourEditor
                        entity={entity as Entity<PressureButtonProperties>}/>
                </Fragment>
            ) : null}
            <DeleteEntityButton entity={entity} onDelete={() => {
                setEntity(undefined);
            }}/>
        </div>
    );
}

function EntityNameEditor(props: {
    entity: Entity
}) {
    const [name, setName] = useState(props.entity.name);

    useEffect(() => {
        setName(props.entity.name);
    }, [props.entity]);

    return (
        <TextInput text={name} onText={setName} onSubmit={() => {
            updateEntity(props.entity.coords, {
                name: name
            });
        }} placeholder={"Entity name"}/>
    );
}

function EntityCoordinates(props: {
    entity: Entity
}) {
    return (
        <div className={cnx(
            "h-12", "w-full", "px-4",
            "flex", "flex-row", "gap-4", "items-center", "justify-between",
            "bg-neutral-900", "rounded-md"
        )}>
            <MaterialSymbol name={"my_location"}/>
            <div className={cnx(
                "flex", "flex-row", "gap-4", "items-center", "justify-end",
                "text-xs"
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
                    )}><b className={"font-mono"}>{props.entity.coords.x}</b></div>
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
                    )}><b className={"font-mono"}>{props.entity.coords.y}</b></div>
                </div>
            </div>
        </div>
    );
}

function SpawnPointCharacterEditor(props: {
    entity: Entity<SpawnProperties>
}) {
    const options = useMemo<["anna", "ben"]>(() => {
        return ["anna", "ben"];
    }, []);
    const [selected, setSelected] = useState<"anna" | "ben">(
        props.entity.character
    );

    useEffect(() => {
        setSelected(props.entity.character);
    }, [props.entity]);

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
                    updateEntity<SpawnProperties>(props.entity.coords, {
                        character: value as any
                    });
                }}/>
        </div>
    );
}

function DeleteEntityButton(props: {
    entity: Entity
    onDelete(): void
}) {
    const doDelete = useCallback(() => {
        entityMap.delete(coordsKey(props.entity.coords));
        props.onDelete();
    }, [props]);

    return (
        <BasicButton text={"Delete entity"} onClick={doDelete} warning/>
    );
}

function CommsChannelEditor(props: {
    entity: Entity<PressureButtonProperties | SwitchProperties>
}) {
    const [channel, setChannel] = useState(props.entity.channel);

    useEffect(() => {
        setChannel(props.entity.channel);
    }, [props.entity]);

    return (
        <div className={cnx(
            "h-12", "w-full", "px-4",
            "flex", "flex-row", "gap-4", "items-center", "justify-between",
            "bg-neutral-900", "rounded-md"
        )}>
            <MaterialSymbol name={"lan"}/>
            <TextInput text={channel} onText={setChannel}
                       placeholder={"Communication channel"}
                       className={"h-8 text-end"}
                       onSubmit={() => {
                           updateEntity<
                               PressureButtonProperties | SwitchProperties
                           >(props.entity.coords, {
                               channel: channel
                           });
                       }}/>
        </div>
    );
}

function ColourEditor(props: {
    entity: Entity<PressureButtonProperties | SwitchProperties>
}) {
    const [colour, setColour] = useState(props.entity.colour);

    useEffect(() => {
        setColour(props.entity.colour);
    }, [props.entity]);

    return (
        <div className={cnx(
            "h-12", "w-full", "px-4",
            "flex", "flex-row", "gap-4", "items-center", "justify-between",
            "bg-neutral-900", "rounded-md"
        )}>
            <MaterialSymbol name={"format_color_fill"}/>
            <ColourInput colour={colour} onColour={colour1 => {
                updateEntity<
                    PressureButtonProperties | SwitchProperties
                >(props.entity.coords, {
                    colour: colour1
                });
                setColour(colour1);
            }}/>
        </div>
    );
}

function ShardCharacterEditor(props: {
    entity: Entity<ShardProperties>
}) {
    const options = useMemo<["anna", "ben", "both"]>(() => {
        return ["anna", "ben", "both"];
    }, []);
    const [selected, setSelected] = useState<ShardProperties["character"]>(
        props.entity.character
    );

    useEffect(() => {
        setSelected(props.entity.character);
    }, [props.entity]);

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
                    updateEntity<ShardProperties>(props.entity.coords, {
                        character: value as any
                    });
                }}/>
        </div>
    );
}
