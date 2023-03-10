import {cnx} from "../../core/util";
import {MaterialSymbol} from "../ui/MaterialSymbol";
import {SpawnProperties} from "../../lib/types/entity/SpawnProperties";

export function SpawnWorldObject(props: Omit<SpawnProperties, "typeName">) {
    return (
        <div className={cnx(
            "absolute", "inset-0",
            "grid", "place-content-center"
        )}>
            <p className={cnx(
                "uppercase", "text-white", "text-xs", "text-center"
            )}>
                <MaterialSymbol name={"person_pin_circle"} className={cnx(
                    "text-4xl",
                    props.character === "anna" ? "text-blue-500" : "text-yellow-500"
                )}/>
                <br/>
                <b>{props.character}</b>
                <br/>
                spawn
            </p>
        </div>
    );
}
