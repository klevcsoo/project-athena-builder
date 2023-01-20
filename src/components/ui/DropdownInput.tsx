import {useMemo} from "react";
import {cnx} from "../../core/util";

export function DropdownInput(props: {
    options: string[]
    selected: string
    onSelected(value: string): void
}) {
    const dropdownId = useMemo<string>(() => {
        return `dropdown_${crypto.randomUUID()}`;
    }, []);

    return (
        <select name={dropdownId} id={dropdownId} onChange={event => {
            props.onSelected(event.currentTarget.value);
        }} value={props.selected} className={cnx(
            "w-full", "max-w-xs", "px-2", "py-1",
            "bg-neutral-900", "rounded-md",
            "hover:bg-neutral-800",
            "focus:bg-neutral-800",
            "text-end"
        )}>
            {props.options.map((value, index) => (
                <option key={index} value={value}>{value}</option>
            ))}
        </select>
    );
}
