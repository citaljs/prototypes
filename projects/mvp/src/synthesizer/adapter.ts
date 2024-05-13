import {
  type NoteOff,
  NoteOffImmediate,
  type NoteOn,
  NoteOnImmediate,
} from "../core/note";
import type { SchedulerObserver } from "../core/scheduler";
import type { Synthesizer } from "./base";

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
