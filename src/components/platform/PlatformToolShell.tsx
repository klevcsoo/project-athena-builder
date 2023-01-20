import {cnx} from "../../core/util";

export function PlatformToolShell() {
    return (
        <div className={cnx(
            "absolute", "inset-0", "top-2/3",
            "w-full", "h-1/3",
            "grid", "place-content-center",
            "border-2", "border-white",
            "animate-breathe"
        )}>
            <h3 className={cnx(
                "text-white"
            )}>PLATFORM</h3>
        </div>
    );
}
