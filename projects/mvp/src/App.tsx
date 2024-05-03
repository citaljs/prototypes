import { useState } from "react";
import {
  type SoundFont2SynthNode,
  createSoundFont2SynthNode,
} from "sf2-synth-audio-worklet";
import sf2Url from "/sinewave.sf2?url";
import { Note, NoteStore } from "./core/note";
import { type NoteObserver, Scheduler } from "./core/scheduler";
import { Transport } from "./core/transport";

class Synthesizer implements NoteObserver {
  constructor(private node: SoundFont2SynthNode) {}

  processNote(note: Note) {
    this.node.noteOn(0, note.pitch, note.velocity, 0);
    const durationTime = (note.durationTicks / 480) * (60 / 120);
    this.node.noteOff(0, note.pitch, durationTime);
  }
}

const transport = new Transport(120, 480);
const noteStore = new NoteStore();
const scheduler = new Scheduler(transport, noteStore);

noteStore.addNote(new Note(480, 480, 60, 100));
noteStore.addNote(new Note(960, 240, 64, 100));

function App() {
  const [node, setNode] = useState<SoundFont2SynthNode>();

  const setup = () => {
    const audioContext = new AudioContext();

    createSoundFont2SynthNode(audioContext, sf2Url).then((node) => {
      node.connect(audioContext.destination);
      setNode(node);
      const synthesizer = new Synthesizer(node);
      scheduler.addObserver(synthesizer);
    });
  };

  return (
    <>
      <h1>MVP</h1>
      <div>
        <button type="button" onClick={setup} disabled={!!node}>
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
