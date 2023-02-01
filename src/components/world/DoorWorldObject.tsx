import {cnx} from "../../core/util";
import {colourString} from "../../core/colour";
import {DoorProperties} from "../../lib/types/entity/DoorProperties";

export function DoorWorldObject(props: Omit<DoorProperties, "typeName">) {
    return (
        <div className={cnx(
            "absolute", "inset-0"
        )}>
            <div className={"absolute inset-2 overflow-hidden"}>
                <div className={cnx(
                    "absolute", "right-0", "bottom-0",
                    "translate-x-1/2", "translate-y-1/2",
                    "w-[200%]", "h-[200%]",
                    "border-2", "border-dashed", "border-white",
                    "rounded-full"
                )}></div>
            </div>
            <div className={cnx(
                "absolute", "inset-y-2", "right-2",
                "w-2", "bg-white", "rounded-tl-md", "rounded-br-md"
            )}></div>
            <div className={cnx(
                "absolute", "inset-x-2", "bottom-2",
                "h-2", "border-2", "border-white",
                "rounded-r-md", "rounded-tl-md"
            )} style={{
                backgroundColor: colourString(props.colour),
                boxShadow: `0 0 8px ${colourString(props.colour)}`
            }}></div>
        </div>
    );
}
