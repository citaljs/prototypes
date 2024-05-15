import type { TicksRange } from "./utils";

export class Note {
  constructor(
    public id: string,
    public startTicks: number,
    public durationTicks: number,
    public pitch: number,
    public velocity: number,
  ) {}

  get endTicks() {
    return this.startTicks + this.durationTicks;
  }
}

export class NoteOn {
  constructor(
    public noteId: string,
    public ticks: number,
    public pitch: number,
    public velocity: number,
  ) {}
}

export class NoteOnImmediate {
  constructor(
    public noteId: string,
    public pitch: number,
    public velocity: number,
  ) {}
}

export class NoteOff {
  constructor(
    public noteId: string,
    public ticks: number,
  ) {}
}

export class NoteOffImmediate {
  constructor(public noteId: string) {}
}

export class NoteStore {
  private notes: Note[] = [];

  addNote(note: Note) {
    console.debug("Adding note: %o", note);

    this.notes.push(note);
  }

  removeNote(note: Note) {
    console.debug("Removing note: %o", note);

    this.notes = this.notes.filter((n) => n !== note);
  }

  getNotes(): Note[] {
    return this.notes;
  }

  getNotesByStartTicksRange(range: TicksRange): Note[] {
    return this.notes.filter((note) => {
      return note.startTicks >= range.start && note.startTicks < range.end;
    });
  }

  getSortedNotesByStartTicksRange(range: TicksRange): Note[] {
    return this.getNotesByStartTicksRange(range).sort(
      (a, b) => a.startTicks - b.startTicks,
    );
  }

  getNotesByEndTicksRange(range: TicksRange): Note[] {
    return this.notes.filter((note) => {
      return note.endTicks >= range.start && note.endTicks < range.end;
    });
  }

  getSortedNotesByEndTicksRange(range: TicksRange): Note[] {
    return this.getNotesByEndTicksRange(range).sort(
      (a, b) => a.endTicks - b.endTicks,
    );
  }
}
