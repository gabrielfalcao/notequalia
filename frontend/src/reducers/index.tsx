import { combineReducers } from "redux";
import { compose } from "redux";
import { auth } from "./auth";
import { notes } from "./notes";
import { templates } from "./templates";
import { connectRouter } from "connected-react-router";
import { history } from "../history";

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
        notes,
        templates,
        router: connectRouter(history)
    })
);
