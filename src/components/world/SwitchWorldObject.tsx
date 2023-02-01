import {cnx} from "../../core/util";
import {SwitchProperties} from "../../lib/types/entity/SwitchProperties";
import {colourString} from "../../core/colour";

export function SwitchWorldObject(props: Omit<SwitchProperties, "typeName">) {
    return (
        <div className={"absolute inset-0"}>
            <div className={cnx(
                "absolute", "inset-2",
                "bg-white", "rounded-full"
            )}></div>
            <div className={cnx(
                "absolute", "top-1/2", "left-1/2",
                "-translate-x-1/2", "-translate-y-1/2",
                "rotate-45",
                "w-1/2", "h-[10%]",
                "rounded-sm"
            )} style={{
                backgroundColor: colourString(props.colour),
                boxShadow: `0 0 8px ${colourString(props.colour)}`
            }}></div>
            <div className={cnx(
                "absolute", "top-1/2", "left-1/2",
                "-translate-x-1/2", "-translate-y-1/2",
                "-rotate-45",
                "w-1/2", "h-[10%]",
                "rounded-sm"
            )} style={{
                backgroundColor: colourString(props.colour),
                boxShadow: `0 0 8px ${colourString(props.colour)}`
            }}></div>
        </div>
    );
}
