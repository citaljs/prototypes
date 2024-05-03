export class Note {
  constructor(
    public startTicks: number,
    public endTicks: number,
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
    console.debug("Getting notes: %o", this.notes);

    return this.notes;
  }
}
