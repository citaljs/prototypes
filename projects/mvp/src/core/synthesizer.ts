import type { NoteOff, NoteOn } from "./note";
import type { NoteObserver } from "./scheduler";

export class SineSynthesizer implements NoteObserver {
  private oscillators: Map<string, OscillatorNode> = new Map();

  constructor(private audioContext: AudioContext) {}

  noteOn(noteOn: NoteOn) {
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      this.midiToFrequency(noteOn.pitch),
      this.audioContext.currentTime,
    );
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(
      noteOn.velocity / 127,
      this.audioContext.currentTime,
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();

    this.oscillators.set(noteOn.noteId, oscillator);

    console.debug("Setting up oscillator for note on: %o", noteOn);
  }

  noteOff(noteOff: NoteOff) {
    const oscillator = this.oscillators.get(noteOff.noteId);
    if (oscillator) {
      oscillator.stop();
      this.oscillators.delete(noteOff.noteId);

      console.debug("Tearing down oscillator for note off: %o", noteOff);
    }
  }

  private midiToFrequency(pitch: number) {
    return 440 * 2 ** ((pitch - 69) / 12);
  }
}
