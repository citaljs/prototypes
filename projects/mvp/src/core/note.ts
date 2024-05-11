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
}
