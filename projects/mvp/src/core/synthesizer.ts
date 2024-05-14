import {
  type NoteOff,
  NoteOffImmediate,
  type NoteOn,
  NoteOnImmediate,
} from "./note";
import type { SchedulerObserver } from "./scheduler";

export interface SynthesizerProcessor {
  setParameter(id: string, value: unknown): void;
  getParameter(id: string): unknown;
  playNote(noteOn: NoteOnImmediate, delayTime: number): void;
  stopNote(noteOff: NoteOffImmediate, delayTime: number): void;
}

export interface SynthesizerGui {
  create(container: HTMLElement): void;
}

export interface Synthesizer {
  processor: SynthesizerProcessor;
  gui: SynthesizerGui;
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
}
