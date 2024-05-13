import { NoteOff, NoteOn, type NoteStore } from "./note";
import type { Loop, Transport } from "./transport";

export interface SchedulerObserver {
  playNote(noteOn: NoteOn, delayTime: number): void;
  stopNote(noteOff: NoteOff, delayTime: number): void;
  onPause(): void;
  onStop(): void;
  onLoop(): void;
}

export class Scheduler {
  private observers: SchedulerObserver[] = [];
  private lookahead = 200;
  private lastScheduledTicks = 0;

  constructor(
    transport: Transport,
    private noteStore: NoteStore,
  ) {
    transport.on("pause", () => {
      this.notifyPause();
    });

    transport.on("stop", () => {
      this.resetLastScheduledTime();
      this.notifyStop();
    });

    transport.on("loop", ({ loop }) => {
      this.lastScheduledTicks = loop.range.start;
      this.notifyLoop();
    });

    transport.on(
      "positionChanged",
      ({ currentTicks, bpm, ppq, state, loop }) => {
        if (state === "playing") {
          this.scheduleNotes(currentTicks, bpm, ppq, loop);
        }
      },
    );
  }

  private resetLastScheduledTime() {
    this.lastScheduledTicks = 0;
  }

  addObserver(observer: SchedulerObserver) {
    console.debug("Adding observer");

    this.observers.push(observer);
  }

  removeObserver(observer: SchedulerObserver) {
    console.debug("Removing observer");

    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  private notifyPause() {
    for (const observer of this.observers) {
      observer.onPause();
    }
  }

  private notifyStop() {
    for (const observer of this.observers) {
      observer.onStop();
    }
  }

  private notifyLoop() {
    for (const observer of this.observers) {
      observer.onLoop();
    }
  }

  private notifyNoteOn(noteOn: NoteOn, delayTime = 0) {
    for (const observer of this.observers) {
      observer.playNote(noteOn, delayTime);
    }
  }

  private notifyNoteOff(noteOff: NoteOff, delayTime = 0) {
    for (const observer of this.observers) {
      observer.stopNote(noteOff, delayTime);
    }
  }

  private scheduleNotes(
    currentTicks: number,
    bpm: number,
    ppq: number,
    loop: Loop,
  ) {
    const scheduledNoteOnEvents = this.noteStore
      .getNotes()
      .filter(
        (note) =>
          note.startTicks >= this.lastScheduledTicks &&
          note.startTicks <
            (loop.enabled
              ? Math.min(currentTicks + this.lookahead, loop.range.end)
              : currentTicks + this.lookahead),
      )
      .map(
        (note) =>
          new NoteOn(note.id, note.startTicks, note.pitch, note.velocity),
      );

    scheduledNoteOnEvents.sort((a, b) => a.ticks - b.ticks);
    console.debug("Scheduled note on events: %o", scheduledNoteOnEvents);

    while (scheduledNoteOnEvents.length > 0) {
      const noteOn = scheduledNoteOnEvents.shift();
      if (noteOn) {
        const delayTime = Math.max(
          0,
          (noteOn.ticks - currentTicks) / ppq / (bpm / 60),
        );
        this.notifyNoteOn(noteOn, delayTime);
      }
    }

    const scheduledNoteOffEvents = this.noteStore
      .getNotes()
      .filter(
        (note) =>
          note.endTicks >= this.lastScheduledTicks &&
          note.startTicks <
            (loop.enabled
              ? Math.min(currentTicks + this.lookahead, loop.range.end)
              : currentTicks + this.lookahead),
      )
      .map((note) => new NoteOff(note.id, note.endTicks));

    scheduledNoteOffEvents.sort((a, b) => a.ticks - b.ticks);
    console.debug("Scheduled note off events: %o", scheduledNoteOffEvents);

    while (scheduledNoteOffEvents.length > 0) {
      const noteOff = scheduledNoteOffEvents.shift();
      if (noteOff) {
        const delayTime = Math.max(
          0,
          (noteOff.ticks - currentTicks) / ppq / (bpm / 60),
        );
        this.notifyNoteOff(noteOff, delayTime);
      }
    }

    this.lastScheduledTicks = currentTicks + this.lookahead;
  }
}
