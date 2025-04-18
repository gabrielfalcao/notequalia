import { NoteProps } from "../domain/notes";
import { TermProps } from "../domain/terms";
import { ErrorProps } from "../domain/errors";
import { UserProps } from "../domain/users";

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
};

export type MapOfUserProps = { [index: string]: UserProps };
export type UsersReducerState = {
    by_id: MapOfUserProps;
    loaded: boolean;
    current: UserProps | null;
};
export type UsersAction =
    | {
        user: UserProps;
        extendOnly: boolean;
        users: Array<UserProps>;
    }
    | any;
export type UserListState = {
    users: UserProps[];
};

export type ErrorsReducerState = {
    all: Array<ErrorProps | string>;
    current: ErrorProps | string | null;
};

export type ErrorsAction =
    | {
        errors: ErrorProps | string | Array<string> | Array<ErrorProps>;
        error: ErrorProps | string | null;
    }
    | any;
