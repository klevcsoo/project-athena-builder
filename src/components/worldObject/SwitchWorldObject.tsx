import {useMemo} from "react";
import {PlatformWorldObject} from "./PlatformWorldObject";
import {cnx} from "../../core/util";

export function SwitchWorldObject(props: {
    colour: number
}) {
    const colourString = useMemo<string>(() => {
        return "#" + props.colour.toString(16);
    }, [props.colour]);

    return (
        <div className={"absolute inset-0"}>
            <div className={cnx(
                "absolute", "bottom-2", "left-1/2",
                "w-3/4", "h-1/6",
                "-translate-x-1/2",
                "bg-white", "rounded-sm"
            )}></div>
            <div className={cnx(
                "absolute", "bottom-1/4", "left-1/2",
                "-translate-x-1/2", "-translate-y-1/2",
                "rotate-45",
                "w-1/2", "h-[10%]",
                "rounded-sm"
            )} style={{backgroundColor: colourString}}></div>
            <div className={cnx(
                "absolute", "bottom-1/4", "left-1/2",
                "-translate-x-1/2", "-translate-y-1/2",
                "rotate-45",
                "w-1/2", "h-[10%]",
                "rounded-sm", "blur-lg", "animate-pulse"
            )} style={{backgroundColor: colourString}}></div>
            <PlatformWorldObject orientation={"south"}/>
        </div>
    );
}
