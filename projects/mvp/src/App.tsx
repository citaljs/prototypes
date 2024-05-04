import { useEffect, useRef, useState } from "react";
import { Engine } from "./core/engine";
import { addTwinkleNotes } from "./core/utils";
import { Transport } from "./ui/transport";

function App() {
  const [engine, setEngine] = useState<Engine>();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && engine) {
      new Transport(containerRef.current, engine);
    }
  }, [engine]);

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
      <div ref={containerRef} />
    </>
  );
}

export default App;
