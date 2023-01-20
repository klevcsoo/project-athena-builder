import {cnx} from "../../core/util";

export function BasicButton(props: {
    text: string
    onClick(): void
    disabled?: boolean
    warning?: boolean
}) {
    return (
        <button type={"button"} disabled={props.disabled} className={cnx(
            "w-full", "max-w-xs", "h-12", "px-4",
            props.warning ? "bg-red-600" : "bg-white",
            "rounded-md",
            props.warning ? "hover:bg-red-700" : "hover:bg-neutral-200"
        )} onClick={props.onClick}>
            <b className={props.warning ? "text-white" : "text-black"}>
                {props.text}
            </b>
        </button>
    );
}
