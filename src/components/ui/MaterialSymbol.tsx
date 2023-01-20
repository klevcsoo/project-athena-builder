import {HTMLAttributes} from "react";

export function MaterialSymbol(props: {
    name: string
    className?: HTMLAttributes<HTMLSpanElement>["className"]
}) {
    return (
        <span className={"material-symbols-rounded" + " " + props.className}>
            {props.name}
        </span>
    );
}
