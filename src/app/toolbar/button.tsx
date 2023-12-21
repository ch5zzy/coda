import { MouseEventHandler } from "react";
import "./toolbar.css";

export default function ToolbarButton(props: {
    children: React.ReactNode,
    onClick: MouseEventHandler,
    label: string
}) {
    return (
        <button
            className="toolbar-button"
            onClick={props.onClick}
            title={props.label}
            aria-label={props.label}>
            {props.children}
        </button>
    );
}