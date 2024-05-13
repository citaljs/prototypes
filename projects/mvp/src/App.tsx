import { useEffect, useRef, useState } from "react";
import { Engine } from "./core/engine";
import { addTwinkleNotes } from "./core/utils";
import { SamplerSynthesizer } from "./synthesizer/sampler";
import "./ui/styles.css";
import { Transport } from "./ui/transport";

const synthesizer = new SamplerSynthesizer(new AudioContext());

function App() {
  const [engine, setEngine] = useState<Engine>();

  const containerRef = useRef<HTMLDivElement>(null);
  const synthContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && engine) {
      new Transport(containerRef.current, engine);
    }

    if (synthContainerRef.current && engine) {
      synthesizer.gui.create(synthContainerRef.current);
    }
  }, [engine]);

  const setup = () => {
    const engine = new Engine(synthesizer);
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
      <div ref={synthContainerRef} />
    </>
  );
}

export default App;
