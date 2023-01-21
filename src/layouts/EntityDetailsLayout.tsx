import {cnx} from "../core/util";
import {useSelectedEntityCoords} from "../hooks/useSelectedEntityCoords";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {Entity} from "../lib/entity/Entity";
import {TextInput} from "../components/ui/TextInput";
import {PlatformEntity} from "../lib/entity/PlatformEntity";
import {DropdownInput} from "../components/ui/DropdownInput";
import {MaterialSymbol} from "../components/ui/MaterialSymbol";
import {SpawnEntity} from "../lib/entity/SpawnEntity";
import {destroyEntityAt, getEntityAt, updateEntityAt} from "../core/entity";
import {BasicButton} from "../components/ui/BasicButton";
import {CardinalDirection} from "../lib/CardinalDirection";
import {PressureButtonEntity} from "../lib/entity/PressureButtonEntity";
import {ColourInput} from "../components/ui/ColourInput";
import {SwitchEntity} from "../lib/entity/SwitchEntity";
import {ShardEntity} from "../lib/entity/ShardEntity";

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
            <EntityNameEditor entity={entity}/>
            <EntityCoordinates entity={entity}/>
            {entity.entityType === "platform" ? (
                <Fragment>
                    <PlatformOrientationEditor entity={entity as PlatformEntity}/>
                </Fragment>
            ) : null}
            {entity.entityType === "spawn" ? (
                <Fragment>
                    <SpawnPointCharacterEditor entity={entity as SpawnEntity}/>
                </Fragment>
            ) : null}
            {entity.entityType === "pressure-button" ? (
                <Fragment>
                    <CommsChannelEditor entity={entity as PressureButtonEntity}/>
                    <ColourEditor entity={entity as PressureButtonEntity}/>
                </Fragment>
            ) : null}
            {entity.entityType === "switch" ? (
                <Fragment>
                    <CommsChannelEditor entity={entity as SwitchEntity}/>
                    <ColourEditor entity={entity as SwitchEntity}/>
                </Fragment>
            ) : null}
            {entity.entityType === "shard" ? (
                <Fragment>
                    <ShardCharacterEditor entity={entity as ShardEntity}/>
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
            updateEntityAt(props.entity.position, {name: name});
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
                    )}><b className={"font-mono"}>{props.entity.position.x}</b></div>
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
                    )}><b className={"font-mono"}>{props.entity.position.y}</b></div>
                </div>
            </div>
        </div>
    );
}

function PlatformOrientationEditor(props: {
    entity: PlatformEntity
}) {
    const options = useMemo<CardinalDirection[]>(() => {
        return [
            "north", "south", "west", "east"
        ];
    }, []);
    const [selected, setSelected] = useState<string>(props.entity.orientation);

    useEffect(() => {
        setSelected(props.entity.orientation);
    }, [props.entity]);

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
                    updateEntityAt<PlatformEntity>(props.entity.position, {
                        orientation: value as CardinalDirection
                    });
                }}/>
        </div>
    );
}

function SpawnPointCharacterEditor(props: {
    entity: SpawnEntity
}) {
    const options = useMemo<["anna", "ben"]>(() => {
        return ["anna", "ben"];
    }, []);
    const [selected, setSelected] = useState<"anna" | "ben">(props.entity.character);

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
                    updateEntityAt<SpawnEntity>(props.entity.position, {
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
        destroyEntityAt(props.entity.position);
        props.onDelete();
    }, [props]);

    return (
        <BasicButton text={"Delete entity"} onClick={doDelete} warning/>
    );
}

function CommsChannelEditor(props: {
    entity: PressureButtonEntity | SwitchEntity
}) {
    const [channel, setChannel] = useState(props.entity.commsChannel);

    useEffect(() => {
        setChannel(props.entity.commsChannel);
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
                           updateEntityAt<
                               PressureButtonEntity | SwitchEntity
                           >(props.entity.position, {
                               commsChannel: channel
                           });
                       }}/>
        </div>
    );
}

function ColourEditor(props: {
    entity: PressureButtonEntity | SwitchEntity
}) {
    const [colour, setColour] = useState(props.entity.colour);

    useEffect(() => {
        console.log(props.entity.colour.toString(16));
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
                updateEntityAt<
                    PressureButtonEntity | SwitchEntity
                >(props.entity.position, {
                    colour: colour1
                });
                setColour(colour1);
            }}/>
        </div>
    );
}

function ShardCharacterEditor(props: {
    entity: ShardEntity
}) {
    const options = useMemo<["anna", "ben", "both"]>(() => {
        return ["anna", "ben", "both"];
    }, []);
    const [selected, setSelected] = useState<ShardEntity["character"]>(
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
                    updateEntityAt<ShardEntity>(props.entity.position, {
                        character: value as any
                    });
                }}/>
        </div>
    );
}
