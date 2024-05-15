import { Note, type NoteStore } from "./note";

export interface TicksRange {
  start: number;
  end: number;
}

export function randomId() {
  return Math.random().toString(36).slice(2);
}

export function addTwinkleNotes(noteStore: NoteStore) {
  noteStore.addNote(new Note(randomId(), 480 * 0, 480 * 1, 60, 64));
  noteStore.addNote(new Note(randomId(), 480 * 1, 480 * 1, 60, 64));
  noteStore.addNote(new Note(randomId(), 480 * 2, 480 * 1, 67, 64));
  noteStore.addNote(new Note(randomId(), 480 * 3, 480 * 1, 67, 64));
  noteStore.addNote(new Note(randomId(), 480 * 4, 480 * 1, 69, 64));
  noteStore.addNote(new Note(randomId(), 480 * 5, 480 * 1, 69, 64));
  noteStore.addNote(new Note(randomId(), 480 * 6, 480 * 2, 67, 64));

  noteStore.addNote(new Note(randomId(), 480 * 0, 480 * 2, 48, 32));
  noteStore.addNote(new Note(randomId(), 480 * 2, 480 * 2, 55, 32));
  noteStore.addNote(new Note(randomId(), 480 * 4, 480 * 2, 53, 32));
  noteStore.addNote(new Note(randomId(), 480 * 6, 480 * 2, 48, 32));

  noteStore.addNote(new Note(randomId(), 480 * 8, 480 * 1, 65, 64));
  noteStore.addNote(new Note(randomId(), 480 * 9, 480 * 1, 65, 64));
  noteStore.addNote(new Note(randomId(), 480 * 10, 480 * 1, 64, 64));
  noteStore.addNote(new Note(randomId(), 480 * 11, 480 * 1, 64, 64));
  noteStore.addNote(new Note(randomId(), 480 * 12, 480 * 1, 62, 64));
  noteStore.addNote(new Note(randomId(), 480 * 13, 480 * 1, 62, 64));
  noteStore.addNote(new Note(randomId(), 480 * 14, 480 * 2, 60, 64));

  noteStore.addNote(new Note(randomId(), 480 * 8, 480 * 2, 53, 32));
  noteStore.addNote(new Note(randomId(), 480 * 10, 480 * 2, 48, 32));
  noteStore.addNote(new Note(randomId(), 480 * 12, 480 * 2, 55, 32));
  noteStore.addNote(new Note(randomId(), 480 * 14, 480 * 2, 48, 32));

  noteStore.addNote(new Note(randomId(), 480 * 16, 480 * 1, 67, 64));
  noteStore.addNote(new Note(randomId(), 480 * 17, 480 * 1, 67, 64));
  noteStore.addNote(new Note(randomId(), 480 * 18, 480 * 1, 65, 64));
  noteStore.addNote(new Note(randomId(), 480 * 19, 480 * 1, 65, 64));
  noteStore.addNote(new Note(randomId(), 480 * 20, 480 * 1, 64, 64));
  noteStore.addNote(new Note(randomId(), 480 * 21, 480 * 1, 64, 64));
  noteStore.addNote(new Note(randomId(), 480 * 22, 480 * 2, 62, 64));

  noteStore.addNote(new Note(randomId(), 480 * 16, 480 * 2, 48, 32));
  noteStore.addNote(new Note(randomId(), 480 * 18, 480 * 2, 53, 32));
  noteStore.addNote(new Note(randomId(), 480 * 20, 480 * 2, 48, 32));
  noteStore.addNote(new Note(randomId(), 480 * 22, 480 * 2, 55, 32));

  noteStore.addNote(new Note(randomId(), 480 * 24, 480 * 1, 67, 64));
  noteStore.addNote(new Note(randomId(), 480 * 25, 480 * 1, 67, 64));
  noteStore.addNote(new Note(randomId(), 480 * 26, 480 * 1, 65, 64));
  noteStore.addNote(new Note(randomId(), 480 * 27, 480 * 1, 65, 64));
  noteStore.addNote(new Note(randomId(), 480 * 28, 480 * 1, 64, 64));
  noteStore.addNote(new Note(randomId(), 480 * 29, 480 * 1, 64, 64));
  noteStore.addNote(new Note(randomId(), 480 * 30, 480 * 2, 62, 64));

  noteStore.addNote(new Note(randomId(), 480 * 24, 480 * 2, 48, 32));
  noteStore.addNote(new Note(randomId(), 480 * 26, 480 * 2, 53, 32));
  noteStore.addNote(new Note(randomId(), 480 * 28, 480 * 2, 48, 32));
  noteStore.addNote(new Note(randomId(), 480 * 30, 480 * 2, 55, 32));

  noteStore.addNote(new Note(randomId(), 480 * 32, 480 * 1, 60, 64));
  noteStore.addNote(new Note(randomId(), 480 * 33, 480 * 1, 60, 64));
  noteStore.addNote(new Note(randomId(), 480 * 34, 480 * 1, 67, 64));
  noteStore.addNote(new Note(randomId(), 480 * 35, 480 * 1, 67, 64));
  noteStore.addNote(new Note(randomId(), 480 * 36, 480 * 1, 69, 64));
  noteStore.addNote(new Note(randomId(), 480 * 37, 480 * 1, 69, 64));
  noteStore.addNote(new Note(randomId(), 480 * 38, 480 * 2, 67, 64));

  noteStore.addNote(new Note(randomId(), 480 * 32, 480 * 2, 48, 32));
  noteStore.addNote(new Note(randomId(), 480 * 34, 480 * 2, 55, 32));
  noteStore.addNote(new Note(randomId(), 480 * 36, 480 * 2, 53, 32));
  noteStore.addNote(new Note(randomId(), 480 * 38, 480 * 2, 48, 32));

  noteStore.addNote(new Note(randomId(), 480 * 40, 480 * 1, 65, 64));
  noteStore.addNote(new Note(randomId(), 480 * 41, 480 * 1, 65, 64));
  noteStore.addNote(new Note(randomId(), 480 * 42, 480 * 1, 64, 64));
  noteStore.addNote(new Note(randomId(), 480 * 43, 480 * 1, 64, 64));
  noteStore.addNote(new Note(randomId(), 480 * 44, 480 * 1, 62, 64));
  noteStore.addNote(new Note(randomId(), 480 * 45, 480 * 1, 62, 64));
  noteStore.addNote(new Note(randomId(), 480 * 46, 480 * 2, 60, 64));

  noteStore.addNote(new Note(randomId(), 480 * 40, 480 * 2, 53, 32));
  noteStore.addNote(new Note(randomId(), 480 * 42, 480 * 2, 48, 32));
  noteStore.addNote(new Note(randomId(), 480 * 44, 480 * 2, 55, 32));
  noteStore.addNote(new Note(randomId(), 480 * 46, 480 * 2, 48, 32));
}
