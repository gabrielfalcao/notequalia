import { NoteProps } from "../domain/notes";

export type NotesReducerState = {
    all: Array<string>; // note id
    filtered: Array<string>; // note id
    by_id: { [index: string]: NoteProps };
    loaded: boolean;
    current: NoteProps | null;
};
export type NotesAction =
    | {
        note: NoteProps;
    }
    | any;
