import type { NoteOffImmediate, NoteOnImmediate } from "../core/note";

export interface SynthesizerProcessor {
  setParameter(id: string, value: unknown): void;
  getParameter(id: string): unknown;
  playNote(noteOn: NoteOnImmediate, delayTime: number): void;
  stopNote(noteOff: NoteOffImmediate, delayTime: number): void;
}

export interface SynthesizerGUI {
  create(container: HTMLElement): void;
}

export interface Synthesizer {
  processor: SynthesizerProcessor;
  gui: SynthesizerGUI;
}
