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
    by_term: MapOfTermProps;
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
    searchTerm: string;
};
