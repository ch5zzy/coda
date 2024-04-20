import { MouseEventHandler } from "react";
import "./Toolbar.css";

export default function ToolbarButton(props: {
    children: React.ReactNode,
    onClick?: MouseEventHandler,
    label: string
}) {
    return (
        <button
            className={props.onClick ? "toolbar-button" : "toolbar-button disabled"}
            onClick={props.onClick}
            title={props.label}
            aria-label={props.label}
            disabled={props.onClick ? false : true}>
            {props.children}
        </button>
    );
}