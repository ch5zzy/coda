"use client";

import { PythonProvider } from "react-py";
import Editor from "./editor";

export default function App() {
  return (
    <PythonProvider>
      <Editor />
    </PythonProvider>
  );
}