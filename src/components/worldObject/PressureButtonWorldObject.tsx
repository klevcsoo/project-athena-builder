import {cnx} from "../../core/util";
import {PlatformWorldObject} from "./PlatformWorldObject";
import {useMemo} from "react";
import {PressureButtonProperties} from "../../lib/types/entity/PressureButtonProperties";

export function PressureButtonWorldObject(props: {
    colour: PressureButtonProperties["colour"]
}) {
    const colourString = useMemo<string>(() => {
        return "#" + props.colour.toString(16);
    }, [props.colour]);

    return (
        <div className={"absolute inset-0"}>
            <PlatformWorldObject/>
            <div className={cnx(
                "absolute", "inset-2",
                "bg-white", "rounded-sm"
            )}></div>
            <div className={cnx(
                "absolute", "inset-4",
                "rounded-sm"
            )} style={{
                backgroundColor: colourString,
                boxShadow: `0 0 8px ${colourString}`
            }}></div>
        </div>
    );
}
