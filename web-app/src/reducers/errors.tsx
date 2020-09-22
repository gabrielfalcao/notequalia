import { ErrorsReducerState, ErrorsAction } from "./types";
// import { ErrorProps } from "../domain/errors";

const NewState = (): ErrorsReducerState => ({
    all: null,
    current: null
});

export const errors = (
    state: ErrorsReducerState = NewState(),
    action: ErrorsAction = {}
) => {
    switch (action.type) {
        case "LOGOUT":
        case "PURGE_DATA":
            return NewState();

        // case "SAVE_ERROR":
        //     state.by_error[action.error.error] = action.error;
        //     return {
        //         ...state,
        //         by_error: Object.values(state.by_error)
        //     };

        case "ADD_ERROR":
            return {
                ...state,
                all: [action.error],
                current: action.error
            };

        default:
            return { ...state };
    }
};

export default errors;
