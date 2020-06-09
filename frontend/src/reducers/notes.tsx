import { NotesReducerState, NotesAction } from "./types";

const NewState = (): NotesReducerState => ({
    all: [],
    filtered: [],
    by_id: {},
    loaded: true,
    current: null
});

export const notes = (
    state: NotesReducerState = NewState(),
    action: NotesAction = {}
) => {
    switch (action.type) {
        case "LOGOUT":
        case "PURGE_DATA":
            return NewState();

        case "RESET_NOTE_FILTERS":
            return {
                ...state,
                filtered: state.all
            };

        case "SAVE_NOTE":
            if (action.note) {
                state.by_id[action.note.id] = action.note;
                state.all.push(action.note);
            }
            return {
                ...state,
                loaded: true
            };

        case "LOADING_NOTES":
            return { ...state, loaded: false, current: null };

        case "CHANGE_NOTE":
            return {
                ...state,
                current: action.note,
                error: action.error,
                loaded: true
            };

        default:
            return { ...state };
    }
};

export default notes;
