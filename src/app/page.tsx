"use client";

import React, { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import Console from "./console/console";
import Toolbar from "./toolbar/toolbar";
import { python } from "@codemirror/lang-python";
import { usePython, usePythonConsole } from "react-py";
import { ConsoleState } from "react-py/dist/types/Console";

interface ReactPy {
  runPython: (code: string, preamble?: string | undefined) => Promise<void>,
  stdout: string,
  stderr: string,
  isLoading: boolean,
  isRunning: boolean,
  isReady: boolean,
  prompt: string | undefined,
  isAwaitingInput: boolean,
  sendInput: (value: string) => void
};

interface ReactPyConsole extends ReactPy {
  banner: string | undefined,
  consoleState: ConsoleState | undefined
};

function App() {
  const [userCode, setUserCode] = useState("print(\"Hello world!\")");

  const [showConsole, setShowConsole] = useState(true);
  const [showIAShell, setShowIAShell] = useState(false);
  const [IAPrompt, setIAPrompt] = useState("coda$ ")
  const [IAOutput, setIAOutput] = useState("");

  const usePythonProps = {
    packages: {
      official: ["micropip"]
    }
  }
  const interpreter: ReactPy = usePython(usePythonProps);
  const IAShell: ReactPyConsole = usePythonConsole(usePythonProps);

  const uploadRef = useRef<HTMLInputElement>(null);

  /**
   * Add the banner to the shell output.
   */
  useEffect(() => {
    setIAOutput(IAShell.banner + "\n");
  }, [IAShell.banner]);

  /**
   * Updates the interactive shell output.
   */
  useEffect(() => {
    setIAOutput((IAOutput) => {
      var newOutput = IAOutput + IAShell.stdout + IAShell.stderr;
      if (IAShell.stderr) newOutput += "\n";
      return newOutput
    });
  }, [IAShell.stdout, IAShell.stderr]);

  /**
   * Updates the interactive shell prompt.
   */
  const defaultPrompt = ">>> ";
  const waitingPrompt = "... ";
  useEffect(() => {
    if (IAShell.isAwaitingInput) {
      setIAPrompt(defaultPrompt);
    } else if (IAShell.consoleState === ConsoleState.incomplete) {
      setIAPrompt(waitingPrompt);
    } else {
      setIAPrompt(defaultPrompt);
    }
  }, [IAShell.isAwaitingInput, IAShell.consoleState]);

  /**
   * Downloads the user's code (or interactive shell output) to a .py file.
   */
  function downloadCode() {
    const data = new Blob([showIAShell ? IAOutput + IAPrompt : userCode], { type: "text/plain" });
    const url = window.URL.createObjectURL(data);
    const tempLink = document.createElement("a");
    tempLink.href = url;
    const dateTime = Date.now();
    tempLink.setAttribute("download", "coda_" + (showIAShell ? "shell_" + dateTime + ".txt" : dateTime + ".py"));
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
          setShowIAShell(false);
        }
      }
      reader.readAsText(file);
    }
  }

  return (
    <div>
      <CodeMirror
        className="editor"
        height={showConsole ? (showIAShell ? "0" : "60vh") : "calc(100vh - 50px)"}
        value={userCode}
        extensions={[python()]}
        theme="dark"
        onChange={setUserCode} />
      <Toolbar
        isReady={interpreter.isReady}
        runFn={() => {
          setShowConsole(true);
          interpreter.runPython(userCode);
        }}
        toggleConsoleFn={!showIAShell ? () => setShowConsole(!showConsole) : undefined}
        toggleInteractiveShellFn={IAShell.isReady ? () => {
          setShowConsole(true);
          setShowIAShell(!showIAShell);
        } : undefined}
        uploadFn={() => uploadRef.current?.click()}
        downloadFn={downloadCode} />
      {showConsole &&
        <Console
          text={showIAShell ?
            IAOutput : interpreter.stdout + interpreter.stderr}
          allowInput={showIAShell && !IAShell.isRunning}
          prompt={IAPrompt}
          onEnter={async (input: string) => {
            if (IAShell.isAwaitingInput) {
              IAShell.sendInput(input);
            } else {
              setIAOutput((IAOutput) => IAOutput + IAPrompt + input + "\n");
              await IAShell.runPython(input);
            }
          }}
          height={showIAShell ? "calc(100vh - 50px)" : "calc(40vh - 50px)"} />
      }
      <input ref={uploadRef} type="file" onChange={uploadCode} hidden></input>
    </div>
  );
}
export default App;