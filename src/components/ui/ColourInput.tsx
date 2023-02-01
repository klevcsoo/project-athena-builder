import {colourString, createColour} from "../../core/colour";

export function ColourInput(props: {
    colour: number
    onColour(colour: number): void
}) {
    return (
        <input type="color" value={colourString(props.colour)}
               onChange={event => {
                   props.onColour(createColour(event.currentTarget.value));
               }}
        />
    );
}
