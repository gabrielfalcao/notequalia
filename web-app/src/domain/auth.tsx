// import { InferProps } from "prop-types";
import { UserPropTypes, UserProps } from "./users";

export function needs_login(auth: any) {
    if (!auth) {
        return true;
    }
    if (!auth.access_token) {
        return true;
    }
    return false;
}

export class Scope {
    auth: AuthProps;
    constructor(auth: AuthProps) {
        this.auth = auth;
    }
    public matches(regex: RegExp): boolean {
        return this.auth.scope.match(regex) !== null;
    }
    public canRead(): boolean {
        return this.matches(/notes:read/);
    }
    public canWrite(): boolean {
        return this.matches(/notes:write/);
    }
}
export const AuthPropTypes = UserPropTypes;

export type AuthProps = UserProps;
