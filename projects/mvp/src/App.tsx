import { Note, NoteStore } from "./core/note";
import { type NoteObserver, Scheduler } from "./core/scheduler";
import { Transport } from "./core/transport";

class Synthesizer implements NoteObserver {
  processNote(note: Note) {
    console.debug("Playing note %o", note);
  }
}

const transport = new Transport(120, 480);
const noteStore = new NoteStore();
const scheduler = new Scheduler(transport, noteStore);
const synthesizer = new Synthesizer();

scheduler.addObserver(synthesizer);

noteStore.addNote(new Note(480, 1, 60, 100));
noteStore.addNote(new Note(960, 1, 64, 100));

function App() {
  return (
    <>
      <h1>MVP</h1>
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
