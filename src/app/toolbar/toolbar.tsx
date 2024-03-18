import { MouseEventHandler } from "react"
import { FaTerminal, FaPlay, FaDownload, FaFileImport, FaHandSparkles, FaStop, FaMoon, FaSun } from "react-icons/fa";
import { LuLoader2 } from "react-icons/lu";
import ToolbarButton from "./button";
import "./toolbar.css";

export default function Toolbar(props: {
    isReady: boolean,
    runFn?: MouseEventHandler,
    stopFn?: MouseEventHandler,
    toggleConsoleFn?: MouseEventHandler,
    uploadFn?: MouseEventHandler,
    downloadFn?: MouseEventHandler,
    toggleInteractiveShellFn?: MouseEventHandler,
    toggleDarkModeFn?: MouseEventHandler,
    darkMode?: boolean
}) {
    return (
        <div className={props.darkMode ? "toolbar dark" : "toolbar"}>
            <div>
                <ToolbarButton onClick={props.toggleConsoleFn} label="Toggle console"><FaTerminal /></ToolbarButton>
                <ToolbarButton onClick={props.toggleInteractiveShellFn} label="Toggle interactive shell"><FaHandSparkles /></ToolbarButton>
                <ToolbarButton onClick={props.toggleDarkModeFn} label="Toggle dark mode">{props.darkMode == true ? <FaSun /> : <FaMoon />}</ToolbarButton>
                <ToolbarButton onClick={props.isReady ? props.runFn : undefined} label="Run">{props.isReady ? <FaPlay /> : <LuLoader2 className="spinner" />}</ToolbarButton>
                <ToolbarButton onClick={props.stopFn} label="Stop"><FaStop /></ToolbarButton>
                <ToolbarButton onClick={props.uploadFn} label="Import"><FaFileImport /></ToolbarButton>
                <ToolbarButton onClick={props.downloadFn} label="Download"><FaDownload /></ToolbarButton>
            </div>
        </div>
    )
}