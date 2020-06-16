import axios, {
    AxiosRequestConfig,
    AxiosResponse
    // AxiosPromise
} from "axios";
import { TermProps } from "./domain/terms";

export class APIRouter {
    private baseURL: string;
    constructor(baseURL: string) {
        const match = baseURL.match(/^(https?:[/][/].*)[/]+$/);
        if (!match) {
            throw new Error(`Invalid url: "${baseURL}"`);
        }
        this.baseURL = baseURL;
    }

    public urlFor = (path: string): string => {
        return [
            this.baseURL.replace(/[/]+$/, ""),
            path.replace(/^[/]+/, "")
        ].join("/");
    };
}

export type ErrorHandler = (err: Error) => void;
export type SuccessHandler = (data: any) => void;

export class DictionaryAPIClient {
    private api: APIRouter;
    private defaultOptions: AxiosRequestConfig;
    private handleError: ErrorHandler;

    constructor(handleError: ErrorHandler) {
        this.api = new APIRouter("https://cognod.es/");
        this.defaultOptions = {
            headers: { "Content-Type": "application/json" }
        };
        this.handleError = handleError;
    }

    private getOptions = (): any => {
        return { ...this.defaultOptions };
    };
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
