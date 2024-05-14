import type { NoteOffImmediate, NoteOnImmediate } from "../core/note";
import type {
  Synthesizer,
  SynthesizerGui,
  SynthesizerProcessor,
} from "../core/synthesizer";

class SineSynthesizerProcessor implements SynthesizerProcessor {
  private audioContext: AudioContext;
  private oscillators: Map<string, OscillatorNode> = new Map();

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  playNote(noteOn: NoteOnImmediate, delayTime = 0) {
    console.debug("Playing note: %o", noteOn);
    const startTime = this.audioContext.currentTime + delayTime;
    console.debug("Start time: %o", startTime, delayTime);
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      this.midiToFrequency(noteOn.pitch),
      startTime,
    );
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(noteOn.velocity / 127, startTime);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start(startTime);

    this.oscillators.set(noteOn.noteId, oscillator);

    console.debug("Setting up oscillator for note on: %o", noteOn);
  }

  stopNote(noteOff: NoteOffImmediate, delayTime = 0) {
    const oscillator = this.oscillators.get(noteOff.noteId);
    if (oscillator) {
      const stopTime = this.audioContext.currentTime + delayTime;
      oscillator.stop(stopTime);
      this.oscillators.delete(noteOff.noteId);

      console.debug("Tearing down oscillator for note off: %o", noteOff);
    }
  }

  private clearAllOscillators() {
    for (const oscillator of this.oscillators.values()) {
      oscillator.stop();
    }
    this.oscillators.clear();
  }

  onPause() {
    this.clearAllOscillators();
  }

  onStop() {
    this.clearAllOscillators();
  }

  onLoop() {
    this.clearAllOscillators();
  }

  setParameter() {}
  getParameter() {}

  private midiToFrequency(pitch: number) {
    return 440 * 2 ** ((pitch - 69) / 12);
  }
}

class SineSynthesizerGUI implements SynthesizerGui {
  constructor(private processor: SineSynthesizerProcessor) {}

  create(container: HTMLElement) {
    const fragment = document.createDocumentFragment();

    const button = document.createElement("button");
    button.textContent = "Play note";
    button.addEventListener("click", () => {
      this.processor.playNote({
        noteId: "sine",
        pitch: 60,
        velocity: 127,
      });
    });
    fragment.appendChild(button);

    container.appendChild(fragment);
  }
}

export class SineSynthesizer implements Synthesizer {
  processor: SineSynthesizerProcessor;
  gui: SineSynthesizerGUI;

  constructor(audioContext: AudioContext) {
    this.processor = new SineSynthesizerProcessor(audioContext);
    this.gui = new SineSynthesizerGUI(this.processor);
  }
}
