import { TermsReducerState, TermsAction, MapOfTermProps } from "./types";
import { TermProps } from "../domain/terms";

const NewState = (): TermsReducerState => ({
    by_term: {},
    loaded: true,
    filtered: [],
    terms: [],
    current: null,
    filterBy: null
});

const filtered = (filterBy: any, items: Array<TermProps>): Array<TermProps> => {
    const elements = [...items];
    elements.sort((a, b) => {
        if (a.id < b.id) {
            return 1;
        } else if (b.id > a.id) {
            return -1;
        }
        return 0;
    });

    return elements.filter((item: TermProps) => item.term.match(filterBy.term));
};
export const terms = (
    state: TermsReducerState = NewState(),
    action: TermsAction = {}
) => {
    switch (action.type) {
        case "LOGOUT":
        case "PURGE_DATA":
            return NewState();

        // case "SAVE_TERM":
        //     state.by_term[action.term.term] = action.term;
        //     return {
        //         ...state,
        //         by_term: Object.values(state.by_term)
        //     };

        case "ADD_TERMS":
            const new_by_term: MapOfTermProps = {};
            action.terms.forEach((term: TermProps) => {
                new_by_term[term.term] = term;
            });
            return {
                ...state,
                by_term: { ...state.by_term, ...new_by_term },
                terms: terms
            };

        case "DELETE_TERM":
            delete state.by_term[action.term];
            return {
                ...state,
                terms: filtered(state.filterBy, Object.values(state.by_term))
            };

        case "LOADING_TERMS":
            return { ...state, loaded: false, current: null };

        case "FILTER_TERMS":
            return {
                ...state,
                terms: filtered(state.filterBy, Object.values(state.by_term))
            };

        default:
            return { ...state };
    }
};

export default terms;
