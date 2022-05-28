import marked from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

import extractor, { FrontMatterResult } from "front-matter";

export type FrontMatterAttributes =
    | {
        id: string;
        parent_id: string | null;
        title: string;
        created_at: string;
    }
    | any
    | null;

export class Markdown {
    public original: string;
    private parsed: FrontMatterResult<FrontMatterAttributes>;
    private _err: Error | null;

    constructor(markdownContent: string) {
        this.original = markdownContent.replace(/^\n*/, "");
        try {
            this.parsed = extractor(this.original);
            this._err = null;
        } catch (e) {
            this._err = e;
            this.parsed = null;
        }
        marked.setOptions({
            highlight: function(code) {
                return hljs.highlightAuto(code).value;
            }
        });
    }
    public toHTML(): string {
        if (this.parsed) {
            return marked(this.parsed.body);
        }
        return marked(this.original);
    }

    public get error(): string | null {
        return this.error;
    }
    public get attributes(): FrontMatterAttributes {
        return this.parsed.attributes;
    }
}
