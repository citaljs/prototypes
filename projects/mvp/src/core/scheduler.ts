import { NoteOff, NoteOn, type NoteStore } from "./note";
import type { Transport } from "./transport";

export interface SchedulerObserver {
  pause(): void;
  stop(): void;
  noteOn(noteOn: NoteOn): void;
  noteOff(noteOff: NoteOff): void;
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

    transport.on("positionChanged", (currentTicks) => {
      this.scheduleNotes(currentTicks);
    });
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
      observer.pause();
    }
  }

  private notifyStop() {
    for (const observer of this.observers) {
      observer.stop();
    }
  }

  private notifyNoteOn(noteOn: NoteOn) {
    for (const observer of this.observers) {
      observer.noteOn(noteOn);
    }
  }

  private notifyNoteOff(noteOff: NoteOff) {
    for (const observer of this.observers) {
      observer.noteOff(noteOff);
    }
  }

  private scheduleNotes(currentTicks: number) {
    const scheduledNoteOnEvents = this.noteStore
      .getNotes()
      .filter(
        (note) =>
          note.startTicks >= this.lastScheduledTicks &&
          note.startTicks < currentTicks + this.lookahead,
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
        this.notifyNoteOn(noteOn);
      }
    }

    const scheduledNoteOffEvents = this.noteStore
      .getNotes()
      .filter(
        (note) =>
          note.endTicks >= this.lastScheduledTicks &&
          note.endTicks < currentTicks + this.lookahead,
      )
      .map((note) => new NoteOff(note.id, note.endTicks));

    scheduledNoteOffEvents.sort((a, b) => a.ticks - b.ticks);
    console.debug("Scheduled note off events: %o", scheduledNoteOffEvents);

    while (scheduledNoteOffEvents.length > 0) {
      const noteOff = scheduledNoteOffEvents.shift();
      if (noteOff) {
        this.notifyNoteOff(noteOff);
      }
    }

    this.lastScheduledTicks = currentTicks + this.lookahead;
  }
}
