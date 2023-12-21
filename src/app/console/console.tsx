import { useState, KeyboardEvent, FormEvent } from "react";
import "./console.css";

export default function Console(props: {
    text: string,
    allowInput: boolean,
    prompt: string,
    height: string,
    onEnter: (s: string) => void
}) {
    const [userText, setUserText] = useState("");

    function checkEnter(e: KeyboardEvent) {
        if (e.key == "Enter") {
            props.onEnter(userText);
            setUserText("");
        }
    }

    return (
        <div className="console" style={{ height: props.height }}>
            {props.text}
            {props.allowInput &&
                <div>
                    <div className="prompt">{props.prompt}</div>
                    <input
                        value={userText}
                        className="user-input"
                        type="text"
                        onKeyDown={checkEnter}
                        onInput={(e: FormEvent) => setUserText((e.target as HTMLInputElement).value)}
                        autoFocus={true} />
                </div>
            }
        </div>
    );
}