import {cnx} from "../../core/util";
import {PlatformProperties} from "../../lib/types/entity/PlatformProperties";

export function PlatformWorldObject(props: {
    orientation: PlatformProperties["orientation"]
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
            ) : null}
        </div>
    );
}

function PlatformNorth() {
    return (
        <div className={cnx(
            "absolute",
            "border-2", "border-white",
            "bg-neutral-400", "rounded-md",
            "top-0", "w-full", "h-1/3"
        )}></div>
    );
}

function PlatformSouth() {
    return (
        <div className={cnx(
            "absolute",
            "border-2", "border-white",
            "bg-neutral-400", "rounded-md",
            "top-2/3", "w-full", "h-1/3"
        )}></div>
    );
}

function PlatformWest() {
    return (
        <div className={cnx(
            "absolute",
            "border-2", "border-white",
            "bg-neutral-400", "rounded-md",
            "left", "h-full", "w-1/3"
        )}></div>
    );
}

function PlatformEast() {
    return (
        <div className={cnx(
            "absolute",
            "border-2", "border-white",
            "bg-neutral-400", "rounded-md",
            "right-0", "h-full", "w-1/3"
        )}></div>
    );
}
