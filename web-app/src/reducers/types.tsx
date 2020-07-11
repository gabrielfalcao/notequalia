import { NoteProps } from "../domain/notes";
import { TermProps } from "../domain/terms";

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

export type MapOfTermProps = { [index: string]: TermProps };

export type TermsReducerState = {
    terms: Array<TermProps>; // note id
    by_term: MapOfTermProps;
    filtered: Array<TermProps>; // note id
    filterBy: any;
    loaded: boolean;
    current: TermProps | null;
};
export type TermsAction =
    | {
        term: TermProps;
        terms: Array<TermProps>;
    }
    | any;
export type TermListState = {
    terms: TermProps[];
};
