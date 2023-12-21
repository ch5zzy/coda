"use client";

import React, { useState, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import Console from "./console/console";
import Toolbar from "./toolbar/toolbar";
import { python } from "@codemirror/lang-python";
import { usePython } from "react-py";

function App() {
  const [userCode, setUserCode] = useState("print(\"Hello world!\")");
  const [showConsole, setShowConsole] = useState(true);
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython({
    packages: {
      official: ["micropip"]
    }
  });
  const uploadRef = useRef<HTMLInputElement>(null);

  /**
   * Downloads the user's code to a .py file.
   */
  function downloadCode() {
    const data = new Blob([userCode], { type: "text/plain" });
    const url = window.URL.createObjectURL(data);
    const tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.setAttribute("download", "coda_" + Date.now() + ".py");
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
        if (re.target && typeof re.target.result == "string") setUserCode(re.target.result);
      }
      reader.readAsText(file);
    }
  }

  return (
    <div>
      <CodeMirror className="editor" height={showConsole ? "60vh" : "calc(100vh - 50px)"} value={userCode} extensions={[python()]} theme="dark" onChange={setUserCode} />
      <Toolbar
        isReady={!isLoading}
        runFn={() => {
          setShowConsole(true);
          runPython(userCode);
        }}
        toggleConsoleFn={() => setShowConsole(!showConsole)}
        uploadFn={() => uploadRef.current?.click()}
        downloadFn={downloadCode} />
      { showConsole && <Console text={stdout + stderr} /> }
      <input ref={uploadRef} type="file" onChange={uploadCode} hidden></input>
    </div>
  );
}
export default App;