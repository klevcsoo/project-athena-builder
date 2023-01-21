import {cnx} from "../../core/util";
import {PlatformWorldObject} from "./PlatformWorldObject";
import {useMemo} from "react";

export function PressureButtonWorldObject(props: {
    color: number
}) {
    const colourString = useMemo<string>(() => {
        return "#" + props.color.toString(16);
    }, [props.color]);

    return (
        <div className={cnx(
            "absolute", "inset-0"
        )}>
            <div className={cnx(
                "absolute", "bottom-2", "left-1/2",
                "w-3/4", "h-1/6",
                "-translate-x-1/2",
                "bg-white", "rounded-sm"
            )}></div>
            <div className={cnx(
                "absolute", "bottom-1/3", "left-1/2",
                "-translate-x-1/2",
                "w-4/5", "h-[5%]",
                "rounded-sm"
            )} style={{backgroundColor: colourString}}></div>
            <div className={cnx(
                "absolute", "bottom-1/4", "left-1/2", "z-20",
                "-translate-x-1/2",
                "w-4/5", "h-[10%]",
                "rounded-sm", "blur-lg"
            )} style={{backgroundColor: colourString}}></div>
            <PlatformWorldObject orientation={"south"}/>
        </div>
    );
}
