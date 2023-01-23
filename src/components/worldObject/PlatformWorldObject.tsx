import {cnx} from "../../core/util";

export function PlatformWorldObject() {
    return (
        <div className={cnx(
            "absolute", "inset-0",
            "border-2", "border-white",
            "grid", "place-content-center",
            "bg-neutral-400", "rounded-md",
        )}>
        </div>
    );
}
