importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodide = null;

async function init() {
  if (!pyodide) {
    pyodide = await loadPyodide();
  }
  return pyodide;
}

self.onmessage = async (e) => {
  const { code } = e.data;

  try {
    const py = await init();
    let output = "";

    py.globals.set("print", (...args) => {
      output += args.join(" ") + "\n";
    });

    await py.runPythonAsync(code);

    self.postMessage({ type: "RESULT", output });
  } catch (err) {
    self.postMessage({ type: "ERROR", error: String(err) });
  }
};
