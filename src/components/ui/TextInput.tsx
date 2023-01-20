import {cnx} from "../../core/util";

export function TextInput(props: {
    text: string
    onText(text: string): void
    onSubmit(): void
    placeholder?: string
    disabled?: boolean
}) {
    return (
        <input type="text" value={props.text} onChange={event => {
            props.onText(event.currentTarget.value);
        }} className={cnx(
            "w-full", "h-10", "px-2",
            "bg-neutral-900", "rounded-lg", "text-white",
            "hover:bg-neutral-800",
            "focus:bg-neutral-800", "focus:outline-none"
        )} placeholder={props.placeholder} disabled={props.disabled}/>
    );
}
