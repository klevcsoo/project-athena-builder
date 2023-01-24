import {useMemo} from "react";
import {cnx} from "../../core/util";
import {SwitchProperties} from "../../lib/types/entity/SwitchProperties";

export function SwitchWorldObject(props: {
    colour: SwitchProperties["colour"]
}) {
    const colourString = useMemo<string>(() => {
        return "#" + props.colour.toString(16);
    }, [props.colour]);

    return (
        <div className={"absolute inset-0"}>
            <div className={cnx(
                "absolute", "inset-2",
                "bg-white", "rounded-sm"
            )}></div>
            <div className={cnx(
                "absolute", "top-1/2", "left-1/2",
                "-translate-x-1/2", "-translate-y-1/2",
                "rotate-45",
                "w-1/2", "h-[10%]",
                "rounded-sm"
            )} style={{
                backgroundColor: colourString,
                boxShadow: `0 0 8px ${colourString}`
            }}></div>
            <div className={cnx(
                "absolute", "top-1/2", "left-1/2",
                "-translate-x-1/2", "-translate-y-1/2",
                "-rotate-45",
                "w-1/2", "h-[10%]",
                "rounded-sm"
            )} style={{
                backgroundColor: colourString,
                boxShadow: `0 0 8px ${colourString}`
            }}></div>
        </div>
    );
}
