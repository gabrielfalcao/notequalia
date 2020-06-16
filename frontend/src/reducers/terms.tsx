import { TermsReducerState, TermsAction, MapOfTermProps } from "./types";
import { TermProps } from "../domain/terms";

const NewState = (): TermsReducerState => ({
    by_term: {},
    loaded: true,
    current: null
});

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

        case "LOADING_TERMS":
            return { ...state, loaded: false, current: null };

        default:
            return { ...state };
    }
};

export default terms;
