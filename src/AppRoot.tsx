import {Fragment} from "react";
import {BuilderCanvas} from "./components/BuilderCanvas";
import {ToolboxLayout} from "./layouts/ToolboxLayout";
import {EntityDetailsLayout} from "./layouts/EntityDetailsLayout";
import {ExportLevelLayout} from "./layouts/ExportLevelLayout";

export function AppRoot() {
    return (
        <Fragment>
            <ToolboxLayout/>
            <EntityDetailsLayout/>
            <ExportLevelLayout/>
            <BuilderCanvas/>
        </Fragment>
    );
}
