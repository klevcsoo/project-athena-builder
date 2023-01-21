import {cnx} from "../core/util";
import {Fragment, useCallback, useEffect, useState} from "react";
import {BasicButton} from "../components/ui/BasicButton";
import {checkEntityMapValidity} from "../core/entity";
import {EntityMapValidityResult} from "../lib/EntityMapValidityResult";
import {MaterialSymbol} from "../components/ui/MaterialSymbol";
import {TextInput} from "../components/ui/TextInput";
import {useExportLevel} from "../hooks/useExportLevel";

export function LevelActionsLayout() {
    const [popup, setPopup] = useState(false);

    return (
        <Fragment>
            <div className={cnx(
                "absolute", "bottom-4", "left-24", "z-30"
            )}>
                <BasicButton text={"Export level"} onClick={() => {
                    setPopup(true);
                }}/>
            </div>
            {popup ? <ExportLevelPopup onDismiss={() => setPopup(false)}/> : null}
        </Fragment>
    );
}

function ExportLevelPopup(props: {
    onDismiss(): void
}) {
    const [validity, setValidity] = useState<EntityMapValidityResult>();
    const [filename, setFilename] = useState("");
    const [loading, setLoading] = useState(false);
    const exportLevel = useExportLevel();

    const doExport = useCallback(() => {
        if (!filename) return;

        setLoading(true);
        exportLevel(filename).catch(reason => {
            console.error(reason);
        }).finally(() => {
            setLoading(false);
            props.onDismiss();
        });
    }, [exportLevel, filename, props]);

    useEffect(() => {
        setValidity(checkEntityMapValidity());
    }, []);

    return (
        <div className={cnx(
            "absolute", "inset-0", "z-40",
            "grid", "place-items-center",
            "backdrop-blur-lg", "text-white"
        )}>
            {!validity ? (
                <div>Loading...</div>
            ) : (
                <div className={cnx(
                    "relative", "w-full", "max-w-lg", "p-12",
                    "flex", "flex-col", "items-center", "gap-4",
                    "bg-neutral-900", "rounded-xl",
                    "shadow-xl"
                )}>
                    <div className={cnx(
                        "absolute", "right-2", "top-2",
                        "w-8", "h-8",
                        "grid", "place-content-center",
                        "rounded-md", "cursor-pointer",
                        "hover:bg-neutral-800"
                    )} onClick={props.onDismiss}>
                        <MaterialSymbol name={"close"}/>
                    </div>
                    <h2 className={cnx(
                        "text-center", "text-3xl"
                    )}>Export level to file</h2>
                    {validity == "ok" ? (
                        <div className={cnx(
                            "flex", "flex-row", "items-center"
                        )}>
                            <MaterialSymbol name={loading ? "downloading" : "save"}
                                            className={"text-9xl"}/>
                            <div className={cnx(
                                "flex", "flex-col", "items-stretch", "gap-2"
                            )}>
                                <TextInput text={filename} onText={setFilename}
                                           placeholder={"Filename"}/>
                                <BasicButton text={"Export"} onClick={doExport}/>
                            </div>
                        </div>
                    ) : (
                        <div className={cnx(
                            "h-16", "pr-8", "overflow-hidden",
                            "flex", "flex-row", "items-center", "gap-8",
                            "bg-neutral-800", "rounded-xl"
                        )}>
                            <div className={cnx(
                                "h-16", "w-4", "bg-red-600"
                            )}></div>
                            <div>
                                <h3 className={"text-lg"}>
                                    Failed to validate entity map
                                </h3>
                                <p>
                                    Error: <b>{validity}</b>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
