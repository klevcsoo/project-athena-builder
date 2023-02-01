import {cnx} from "../../core/util";
import {PressureButtonProperties} from "../../lib/types/entity/PressureButtonProperties";
import {colourString} from "../../core/colour";

export function PressureButtonWorldObject(props: Omit<PressureButtonProperties, "typeName">) {
    return (
        <div className={"absolute inset-0"}>
            <div className={cnx(
                "absolute", "inset-2",
                "bg-white", "rounded-sm"
            )}></div>
            <div className={cnx(
                "absolute", "inset-4",
                "rounded-sm"
            )} style={{
                backgroundColor: colourString(props.colour),
                boxShadow: `0 0 8px ${colourString(props.colour)}`
            }}></div>
        </div>
    );
}
