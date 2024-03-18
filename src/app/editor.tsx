"use client";

import React, { useState, useEffect, useRef, use } from "react";
import CodeMirror from "@uiw/react-codemirror";
import Console from "./console/console";
import Toolbar from "./toolbar/toolbar";
import { python } from "@codemirror/lang-python";
import { usePython, usePythonConsole } from "react-py";
import { ConsoleState } from "react-py/dist/types/Console";
import { aura } from "@uiw/codemirror-theme-aura";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";

interface ReactPy {
    runPython: (code: string, preamble?: string | undefined) => Promise<void>,
    stdout: string,
    stderr: string,
    isLoading: boolean,
    isRunning: boolean,
    isReady: boolean,
    prompt: string | undefined,
    isAwaitingInput: boolean,
    interruptExecution: () => void,
    sendInput: (value: string) => void
};

interface ReactPyConsole extends ReactPy {
    banner: string | undefined,
    consoleState: ConsoleState | undefined
};

export default function Editor() {
    const [userCode, setUserCode] = useState("print(\"Hello world!\")");
    const [darkMode, setDarkMode] = useState<boolean>(JSON.parse(localStorage.getItem("dark") ?? "false"));

    const [showConsole, setShowConsole] = useState(true);
    const [showShell, setShowShell] = useState(false);
    const [prompt, setPrompt] = useState("")
    const [shellOutput, setShellOutput] = useState("");

    const usePythonProps = {
        packages: {
            official: ["micropip", "matplotlib"]
        }
    }
    const interpreter: ReactPy = usePython(usePythonProps);
    const shell: ReactPyConsole = usePythonConsole(usePythonProps);

    const uploadRef = useRef<HTMLInputElement>(null);

    /**
     * Registers the react-py service worker for input. Service worker file must
     * be updated manually.
     */
    useEffect(() => {
        navigator.serviceWorker
            .register("/react-py-sw.js")
            .then((registration) =>
                console.log(
                    "Service Worker registration successful with scope: ",
                    registration.scope
                )
            )
            .catch((err) => console.log("Service Worker registration failed: ", err));
    }, []);

    /**
     * Store dark mode setting in local storage.
     */
    useEffect(() => {
        localStorage.setItem("dark", JSON.stringify(darkMode));
    }, [darkMode]);

    /**
     * Add the banner to the shell output.
     */
    useEffect(() => {
        setShellOutput((shell.banner ?? "Initializing interactive shell...") + "\n");
    }, [shell.banner]);

    /**
     * Updates the interactive shell output.
     */
    useEffect(() => {
        setShellOutput((shellOutput) => {
            var newOutput = shellOutput + shell.stdout + shell.stderr;
            if (shell.stderr) newOutput += "\n";
            return newOutput;
        });
    }, [shell.stdout, shell.stderr]);

    /**
     * Updates the interactive shell prompt.
     */
    const defaultPrompt = ">>> ";
    const waitingPrompt = "... ";
    useEffect(() => {
        if (shell.isAwaitingInput) {
            setPrompt(shell.prompt + " ");
        } else if (!shell.isReady) {
            setPrompt("");
        } else if (shell.consoleState === ConsoleState.incomplete) {
            setPrompt(waitingPrompt);
        } else {
            setPrompt(defaultPrompt);
        }
    }, [showShell, shell.isReady, shell.isAwaitingInput, shell.consoleState, shell.prompt]);

    /**
     * Updates the console prompt.
     */
    useEffect(() => {
        if (interpreter.isAwaitingInput) {
            setPrompt(interpreter.prompt + " ");
        }
    }, [interpreter.isAwaitingInput, interpreter.prompt]);

    useEffect(() => {
        // Open a popup window if the result is an image.
        if (interpreter.stdout.startsWith("data:image")) {
            const img = new Image();
            img.src = interpreter.stdout;
            img.onload = () => {
                const imgWindow = window.open("", "Image", `popup,width=${img.width},height=${img.height}`);
                imgWindow?.document.write(
                    `<img src="${interpreter.stdout}" />`
                );
            }
        }
    }, [interpreter.stdout]);

    /**
     * Downloads the user's code (or interactive shell output) to a .py file.
     */
    function downloadCode() {
        const data = new Blob([showShell ? shellOutput + prompt : userCode], { type: "text/plain" });
        const url = window.URL.createObjectURL(data);
        const tempLink = document.createElement("a");
        tempLink.href = url;
        const dateTime = Date.now();
        tempLink.setAttribute("download", "coda_" + (showShell ? "shell_" + dateTime + ".txt" : dateTime + ".py"));
        tempLink.click();
    }

    /**
     * Replaces the current code with the contents of a user-uploaded file.
     * @param e Input change event.
     */
    function uploadCode(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (re) => {
                if (re.target && typeof re.target.result == "string") {
                    setUserCode(re.target.result);
                    setShowShell(false);
                }
            }
            reader.readAsText(file);
        }
    }

    /**
     * Runs the user's code.
     */
    async function runCode() {
        setShowConsole(true);
        interpreter.isReady && !interpreter.isRunning && await interpreter.runPython(userCode);
    }

    /**
     * Stops the user's code.
     */
    function stopCode() {
        interpreter.interruptExecution();
    }

    /**
     * Stops the shell's execution.
     */
    function stopShell() {
        shell.interruptExecution();
    }

    /**
     * Toggles the interactive shell.
     */
    function toggleInteractiveShell() {
        setShowConsole(true);
        setShowShell(!showShell);
    }

    /**
     * Handles enter press in the interactive shell.
     * @param input User-inputted text.
     */
    async function handleConsoleEnter(input: string) {
        if (showShell) {
            if (shell.isAwaitingInput) {
                shell.sendInput(input);
            } else {
                setShellOutput((shellOutput) => shellOutput + prompt + input + "\n");
                shell.isReady && await shell.runPython(input);
            }
        } else if (interpreter.isAwaitingInput) {
            interpreter.sendInput(input);
        }
    }

    return (
        <div>
            <CodeMirror
                className="editor"
                height={showConsole ? (showShell ? "0" : "60vh") : "calc(100vh - 50px)"}
                value={userCode}
                extensions={[python()]}
                theme={darkMode ? aura : xcodeLight}
                onChange={setUserCode}
                basicSetup={{
                    searchKeymap: true,
                    bracketMatching: true,
                    foldKeymap: true,
                    foldGutter: true,
                    tabSize: 4,
                    autocompletion: true,
                    highlightActiveLine: true
                }} />
            <Toolbar
                isReady={interpreter.isReady}
                runFn={(!showShell && !interpreter.isRunning) ? runCode : undefined}
                stopFn={(!showShell && interpreter.isRunning) ? stopCode : (showShell && shell.isRunning) ? stopShell : undefined}
                toggleConsoleFn={!showShell ? () => setShowConsole(!showConsole) : undefined}
                toggleInteractiveShellFn={(!interpreter.isRunning && shell.isReady) ? toggleInteractiveShell : undefined}
                toggleDarkModeFn={() => setDarkMode(!darkMode)}
                uploadFn={() => uploadRef.current?.click()}
                downloadFn={downloadCode}
                darkMode={darkMode} />
            {showConsole &&
                <Console
                    text={showShell ?
                        shellOutput : interpreter.stdout + interpreter.stderr}
                    allowInput={showShell ? (!shell.isRunning || shell.isAwaitingInput) : interpreter.isAwaitingInput}
                    prompt={prompt}
                    promptColor={(interpreter.isAwaitingInput || shell.isAwaitingInput) ? "yellow" : "white"}
                    onEnter={handleConsoleEnter}
                    height={showShell ? "calc(100vh - 50px)" : "calc(40vh - 50px)"}
                    darkMode={darkMode} />
            }
            <input ref={uploadRef} type="file" onChange={uploadCode} hidden></input>
        </div>
    );
}