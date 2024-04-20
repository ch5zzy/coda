"use client";

import { PythonProvider } from "react-py";
import Editor from "./Editor";

export default function App() {
  return (
    <PythonProvider>
      <Editor />
    </PythonProvider>
  );
}