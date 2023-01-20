import {Fragment} from "react";
import {BuilderCanvas} from "./components/BuilderCanvas";
import {ToolboxLayout} from "./layouts/ToolboxLayout";

export function AppRoot() {
    return (
        <Fragment>
            <ToolboxLayout/>
            <BuilderCanvas/>
        </Fragment>
    );
}
