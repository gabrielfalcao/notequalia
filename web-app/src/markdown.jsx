import marked from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import extractor from "front-matter";
export class Markdown {
	constructor(markdownContent) {
		this.original = markdownContent.replace(/^\n*/, "");
		try {
			this.parsed = extractor(this.original);
			this._err = null;
		} catch (e) {
			this._err = e;
			this.parsed = null;
		}
		marked.setOptions({
			highlight: function (code) {
				return hljs.highlightAuto(code).value;
			},
		});
	}
	toHTML() {
		if (this.parsed) {
			return marked(this.parsed.body);
		}
		return marked(this.original);
	}
	get error() {
		return this.error;
	}
	get attributes() {
		return this.parsed.attributes;
	}
}
