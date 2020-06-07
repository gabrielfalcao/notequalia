export type AuthProps = {
    scope: string | null;
    access_token: string | null;
    user: any | null;
};

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
