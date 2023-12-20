import { MouseEventHandler } from "react"
import "./toolbar.css";

export default function Toolbar(props: {
    isReady: boolean,
    runFn: MouseEventHandler
}) {
    return (
        <div className="toolbar">
            {props.isReady ? <button onClick={props.runFn}>▶️ RUN!</button> : <span>Loading...</span>}
        </div>
    )
}