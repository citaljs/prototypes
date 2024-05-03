import type { Note, NoteStore } from "./note";
import type { Transport } from "./transport";

export interface NoteObserver {
  processNote(note: Note): void;
}

export class Scheduler {
  private observers: NoteObserver[] = [];
  private lookahead = 200;
  private lastScheduledTicks = 0;

  constructor(
    transport: Transport,
    private noteStore: NoteStore,
  ) {
    transport.on("stop", () => {
      this.resetLastScheduledTime();
    });

    transport.on("positionChanged", (currentTicks) => {
      this.scheduleNotes(currentTicks);
    });
  }

  private resetLastScheduledTime() {
    this.lastScheduledTicks = 0;
  }

  addObserver(observer: NoteObserver) {
    console.debug("Adding observer");

    this.observers.push(observer);
  }

  removeObserver(observer: NoteObserver) {
    console.debug("Removing observer");

    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  private notifyObservers(note: Note) {
    for (const observer of this.observers) {
      observer.processNote(note);
    }
  }

  private scheduleNotes(currentTicks: number) {
    const notesToSchedule = this.noteStore
      .getNotes()
      .filter(
        (note) =>
          note.ticks >= this.lastScheduledTicks &&
          note.ticks < currentTicks + this.lookahead,
      );

    this.lastScheduledTicks = currentTicks + this.lookahead;

    if (notesToSchedule.length === 0) {
      return;
    }

    notesToSchedule.sort((a, b) => a.ticks - b.ticks);
    console.debug("Scheduled notes: %o", notesToSchedule);

    while (notesToSchedule.length > 0) {
      const note = notesToSchedule.shift();
      if (note) {
        this.notifyObservers(note);
      }
    }
  }
}
