import { NoteProps } from "../domain/notes";

export type NotesReducerState = {
    all: Array<NoteProps>; // note id
    filtered: Array<NoteProps>; // note id
    by_id: { [index: string]: NoteProps };
    loaded: boolean;
    current: NoteProps | null;
};
export type NotesAction =
    | {
        note: NoteProps;
    }
    | any;
