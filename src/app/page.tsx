"use client";

import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import Console from "./console/console";
import Toolbar from "./toolbar/toolbar";
import { python } from "@codemirror/lang-python";
import { usePython } from "react-py";

function App() {
  const [userCode, setUserCode] = useState("def helloWorld():\n  print(\"Hello world!\")\n\nhelloWorld()");
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

  return (
    <div>
      <CodeMirror value={userCode} height="70vh" extensions={[python()]} theme="dark" onChange={setUserCode} />
      <Toolbar isReady={!isLoading && !isRunning} runFn={() => runPython(userCode)} />
      <Console text={stdout + stderr} />
    </div>
  );
}
export default App;