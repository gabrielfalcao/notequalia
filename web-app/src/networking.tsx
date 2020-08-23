import axios, {
    AxiosRequestConfig,
    AxiosResponse
    // AxiosPromise
} from "axios";
import { TermProps } from "./domain/terms";
import { UserProps } from "./domain/users";

export class APIRouter {
    private baseURL: string;
    constructor(baseURL: string) {
        const match = baseURL.match(/^(https?:[/][/].*)[/]+$/);
        if (!match) {
            throw new Error(`Invalid url: "${baseURL}"`);
        }
        this.baseURL = baseURL;
        console.log(`API Router base url= ${baseURL}`);
    }

    public urlFor = (path: string): string => {
        return [
            this.baseURL.replace(/[/]+$/, ""),
            path.replace(/^[/]+/, "")
        ].join("/");
    };
}

const getAPIBaseURL = (): string => {
    if ((window.location.href + "").match(/localhost/)) {
        return "http://localhost:5000/";
    }
    return "https://cognod.es/";
};
export type ErrorHandler = (err: Error) => void;
export type SuccessHandler = (data: any) => void;

export class BaseAPIClient {
    protected api: APIRouter;
    protected defaultOptions: AxiosRequestConfig;
    protected handleError: ErrorHandler;

    constructor(handleError: ErrorHandler) {
        this.api = new APIRouter(getAPIBaseURL());
        this.defaultOptions = {
            headers: { "Content-Type": "application/json" }
        };
        this.handleError = handleError;
    }

    protected getOptions = (): any => {
        return { ...this.defaultOptions };
    };
}

export class DictionaryAPIClient extends BaseAPIClient {
    public listDefinitions = (handler: SuccessHandler): void => {
        const url = this.api.urlFor("/api/v1/dict/definitions");
        axios
            .get(url, this.getOptions())
            .then((response: AxiosResponse<TermProps[]>) => {
                return response.data;
            })
            .catch(this.handleError)
            .then(handler);
    };
    public searchDefinition = (term: string, handler: SuccessHandler): void => {
        const url = this.api.urlFor("/api/v1/dict/definitions");
        axios
            .post(url, { term: term }, this.getOptions())
            .then((response: AxiosResponse<TermProps>) => {
                return response.data;
            })
            .catch(this.handleError)
            .then(handler);
    };
    public deleteDefinition = (term: string, handler: SuccessHandler): void => {
        const url = this.api.urlFor(`/api/v1/dict/term/${term}`);
        axios
            .delete(url, this.getOptions())
            .then((response: AxiosResponse<TermProps>) => {
                return response.data;
            })
            .catch(this.handleError)
            .then(handler);
    };
}

export class AdminAPIClient extends BaseAPIClient {
    public listUsers = (handler: SuccessHandler): void => {
        const url = this.api.urlFor("/api/v1/users/");
        axios
            .get(url, this.getOptions())
            .then((response: AxiosResponse<UserProps[]>) => {
                return response.data;
            })
            .catch(this.handleError)
            .then(handler);
    };
    public searchUser = (email: string, handler: SuccessHandler): void => {
        const url = this.api.urlFor(`/api/v1/users/by-email/?email=${email}`);
        axios
            .get(url, this.getOptions())
            .then((response: AxiosResponse<UserProps>) => {
                return response.data;
            })
            .catch(this.handleError)
            .then(handler);
    };
    public deleteUser = (id: string, handler: SuccessHandler): void => {
        const url = this.api.urlFor(`/api/v1/users/${id}/`);
        axios
            .delete(url, this.getOptions())
            .then((response: AxiosResponse<UserProps>) => {
                return response.data;
            })
            .catch(this.handleError)
            .then(handler);
    };
    public createUser = (
        email: string,
        password: string,
        handler: SuccessHandler
    ): void => {
        const url = this.api.urlFor("/api/v1/users/");
        axios
            .post(url, { email, password }, this.getOptions())
            .then((response: AxiosResponse<UserProps>) => {
                return response.data;
            })
            .catch(this.handleError)
            .then(handler);
    };
}

export class AuthAPIClient extends BaseAPIClient {
    public authenticate = (
        email: string,
        password: string,
        handler: SuccessHandler
    ): void => {
        const url = this.api.urlFor("/api/v1/auth/");
        axios
            .post(url, { email, password }, this.getOptions())
            .then((response: AxiosResponse<UserProps>) => {
                console.log("response", response);
                return response.data;
            })
            .catch(this.handleError)
            .then(handler);
    };
}
