import { useState } from "react";
import { Engine } from "./core/engine";
import { addTwinkleNotes } from "./core/utils";

function App() {
  const [engine, setEngine] = useState<Engine>();

  const setup = () => {
    const engine = new Engine();
    const store = engine.getStore();
    addTwinkleNotes(store);
    setEngine(engine);
  };

  return (
    <>
      <h1>MVP</h1>
      <div>
        <button type="button" onClick={setup} disabled={!!engine}>
          Setup
        </button>
      </div>
      <div>
        <button type="button" onClick={() => engine?.play()}>
          Play
        </button>
        <button type="button" onClick={() => engine?.pause()}>
          Pause
        </button>
        <button type="button" onClick={() => engine?.stop()}>
          Stop
        </button>
      </div>
    </>
  );
}

export default App;
