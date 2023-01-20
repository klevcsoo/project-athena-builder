import {cnx} from "../../core/util";
import {MaterialSymbol} from "../ui/MaterialSymbol";

export function SpawnToolShell() {
    return (
        <div className={cnx(
            "absolute", "inset-0", "z-20",
            "w-full", "h-full",
            "grid", "place-content-center",
            "border-2", "border-white"
        )}>
            <MaterialSymbol name={"person_pin_circle"} className={cnx(
                "text-white", "text-3xl", "animate-breathe"
            )}/>
        </div>
    );
}
