import {cnx} from "../../core/util";
import {PlatformEntityOrientation} from "../../lib/PlatformEntity";
import {Fragment} from "react";

export function PlatformWorldObject(props: {
    orientation: PlatformEntityOrientation
}) {
    return (
        <div className={cnx(
            "absolute", "inset-0"
        )}>
            {props.orientation === "north" ? (
                <PlatformNorth/>
            ) : props.orientation === "east" ? (
                <PlatformEast/>
            ) : props.orientation === "south" ? (
                <PlatformSouth/>
            ) : props.orientation === "west" ? (
                <PlatformWest/>
            ) : props.orientation === "northeast" ? (
                <Fragment>
                    <PlatformNorth/>
                    <PlatformEast/>
                </Fragment>
            ) : props.orientation === "northwest" ? (
                <Fragment>
                    <PlatformNorth/>
                    <PlatformWest/>
                </Fragment>
            ) : props.orientation === "southeast" ? (
                <Fragment>
                    <PlatformSouth/>
                    <PlatformEast/>
                </Fragment>
            ) : props.orientation === "southwest" ? (
                <Fragment>
                    <PlatformSouth/>
                    <PlatformWest/>
                </Fragment>
            ) : null}
        </div>
    );
}

function PlatformNorth() {
    return (
        <div className={cnx(
            "absolute",
            "border-2", "border-white",
            "bg-neutral-400",
            "top-0", "w-full", "h-1/3"
        )}></div>
    );
}

function PlatformSouth() {
    return (
        <div className={cnx(
            "absolute",
            "border-2", "border-white",
            "bg-neutral-400",
            "top-2/3", "w-full", "h-1/3"
        )}></div>
    );
}

function PlatformWest() {
    return (
        <div className={cnx(
            "absolute",
            "border-2", "border-white",
            "bg-neutral-400",
            "left", "h-full", "w-1/3"
        )}></div>
    );
}

function PlatformEast() {
    return (
        <div className={cnx(
            "absolute",
            "border-2", "border-white",
            "bg-neutral-400",
            "right-0", "h-full", "w-1/3"
        )}></div>
    );
}
