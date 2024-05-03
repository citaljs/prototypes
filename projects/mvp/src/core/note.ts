export class Note {
  constructor(
    public ticks: number,
    public durationTicks: number,
    public pitch: number,
    public velocity: number,
  ) {}
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
