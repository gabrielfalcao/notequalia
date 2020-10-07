import React, { Component, RefObject } from "react";
import PropTypes, { InferProps } from "prop-types";
import MediumEditor from "medium-editor";

const DEFAULT_BUTTONS = [
    "bold",
    "italic",
    "strikethrough",
    "underline",
    "anchor",
    "h1",
    "h2",
    "h3",
    "h4",
    "reference",
    "removeFormat"
];

const ReferenceButton = MediumEditor.Extension.extend({
    name: "reference",
    tagNames: ["a"],

    init: function() {
        this.button = document.createElement("button");
        this.button.classList.add("medium-editor-action");
        this.button.innerHTML = `<i class="fa fa-sticky-note"></i>`;
        this.button.title = "Link to note";
        this.on(this.button, "click", this.onClick.bind(this));
    },
    addReference: function(opts: any) {
        let currentEditor = MediumEditor.selection.getSelectionElement(
            this.window
        ),
            targetUrl;

        // Make sure the selection is within an element this editor is tracking
        let currentSelection = this.window.getSelection();
        let selectedText = currentSelection.toString();

        targetUrl = `#notebook/1/${selectedText}`;
        if (currentSelection) {
            var currRange = currentSelection.getRangeAt(0),
                commonAncestorContainer = currRange.commonAncestorContainer,
                exportedSelection,
                startContainerParentElement,
                endContainerParentElement,
                textNodes;

            // If the selection is contained within a single text node
            // and the selection starts at the beginning of the text node,
            // MSIE still says the startContainer is the parent of the text node.
            // If the selection is contained within a single text node, we
            // want to just use the default browser 'createLink', so we need
            // to account for this case and adjust the commonAncestorContainer accordingly
            if (
                currRange.endContainer.nodeType === 3 &&
                currRange.startContainer.nodeType !== 3 &&
                currRange.startOffset === 0 &&
                currRange.startContainer.firstChild === currRange.endContainer
            ) {
                commonAncestorContainer = currRange.endContainer;
            }

            startContainerParentElement = MediumEditor.util.getClosestBlockContainer(
                currRange.startContainer
            );
            endContainerParentElement = MediumEditor.util.getClosestBlockContainer(
                currRange.endContainer
            );

            // If the selection is not contained within a single text node
            // but the selection is contained within the same block element
            // we want to make sure we create a single link, and not multiple links
            // which can happen with the built in browser functionality
            if (
                commonAncestorContainer.nodeType !== 3 &&
                commonAncestorContainer.textContent.length !== 0 &&
                startContainerParentElement === endContainerParentElement
            ) {
                var parentElement =
                    startContainerParentElement || currentEditor,
                    fragment = this.document.createDocumentFragment();

                // since we are going to create a link from an extracted text,
                // be sure that if we are updating a link, we won't let an empty link behind (see #754)
                // (Workaroung for Chrome)
                this.execAction("unlink");

                exportedSelection = this.exportSelection();
                fragment.appendChild(parentElement.cloneNode(true));

                if (currentEditor === parentElement) {
                    // We have to avoid the editor itself being wiped out when it's the only block element,
                    // as our reference inside this.elements gets detached from the page when insertHTML runs.
                    // If we just use [parentElement, 0] and [parentElement, parentElement.childNodes.length]
                    // as the range boundaries, this happens whenever parentElement === currentEditor.
                    // The tradeoff to this workaround is that a orphaned tag can sometimes be left behind at
                    // the end of the editor's content.
                    // In Gecko:
                    // as an empty <strong></strong> if parentElement.lastChild is a <strong> tag.
                    // In WebKit:
                    // an invented <br /> tag at the end in the same situation
                    MediumEditor.selection.select(
                        this.document,
                        parentElement.firstChild,
                        0,
                        parentElement.lastChild,
                        parentElement.lastChild.nodeType === 3
                            ? parentElement.lastChild.nodeValue.length
                            : parentElement.lastChild.childNodes.length
                    );
                } else {
                    MediumEditor.selection.select(
                        this.document,
                        parentElement,
                        0,
                        parentElement,
                        parentElement.childNodes.length
                    );
                }

                var modifiedExportedSelection = this.exportSelection();

                textNodes = MediumEditor.util.findOrCreateMatchingTextNodes(
                    this.document,
                    fragment,
                    {
                        start:
                            exportedSelection.start -
                            modifiedExportedSelection.start,
                        end:
                            exportedSelection.end -
                            modifiedExportedSelection.start,
                        editableElementIndex:
                            exportedSelection.editableElementIndex
                    }
                );
                // If textNodes are not present, when changing link on images
                // ex: <a><img src="http://image.test.com"></a>, change fragment to currRange.startContainer
                // and set textNodes array to [imageElement, imageElement]
                if (textNodes.length === 0) {
                    fragment = this.document.createDocumentFragment();
                    fragment.appendChild(
                        commonAncestorContainer.cloneNode(true)
                    );
                    textNodes = [
                        fragment.firstChild.firstChild,
                        fragment.firstChild.lastChild
                    ];
                }

                // Creates the link in the document fragment
                MediumEditor.util.createLink(
                    this.document,
                    textNodes,
                    targetUrl.trim()
                );

                // Chrome trims the leading whitespaces when inserting HTML, which messes up restoring the selection.
                var leadingWhitespacesCount = (fragment.firstChild.innerHTML.match(
                    /^\s+/
                ) || [""])[0].length;

                // Now move the created link back into the original document in a way to preserve undo/redo history
                MediumEditor.util.insertHTMLCommand(
                    this.document,
                    fragment.firstChild.innerHTML.replace(/^\s+/, "")
                );
                exportedSelection.start -= leadingWhitespacesCount;
                exportedSelection.end -= leadingWhitespacesCount;

                this.importSelection(exportedSelection);
            } else {
                this.document.execCommand("createLink", false, targetUrl);
            }

            MediumEditor.util.removeTargetBlank(
                MediumEditor.selection.getSelectionStart(this.document),
                targetUrl
            );

            if (opts.buttonClass) {
                MediumEditor.util.addClassToAnchors(
                    MediumEditor.selection.getSelectionStart(this.document),
                    opts.buttonClass
                );
            }
        }
    },
    onClick: function(event: MouseEvent) {
        // const sel = this.window.getSelection();
        // const range = sel.getRangeAt(0);
        // const content = this.base.getSelectedElements(this.document);
        // const content = this.base.getSelectedParentElement(range).textContent;
        this.addReference.bind(this)({
            value: "#notes/"
        });
    },
    isAlreadyApplied: function(node: Element) {
        return node.tagName === "a" || node.tagName === "code";
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
                allowMultiParagraphSelection: false,
                standardizeSelectionStart: true,
                buttons: DEFAULT_BUTTONS
            },
            extensions: {
                reference: new ReferenceButton(),
                placeholder: {}
            }
        });
        this.medium.subscribe("editableInput", (e: Event) => {
            setUpdated(true);
            this.change(editor.current.innerHTML);
        });
    }

    componentDidUpdate() {
        this.medium.restoreSelection();
    }

    componentWillUnmount() {
        if (this.medium) {
            this.medium.destroy();
        }
    }

    componentWillReceiveProps(nextProps: any) {
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
            style={{zIndex:424242}}             
                dangerouslySetInnerHTML={{ __html: this.state.text }}
            />
        );
    }

    change = (text: string) => {
        if (this.props.onChange) this.props.onChange(text, this.medium);
    };
}
