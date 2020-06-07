// import jwt_decode from "jwt-decode";

const DEFAULT_STATE = {};

export const note = (state: any = DEFAULT_STATE, action: any = {}) => {
    switch (action.type) {
        case "SAVE_NOTE":
            const { note } = action;
            const { name, markdown } = note;
            return {
                ...state,
                name,
                markdown
            };

        default:
            return { ...state };
    }
};

export default note;
