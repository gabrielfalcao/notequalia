import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

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
import { AuthPropTypes } from "../auth";
import Editor from "../components/Editor";
import Preview from "../components/Preview";
import { DEFAULT_MARKDOWN } from "../constants";

const NotePropTypes = PropTypes.shape({
    name: PropTypes.string,
    markdown: PropTypes.string,
    metadata: PropTypes.oneOf([
        PropTypes.shape({
            uri_id: PropTypes.string
        }),
        PropTypes.any
    ])
});
const NoteManagerPropTypes = {
    saveNote: PropTypes.func,
    auth: AuthPropTypes,
    note: NotePropTypes
};

type NoteProps = InferProps<typeof NotePropTypes> | any;
type NoteManagerProps = InferProps<typeof NoteManagerPropTypes> | any;

class NoteManager extends Component<NoteManagerProps, NoteProps> {
    constructor(props: any) {
        super(props);

        this.state = { markdown: DEFAULT_MARKDOWN };
    }
    static propTypes = {
        auth: AuthPropTypes,
        note: NotePropTypes
    };
    static defaultProps: NoteManagerProps = {
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
        const {
            // auth,
            note,
            saveNote
        }: any = this.props;

        const markdown = note.markdown || this.state.markdown;
        return (
            <Container fluid>
                <Row>
                    <Editor
                        theme="light"
                        markdownContent={markdown}
                        setMarkdownContent={markdown => {
                            this.setState({ markdown: markdown });
                        }}
                    />

                    <Preview
                        theme={"light"}
                        markdownContent={this.state.markdown}
                    />
                </Row>
                <Row>
                    <Col md={12}>
                        <Button
                            onClick={() => {
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
            </Container>
        );
    }
}

export default connect<NoteManagerProps>(
    state => {
        return { ...state, auth: {} };
    },
    {
        saveNote: function(note: any) {
            return {
                type: "SAVE_NOTE",
                note
            };
        }
    }
)(NoteManager);
