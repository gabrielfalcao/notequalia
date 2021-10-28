import axios from "axios";
export class APIRouter {
	constructor(baseURL) {
		this.urlFor = (path) => {
			return [
				this.baseURL.replace(/[/]+$/, ""),
				path.replace(/^[/]+/, ""),
			].join("/");
		};
		const match = baseURL.match(/^(https?:[/][/].*)[/]+$/);
		if (!match) {
			throw new Error(`Invalid url: "${baseURL}"`);
		}
		this.baseURL = baseURL;
		console.log(`API Router base url= ${baseURL}`);
	}
}
const getAPIBaseURL = () => {
	// if ((window.location.href + "").match(/localhost/)) {
	//     return "http://localhost:5000/";
	// }
	return "https://cognod.es/";
};
export class CoreAPIClient {
	constructor(handleError) {
		this.setToken = (accessToken) => {
			this.defaultOptions.headers[
				"Authorization"
			] = `Bearer ${accessToken}`;
		};
		this.getOptions = () => {
			return { ...this.defaultOptions };
		};
		this.api = new APIRouter(getAPIBaseURL());
		this.defaultOptions = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		this.handleError = (error) => {
			console.error(`API Call failed: ${error}`, error);
			handleError(error);
		};
	}
}
export class AuthAPIClient extends CoreAPIClient {
	constructor() {
		super(...arguments);
		this.authenticate = (email, password, handler) => {
			const url = this.api.urlFor("/api/v1/auth/");
			axios
				.post(
					url,
					{ email, password, scope: "admin" },
					this.getOptions()
				)
				.then((response) => {
					console.log("response", response);
					return response.data;
				})
				.catch(this.handleError)
				.then(handler);
		};
	}
}
export class BaseAPIClient extends CoreAPIClient {
	constructor(handleError, token) {
		super(handleError);
		this.api = new APIRouter(getAPIBaseURL());
		this.defaultOptions = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};
	}
}
export class DictionaryAPIClient extends BaseAPIClient {
	constructor() {
		super(...arguments);
		this.listDefinitions = (handler) => {
			const url = this.api.urlFor("/api/v1/dict/definitions");
			axios
				.get(url, this.getOptions())
				.then((response) => {
					return response.data;
				})
				.catch(this.handleError)
				.then(handler);
		};
		this.searchDefinition = (term, handler) => {
			const url = this.api.urlFor("/api/v1/dict/definitions");
			axios
				.post(url, { term: term }, this.getOptions())
				.then((response) => {
					return response.data;
				})
				.catch(this.handleError)
				.then(handler);
		};
		this.deleteDefinition = (term, handler) => {
			const url = this.api.urlFor(`/api/v1/dict/term/${term}`);
			axios
				.delete(url, this.getOptions())
				.then((response) => {
					return response.data;
				})
				.catch(this.handleError)
				.then(handler);
		};
	}
}
export class AdminAPIClient extends BaseAPIClient {
	constructor() {
		super(...arguments);
		this.listUsers = (handler) => {
			const url = this.api.urlFor("/api/v1/users/");
			axios
				.get(url, this.getOptions())
				.then((response) => {
					return response.data;
				})
				.catch(this.handleError)
				.then(handler);
		};
		this.searchUser = (email, handler) => {
			const url = this.api.urlFor(
				`/api/v1/users/by-email/?email=${email}`
			);
			axios
				.get(url, this.getOptions())
				.then((response) => {
					return response.data;
				})
				.catch(this.handleError)
				.then(handler);
		};
		this.deleteUser = (id, handler) => {
			const url = this.api.urlFor(`/api/v1/users/${id}/`);
			axios
				.delete(url, this.getOptions())
				.then((response) => {
					return response.data;
				})
				.catch(this.handleError)
				.then(handler);
		};
		this.createUser = (email, password, handler) => {
			const url = this.api.urlFor("/api/v1/users/");
			axios
				.post(url, { email, password }, this.getOptions())
				.then((response) => {
					return response.data;
				})
				.catch(this.handleError)
				.then(handler);
		};
	}
}
