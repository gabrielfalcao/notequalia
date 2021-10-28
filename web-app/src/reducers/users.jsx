const NewState = () => ({
	by_id: {},
	loaded: true,
	current: null,
});
export const users = (state = NewState(), action = {}) => {
	switch (action.type) {
		case "LOGOUT":
		case "PURGE_DATA":
			return NewState();
		case "ADD_USERS":
			const new_by_id = {};
			if (action.users.forEach) {
				action.users.forEach((user) => {
					new_by_id[user.id] = user;
				});
			}
			if (action.extendOnly) {
				return {
					...state,
					by_id: { ...state.by_id, ...new_by_id },
					users: users,
				};
			} else {
				return {
					...state,
					by_id: { ...new_by_id },
					users: action.users,
				};
			}
		case "DELETE_USER":
			delete state.by_id[action.user.email];
			return {
				...state,
				users: Object.values(state.by_id),
			};
		case "LOADING_USERS":
			return { ...state, loaded: false, current: null };
		default:
			return { ...state };
	}
};
export default users;
