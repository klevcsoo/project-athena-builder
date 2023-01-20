import {cnx} from "../../core/util";

export function PointerToolShell() {
    return (
        <div className={cnx(
            "absolute", "inset-0", "z-20",
            "w-full", "h-full",
            "border-2", "border-white",
            "animate-breathe"
        )}></div>
    );
}
