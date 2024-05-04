import type { NoteOff, NoteOn } from "./note";
import type { SchedulerObserver } from "./scheduler";

export class SineSynthesizer implements SchedulerObserver {
  private oscillators: Map<string, OscillatorNode> = new Map();

  constructor(private audioContext: AudioContext) {}

  private clearAllOscillators() {
    for (const oscillator of this.oscillators.values()) {
      oscillator.stop();
    }
    this.oscillators.clear();
  }

  pause() {
    this.clearAllOscillators();
  }

  stop() {
    this.clearAllOscillators();
  }

  noteOn(noteOn: NoteOn, delayTime = 0) {
    const startTime = this.audioContext.currentTime + delayTime;
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

  noteOff(noteOff: NoteOff, delayTime = 0) {
    const oscillator = this.oscillators.get(noteOff.noteId);
    if (oscillator) {
      const stopTime = this.audioContext.currentTime + delayTime;
      oscillator.stop(stopTime);
      this.oscillators.delete(noteOff.noteId);

      console.debug("Tearing down oscillator for note off: %o", noteOff);
    }
  }

  private midiToFrequency(pitch: number) {
    return 440 * 2 ** ((pitch - 69) / 12);
  }
}
