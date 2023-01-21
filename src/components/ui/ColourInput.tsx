export function ColourInput(props: {
    colour: number
    onColour(colour: number): void
}) {
    return (
        <input type="color" value={"#" + props.colour.toString(16)}
               onChange={event => {
                   props.onColour(parseInt(
                       event.currentTarget.value.replace("#", ""), 16
                   ));
               }}
        />
    );
}
