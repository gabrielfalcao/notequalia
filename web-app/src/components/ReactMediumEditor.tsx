import React, { Component, RefObject } from "react";
import PropTypes, { InferProps } from "prop-types";

import MediumEditor from "medium-editor";

const ReferenceButton = MediumEditor.Extension.extend({
    name: "reference",
    init: function() {
        this.button = this.document.createElement("button");
        this.button.classList.add("medium-editor-action");
        this.button.innerHTML = "<b>Ref</b>";
    },

    getButton: function() {
        return this.button;
    }
});

const ReactMediumEditorPropTypes = {
    onChange: PropTypes.func,
    options: PropTypes.any,
    refs: PropTypes.objectOf(PropTypes.element),
    tag: PropTypes.string,
    text: PropTypes.string
};

type ReactMediumEditorProps =
    | (InferProps<typeof ReactMediumEditorPropTypes> & HTMLElement)
    | any;

type ReactMediumEditorState = {
    text: string;
};

export default class ReactMediumEditor extends Component<
    ReactMediumEditorProps,
    ReactMediumEditorState
    > {
    static propTypes = ReactMediumEditorPropTypes;
    static defaultProps = {
        tag: "div"
    };
    private medium: MediumEditor.MediumEditor;
    private updated: boolean;
    private editor: RefObject<HTMLElement> = React.createRef();
    constructor(props: ReactMediumEditorProps) {
        super(props);

        this.state = {
            text: props.text
        };
    }

    setUpdated = (value: boolean) => {
        this.updated = value;
    };
    componentDidMount() {
        const { setUpdated, editor } = this;

        this.medium = new MediumEditor(editor.current, {
            ...this.props.options,
            toolbar: {
                buttons: [
                    "bold",
                    "italic",
                    "underline",
                    "anchor",
                    "h2",
                    "h3",
                    "reference"
                ]
            },
            extensions: {
                reference: new ReferenceButton()
            }
        });
        this.medium.subscribe("editableInput", (e: Event) => {
            setUpdated(true);
            this.change(editor.current.innerHTML);
        });
    }

    UNSAFE_componentDidUpdate() {
        this.medium.restoreSelection();
    }

    componentWillUnmount() {
        if (this.medium) {
            this.medium.destroy();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: any) {
        if (nextProps.text !== this.state.text && !this.updated) {
            this.setState({ text: nextProps.text });
        }

        if (this.updated) this.setUpdated(false);
    }

    render() {
        const { editor } = this;

        if (this.medium) {
            this.medium.saveSelection();
        }

        return (
            <article
                ref={editor}
                dangerouslySetInnerHTML={{ __html: this.state.text }}
            />
        );
    }

    change = (text: string) => {
        if (this.props.onChange) this.props.onChange(text, this.medium);
    };
}
