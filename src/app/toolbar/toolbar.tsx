import { MouseEventHandler } from "react"
import { FaTerminal, FaPlay, FaDownload, FaFileImport, FaHandSparkles } from "react-icons/fa";
import ToolbarButton from "./button";
import "./toolbar.css";

export default function Toolbar(props: {
    isReady: boolean,
    runFn?: MouseEventHandler,
    toggleConsoleFn?: MouseEventHandler,
    uploadFn?: MouseEventHandler,
    downloadFn?: MouseEventHandler,
    toggleInteractiveShellFn?: MouseEventHandler
}) {
    return (
        <div className="toolbar">
            {props.isReady ?
                <div>
                    <ToolbarButton onClick={props.toggleConsoleFn} label="Toggle console"><FaTerminal /></ToolbarButton>
                    <ToolbarButton onClick={props.toggleInteractiveShellFn} label="Toggle interactive shell"><FaHandSparkles /></ToolbarButton>
                    <ToolbarButton onClick={props.runFn} label="Run"><FaPlay /></ToolbarButton>
                    <ToolbarButton onClick={props.uploadFn} label="Import"><FaFileImport /></ToolbarButton>
                    <ToolbarButton onClick={props.downloadFn} label="Download"><FaDownload /></ToolbarButton>
                </div>
                : <span>Initializing Python environment...</span>}
        </div>
    )
}