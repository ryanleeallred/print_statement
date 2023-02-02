import { setFontLoaderDefaults } from "next/dist/server/config-shared";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faChevronUp,
  faChevronDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ClipLoader from "react-spinners/ClipLoader";

export default function Home() {
  const pyodide = useRef(null);
  const [code, setCode] = useState("print('hello')");
  const [output, setOutput] = useState();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) return;
    const getPyodide = async () => {
      pyodide.current = await loadPyodide({
        stdout: (text) => setOutput(text),
      });
    };
    try {
      getPyodide();
      setPyodideLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }, [scriptLoaded]);

  async function runCode() {
    try {
      const codeResult = await pyodide.current.runPython(code);
      if (codeResult) {
        setOutput(codeResult);
      }
    } catch (error) {
      console.error(error);
      return "Error evaluating Python code. See console for details.";
    }
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="p-5">
        <div className="flex justify-center items-center">
          {pyodideLoaded && <h1 className="text-green-500">Loaded</h1>}
          {!pyodideLoaded && <h1 className="text-red-500">Not Loaded</h1>}
        </div>
        <CodeMirror value={code} onChange={setCode} />
        {output && <div>{output}</div>}
        <div className="flex justify-center items-center">
          <button
            className="p-3 bg-blue-500 text-white rounded-md"
            onClick={runCode}
          >
            RUN
          </button>
        </div>
      </div>
    </>
  );
}
