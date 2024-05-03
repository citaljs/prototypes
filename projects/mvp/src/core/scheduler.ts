import type { Note, NoteStore } from "./note";
import type { Transport } from "./transport";

export interface NoteObserver {
  processNote(note: Note): void;
}

export class Scheduler {
  private observers: NoteObserver[] = [];
  private queue: Array<{ note: Note; ticks: number }> = [];
  private lookahead = 200;
  private lastScheduledTicks = 0;

  constructor(
    transport: Transport,
    private noteStore: NoteStore,
  ) {
    transport.on("pause", () => {
      this.clearQueue();
    });

    transport.on("stop", () => {
      this.clearQueue();
      this.resetLastScheduledTime();
    });

    transport.on("positionChanged", (currentTicks) => {
      this.scheduleNotes(currentTicks);
      this.processQueue(currentTicks);
    });
  }

  clearQueue() {
    this.queue = [];
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
    if (currentTicks >= this.lastScheduledTicks + this.lookahead) {
      const notesToSchedule = this.noteStore
        .getNotes()
        .filter(
          (note) =>
            note.startTicks >= currentTicks &&
            note.startTicks < currentTicks + this.lookahead,
        );

      for (const note of notesToSchedule) {
        this.queue.push({ note, ticks: note.startTicks });
      }

      this.queue.sort((a, b) => a.ticks - b.ticks);
      this.lastScheduledTicks = currentTicks;

      console.debug("Scheduled notes: %o", notesToSchedule);
      console.debug("Current queue:", [...this.queue]);
    }
  }

  private processQueue(currentTicks: number) {
    while (this.queue.length > 0 && this.queue[0].ticks <= currentTicks) {
      const event = this.queue.shift();
      if (event) {
        this.notifyObservers(event.note);
      }
    }
  }
}
