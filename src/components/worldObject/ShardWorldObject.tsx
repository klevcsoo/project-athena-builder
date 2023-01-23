import {cnx} from "../../core/util";
import {MaterialSymbol} from "../ui/MaterialSymbol";
import {ShardProperties} from "../../lib/entity/ShardProperties";

export function ShardWorldObject(props: {
    character: ShardProperties["character"]
}) {
    return (
        <div className={"absolute inset-0"}>
            <MaterialSymbol name={"diamond"} className={cnx(
                "absolute", "top-1/2", "left-1/2",
                "-translate-x-1/2", "-translate-y-1/2",
                "text-5xl",
                props.character === "both" ? "text-neutral-300" :
                    props.character === "anna" ? "text-blue-500" :
                        "text-yellow-500"
            )}/>
            <MaterialSymbol name={"diamond"} className={cnx(
                "absolute", "top-1/2", "left-1/2",
                "-translate-x-1/2", "-translate-y-1/2",
                "text-5xl", "blur-md", "animate-pulse",
                props.character === "both" ? "text-neutral-300" :
                    props.character === "anna" ? "text-blue-500" :
                        "text-yellow-500"
            )}/>
        </div>
    );
}
