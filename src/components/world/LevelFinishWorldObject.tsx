import React from "react";
import {LevelFinishProperties} from "../../lib/types/entity/LevelFinishProperties";
import {MaterialSymbol} from "../ui/MaterialSymbol";
import {cnx} from "../../core/util";

export function LevelFinishWorldObject(props: Omit<LevelFinishProperties, "typeName">) {
    return (
        <div className={"absolute inset-0"}>
            <div className={cnx(
                "absolute", "inset-0",
                "grid", "place-content-center"
            )}>
                <MaterialSymbol name={"flag"} className={cnx(
                    "text-5xl", props.character === "anna" ? "text-blue-500" :
                        props.character === "ben" ? "text-yellow-500" : "text-white"
                )}/>
            </div>
            <div className={cnx(
                "absolute", "inset-0",
                "grid", "place-content-center",
                "blur-md", "animate-pulse"
            )}>
                <MaterialSymbol name={"flag"} className={cnx(
                    "text-5xl", props.character === "anna" ? "text-blue-500" :
                        props.character === "ben" ? "text-yellow-500" : "text-white"
                )}/>
            </div>
        </div>
    );
}
