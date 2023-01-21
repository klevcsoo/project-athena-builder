import {Fragment} from "react";
import {BuilderCanvas} from "./components/BuilderCanvas";
import {ToolboxLayout} from "./layouts/ToolboxLayout";
import {EntityDetailsLayout} from "./layouts/EntityDetailsLayout";
import {LevelActionsLayout} from "./layouts/LevelActionsLayout";

export function AppRoot() {
    return (
        <Fragment>
            <ToolboxLayout/>
            <EntityDetailsLayout/>
            <LevelActionsLayout/>
            <BuilderCanvas/>
        </Fragment>
    );
}
