import { MouseEventHandler } from "react"
import { FaTerminal, FaPlay, FaDownload, FaFileImport } from "react-icons/fa";
import ToolbarButton from "./button";
import "./toolbar.css";

export default function Toolbar(props: {
    isReady: boolean,
    runFn: MouseEventHandler,
    toggleConsoleFn: MouseEventHandler,
    uploadFn: MouseEventHandler,
    downloadFn: MouseEventHandler,
}) {
    return (
        <div className="toolbar">
            {props.isReady ? 
                <div>
                    <ToolbarButton onClick={props.toggleConsoleFn} label="Toggle console"><FaTerminal /></ToolbarButton>
                    <ToolbarButton onClick={props.runFn} label="Run"><FaPlay /></ToolbarButton>
                    <ToolbarButton onClick={props.uploadFn} label="Import file"><FaFileImport /></ToolbarButton>
                    <ToolbarButton onClick={props.downloadFn} label="Download file"><FaDownload /></ToolbarButton>
                </div>
                : <span>Initializing Python environment...</span>}
        </div>
    )
}