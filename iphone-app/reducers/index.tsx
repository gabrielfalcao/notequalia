import { combineReducers } from "redux";
import { compose } from "redux";
import { auth } from "./auth";
import { terms } from "./terms";

const DEFAULT_STATE = {};

export const mainReducer = (state: any = DEFAULT_STATE, action: any = {}) => {
    switch (action.type) {
        default:
            return { ...state };
    }
};

export default compose(
    mainReducer,
    combineReducers({
        auth,
        terms
    })
);
