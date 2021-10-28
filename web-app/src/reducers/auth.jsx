// import jwt_decode from "jwt-decode";
const DEFAULT_STATE = {};
export const auth = (state = DEFAULT_STATE, action = {}) => {
	switch (action.type) {
		case "NEW_AUTHENTICATION":
			const { user } = action.user;
			console.log("NEW_AUTHENTICATION", user);
			return {
				...state,
				...user,
			};
		case "LOGOUT":
			return {
				scope: null,
				profile: null,
				id_token: null,
				access_token: null,
				refresh_token: null,
			};
		default:
			return { ...state };
	}
};
export default auth;
