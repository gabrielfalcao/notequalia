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
    console.log(
        "[start] reducers.terms.filtered(filterBy, items)",
        filterBy,
        items
    );
    const elements = [...items];
    elements.sort((a, b) => {
        const aid = parseInt(a.id);
        const bid = parseInt(b.id);
        if (aid < bid) {
            return -1;
        } else if (bid > aid) {
            return 1;
        }
        return 0;
    });

    if (!filterBy) {
        return elements;
    }

    const result = elements.filter(
        (item: TermProps) => item.term.search(filterBy.term) > 0
    );
    console.log("[end] reducers.terms.filtered() -> result", result);
    return result;
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
                terms: filtered(action.filterBy, Object.values(state.by_term))
            };

        case "DELETE_TERM":
            delete state.by_term[action.term];
            return {
                ...state,
                terms: filtered(action.filterBy, Object.values(state.by_term))
            };

        case "LOADING_TERMS":
            return { ...state, loaded: false, current: null };

        case "FILTER_TERMS":
            return {
                ...state,
                filterBy: action.filterBy,
                terms: filtered(action.filterBy, Object.values(state.by_term))
            };

        default:
            return { ...state };
    }
};

export default terms;
