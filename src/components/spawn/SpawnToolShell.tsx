import {cnx} from "../../core/util";

export function SpawnToolShell() {
    return (
        <div className={cnx(
            "absolute", "inset-0", "top-0", "left-0",
            "w-full", "h-full",
            "grid", "place-content-center",
            "border-2", "border-white"
        )}>
            <span className={cnx(
                "material-symbols-rounded",
                "text-white", "text-3xl",
                "animate-ping"
            )}>person_pin_circle</span>
        </div>
    );
}
