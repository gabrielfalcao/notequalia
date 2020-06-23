import React, { Component, RefObject } from "react";
import { connect } from "react-redux";
import PropTypes, { InferProps } from "prop-types";
import { HotKeys, configure } from "react-hotkeys";

import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import ReactMediumEditor from "./ReactMediumEditor";
import { MediumEditor } from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/bootstrap.css";

const EvergreenNotePropTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    content: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element)
};

type EvergreenNoteProps = InferProps<typeof EvergreenNotePropTypes>;
type EvergreenNoteState = {
    title: string;
    newTitle: string;
    text: string;

    showToastSaveNote: boolean;
};
configure({
    ignoreEventsCondition: (event: KeyboardEvent) => {
        return false;
    }
});

class EvergreenNote extends Component<EvergreenNoteProps, EvergreenNoteState> {
    static propTypes = EvergreenNotePropTypes;
    private keyMap = {
        SAVE_NOTE: "command+s"
    };
    private keyBindings: any;
    private titleRef: RefObject<HTMLHeadingElement> = React.createRef();

    constructor(props: EvergreenNoteProps) {
        super(props);
        this.state = {
            showToastSaveNote: false,
            title: props.title,
            newTitle: props.title,
            text: props.text
        };
        this.keyBindings = {
            SAVE_NOTE: this.saveNote
        };
    }
    private saveNote = (e: KeyboardEvent): void => {
        const { newTitle } = this.state;
        e.preventDefault();

        this.setState({ showToastSaveNote: true, title: newTitle });
    };
    private onEditNote = (text: string, medium: MediumEditor) => {
        this.setState({ text: text });
    };
    private onEditTitle = (event: any) => {
        this.setState({ newTitle: this.titleRef.current.innerText });
    };

    render() {
        const { title } = this.state;
        return (
            <Col md={5} lg={4}>
                <HotKeys
                    keyMap={this.keyMap}
                    handlers={this.keyBindings}
                    className="mt-3 border-right"
                    style={{ height: "100%", position: "relative" }}
                >
                    <h1
                        contentEditable
                        onKeyDown={this.onEditTitle}
                        ref={this.titleRef}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    <ReactMediumEditor
                        tag="article"
                        text={this.state.text}
                        onChange={this.onEditNote}
                    />
                </HotKeys>
                <Toast
                    show={this.state.showToastSaveNote}
                    delay={2000}
                    onClose={() => {
                        this.setState({ showToastSaveNote: false });
                    }}
                    autohide
                >
                    <Toast.Header>
                        <strong className="mr-auto">Saving {title}</strong>
                        <small>saving note</small>
                    </Toast.Header>
                    <Toast.Body
                        dangerouslySetInnerHTML={{ __html: this.state.text }}
                    />
                </Toast>
            </Col>
        );
    }
}
export default connect(state => {
    return { ...state };
}, {})(EvergreenNote);
