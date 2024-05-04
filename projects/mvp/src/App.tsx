import { useState } from "react";
import { NoteStore } from "./core/note";
import { Scheduler } from "./core/scheduler";
import { SineSynthesizer } from "./core/synthesizer";
import { Transport } from "./core/transport";
import { addTwinkleNotes } from "./core/utils";

const transport = new Transport(120, 480);
const noteStore = new NoteStore();
const scheduler = new Scheduler(transport, noteStore);

addTwinkleNotes(noteStore);

function App() {
  const [ready, setReady] = useState(false);

  const setup = () => {
    const audioContext = new AudioContext();
    const synthesizer = new SineSynthesizer(audioContext);
    scheduler.addObserver(synthesizer);
    setReady(true);
  };

  return (
    <>
      <h1>MVP</h1>
      <div>
        <button type="button" onClick={setup} disabled={!!ready}>
          Setup
        </button>
      </div>
      <div>
        <button type="button" onClick={() => transport.play()}>
          Play
        </button>
        <button type="button" onClick={() => transport.pause()}>
          Pause
        </button>
        <button type="button" onClick={() => transport.stop()}>
          Stop
        </button>
      </div>
    </>
  );
}

export default App;
