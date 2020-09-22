import { combineReducers } from "redux";
import { compose } from "redux";
import { auth } from "./auth";
import { notes } from "./notes";
import { terms } from "./terms";
import { errors } from "./errors";
import { users } from "./users";
import { templates } from "./templates";
import { connectRouter } from "connected-react-router";
import { history } from "../history";

const DEFAULT_STATE = {};

export const mainReducer = (state: any = DEFAULT_STATE, action: any = {}) => {
    switch (action.type) {
        case "ADD_ERROR":
            console.log(`ADD_ERROR ${action.error}`, action);
            return { ...state, errors: JSON.stringify(action.error) };
        default:
            return { ...state };
    }
};

export default compose(
    mainReducer,
    combineReducers({
        auth,
        terms,
        errors,
        users,
        notes,
        templates,
        router: connectRouter(history)
    })
);
