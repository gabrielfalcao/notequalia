import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import { withRouter } from "react-router";

import { RouteComponentProps } from "react-router-dom";
import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
// import ListGroup from "react-bootstrap/ListGroup";
// import ProgressBar from "react-bootstrap/ProgressBar";
// import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
// import { ComponentWithStore } from "../ui";
import { AuthPropTypes } from "../domain/auth";
import Editor from "../components/Editor";
import Preview from "../components/Preview";

import { NoteProps } from "../domain/notes";
import { Markdown } from "../markdown";
import { NotesReducerState } from "../reducers/types";
import Error from "../components/Error";

const NoteEditorPropTypes = {
    saveNote: PropTypes.func,
    auth: AuthPropTypes
};
type MatchParams = {
    noteID: string;
};

type NoteEditorProps =
    | (RouteComponentProps<MatchParams> & {
        notes: NotesReducerState;
    } & InferProps<typeof NoteEditorPropTypes>)
    | any;
type NoteEditorState = NoteProps;

class NoteEditor extends Component<NoteEditorProps, NoteEditorState> {
    constructor(props: NoteEditorProps) {
        super(props);
        const { notes, match }: NoteEditorProps = this.props;
        const { noteID } = match.params;
        const note: NoteProps = notes.by_id[noteID];

        this.state = {
            markdown: note.markdown
        };
    }

    render() {
        const { notes, match, saveNote, history }: NoteEditorProps = this.props;
        if (!match) {
            return <Error message="failed to parse note id from url" />;
        }
        const { noteID } = match.params;
        const note: NoteProps = notes.by_id[noteID];

        const content = this.state.markdown;

        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <Button
                            variant="info"
                            onClick={() => {
                                const markdown = new Markdown(content);
                                note.metadata = markdown.attributes;
                                // console.log(
                                //     "state.markdown",
                                //     this.state.markdown
                                // );
                                // console.log("note.markdown", note.markdown);
                                saveNote({
                                    ...note,
                                    markdown: content
                                });
                                history.push("/");
                            }}
                        >
                            Save
						</Button>
                    </Col>
                </Row>

                <Row>
                    <Editor
                        theme="light"
                        markdownContent={content}
                        setMarkdownContent={md => {
                            this.setState({ markdown: md });
                        }}
                    />

                    <Preview theme={"light"} markdownContent={content} />
                </Row>
            </Container>
        );
    }
}

export default withRouter(
    connect<NoteEditorProps>(
        state => {
            return { ...state };
        },
        {
            saveNote: function(note: any) {
                return {
                    type: "SAVE_NOTE",
                    note
                };
            }
        }
    )(NoteEditor)
);
