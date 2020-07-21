import { combineReducers } from "redux";
import { compose } from "redux";
import { auth } from "./auth";
import { notes } from "./notes";
import { terms } from "./terms";
import { templates } from "./templates";
import { connectRouter } from "connected-react-router";
import { history } from "../history";

const DEFAULT_STATE = {};

export const mainReducer = (state: any = DEFAULT_STATE, action: any = {}) => {
    switch (action.type) {
        case "ADD_ERROR":
            return { ...state, error: action };
        default:
            return { ...state };
    }
};

export default compose(
    mainReducer,
    combineReducers({
        auth,
        terms,
        notes,
        templates,
        router: connectRouter(history)
    })
);
