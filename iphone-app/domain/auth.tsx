import PropTypes, { InferProps } from "prop-types";

export function needs_login(auth: any) {
    if (!auth) {
        return true;
    }
    if (!auth.scope) {
        return true;
    }
    return typeof auth.scope !== "string";
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
export const AuthPropTypes = PropTypes.shape({
    scope: PropTypes.string,
    access_token: PropTypes.string,
    id_token: PropTypes.string,
    refresh_token: PropTypes.string,
    profile: PropTypes.shape({
        preferred_username: PropTypes.string
    })
});

export type AuthProps = InferProps<typeof AuthPropTypes> | any;
