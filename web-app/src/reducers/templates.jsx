export const templates = (state = {}, action = {}) => {
	switch (action.type) {
		case "LOGOUT":
		case "UNLOAD_TEMPLATES":
			return {};
		case "SET_TEMPLATES":
			return { ...state };
		default:
			return { ...state };
	}
};
export default templates;
