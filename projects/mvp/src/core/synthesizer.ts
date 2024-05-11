import {
  type NoteOff,
  NoteOffImmediate,
  type NoteOn,
  NoteOnImmediate,
} from "./note";
import type { SchedulerObserver } from "./scheduler";

interface SynthesizerProcessor {
  setParameter(id: string, value: unknown): void;
  getParameter(id: string): unknown;
  playNote(noteOn: NoteOnImmediate, delayTime: number): void;
  stopNote(noteOff: NoteOffImmediate, delayTime: number): void;
}

interface SynthesizerGUI {
  create(container: HTMLElement): void;
}

export interface Synthesizer {
  processor: SynthesizerProcessor;
  gui: SynthesizerGUI;
}

export class SynthesizerSchedulerAdapter implements SchedulerObserver {
  constructor(private synthesizer: Synthesizer) {}

  playNote(noteOn: NoteOn, delayTime: number) {
    this.synthesizer.processor.playNote(
      new NoteOnImmediate(noteOn.noteId, noteOn.pitch, noteOn.velocity),
      delayTime,
    );
  }

  stopNote(noteOff: NoteOff, delayTime: number) {
    this.synthesizer.processor.stopNote(
      new NoteOffImmediate(noteOff.noteId),
      delayTime,
    );
  }

  onPause() {}
  onStop() {}
  onLoop() {}
}

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

class SineSynthesizerGUI implements SynthesizerGUI {
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

interface SamplerParameters {
  sampleFile?: File;
}

type SamplerParameterId = keyof SamplerParameters;

class SamplerProcessor implements SynthesizerProcessor {
  private audioContext: AudioContext;
  private buffer?: AudioBuffer;
  private sourceNode?: AudioBufferSourceNode;
  private parameters: SamplerParameters = {};

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  playNote(_: NoteOn, delayTime = 0) {
    if (this.buffer) {
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.buffer;
      this.sourceNode.connect(this.audioContext.destination);
      this.sourceNode.start(this.audioContext.currentTime + delayTime);
    }
  }

  stopNote(): void {}

  onStop(): void {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
    }
  }

  onPause(): void {
    this.onStop();
  }

  onLoop(): void {}

  setParameter(
    id: SamplerParameterId,
    value: SamplerParameters[SamplerParameterId],
  ): void {
    this.parameters[id] = value;
    this.onParameterChange(id, value);
  }

  getParameter(id: SamplerParameterId) {
    return this.parameters[id];
  }

  private onParameterChange(
    id: SamplerParameterId,
    value: SamplerParameters[SamplerParameterId],
  ) {
    if (id === "sampleFile" && value) {
      this.loadSample(value);
    }
  }

  private async loadSample(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
  }
}

class SamplerGUI implements SynthesizerGUI {
  constructor(private processor: SamplerProcessor) {}

  create(container: HTMLElement) {
    const fragment = document.createDocumentFragment();

    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) {
        this.processor.setParameter("sampleFile", file);
      }
    });
    fragment.appendChild(input);

    const button = document.createElement("button");
    button.textContent = "Play sample";
    button.addEventListener("click", () => {
      this.processor.playNote({
        noteId: "sample",
        ticks: 0,
        pitch: 60,
        velocity: 127,
      });
    });
    fragment.appendChild(button);

    container.appendChild(fragment);
  }
}

export class SamplerSynthesizer implements Synthesizer {
  processor: SamplerProcessor;
  gui: SamplerGUI;

  constructor(audioContext: AudioContext) {
    this.processor = new SamplerProcessor(audioContext);
    this.gui = new SamplerGUI(this.processor);
  }
}
