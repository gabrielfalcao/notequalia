import { v5 as uuidv5 } from "uuid"; // For version 5
import { NotesReducerState, NotesAction } from "./types";
import { Markdown } from "../markdown";

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
            state.by_id[action.note.id] = action.note;
            return {
                ...state,
                all: Object.values(state.by_id)
            };
        case "NEW_NOTE":
            const markdown = new Markdown(action.markdown);
            const newNote = {
                id: uuidv5(markdown.attributes.title, uuidv5.DNS),
                metadata: markdown.attributes,
                markdown: action.markdown
            };
            state.by_id[newNote.id] = newNote;
            state.all.push(newNote);
            return { ...state };

        case "DELETE_NOTE":
            const id_to_delete: string = action.note.id;
            if (!action.note) {
                return { ...state };
            }
            delete state.by_id[id_to_delete];
            return {
                ...state,
                all: state.all.filter(item => item.id !== id_to_delete)
            };

        case "LOADING_NOTES":
            return { ...state, loaded: false, current: null };

        case "CHANGE_NOTE":
            return {
                ...state,
                current: action.note,
                loaded: true
            };

        default:
            return { ...state };
    }
};

export default notes;
