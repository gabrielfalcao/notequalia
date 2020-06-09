import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { v5 as uuidv5 } from "uuid"; // For version 5

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
import { DEFAULT_MARKDOWN } from "../constants";
import { NotePropTypes, NoteProps } from "../domain/notes";
import { Markdown } from "../markdown";

const NoteEditorPropTypes = {
    saveNote: PropTypes.func,
    auth: AuthPropTypes,
    note: NotePropTypes
};

type NoteEditorProps =
    | InferProps<typeof NoteEditorPropTypes>
    | RouteComponentProps
    | any;
type NoteEditorState = NoteProps;

class NoteEditor extends Component<NoteEditorProps, NoteEditorState> {
    constructor(props: any) {
        super(props);

        this.state = { markdown: DEFAULT_MARKDOWN };
    }
    static propTypes = {
        auth: AuthPropTypes,
        note: NotePropTypes
    };
    static defaultProps: NoteEditorProps = {
        note: {
            name: "First Note",
            markdownContent: DEFAULT_MARKDOWN,
            metadata: { uri_id: "https://data.visualcu.es/johndoe/first-note" }
        }
    };

    componentDidMount() {
        const { note }: any = this.props;

        if (note && typeof note.markdown === "string") {
            if (note.markdown !== this.state.markdown) {
                this.setState({
                    markdown: note.markdown
                });
            }
        }
    }
    render() {
        const { note, saveNote }: NoteEditorProps = this.props;

        const content = note.markdown || this.state.markdown;

        return (
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <Button
                            onClick={() => {
                                const markdown = new Markdown(
                                    this.state.markdown
                                );
                                note.metadata = {
                                    ...note.metadata,
                                    ...markdown.attributes
                                };
                                if (!note.id) {
                                    note.id = uuidv5(
                                        note.metadata.title,
                                        uuidv5.DNS
                                    );
                                }

                                saveNote({
                                    ...note,
                                    markdown: this.state.markdown
                                });
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

                    <Preview
                        theme={"light"}
                        markdownContent={this.state.markdown}
                    />
                </Row>
            </Container>
        );
    }
}

export default connect<NoteEditorProps>(
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
)(NoteEditor);
