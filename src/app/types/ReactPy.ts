import { ConsoleState } from "react-py/dist/types/Console"

export interface ReactPy {
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

export interface ReactPyConsole extends ReactPy {
    banner: string | undefined,
    consoleState: ConsoleState | undefined
};