import { createWorkerTransport } from "./core/workers/transport";

const transport = createWorkerTransport();

function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <button type="button" onClick={() => transport.play()}>
        Play
      </button>
      <button type="button" onClick={() => transport.pause()}>
        Pause
      </button>
      <button type="button" onClick={() => transport.stop()}>
        Stop
      </button>
      <button
        type="button"
        onClick={async () => {
          const bpm = await transport.getBpm();
          console.log("bpm:", bpm);
        }}
      >
        getBpm
      </button>
    </>
  );
}

export default App;
