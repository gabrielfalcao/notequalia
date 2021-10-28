// import { InferProps } from "prop-types";
import { UserPropTypes } from "./users";
export function needs_login(auth) {
	if (!auth) {
		return true;
	}
	if (!auth.access_token) {
		return true;
	}
	return false;
}
export class Scope {
	constructor(auth) {
		this.auth = auth;
	}
	matches(regex) {
		return this.auth.scope.match(regex) !== null;
	}
	canRead() {
		return this.matches(/notes:read/);
	}
	canWrite() {
		return this.matches(/notes:write/);
	}
}
export const AuthPropTypes = UserPropTypes;
