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
import {
    AuthProps
    //, Scope
} from "../auth";
import Editor from "../components/Editor";
import Preview from "../components/Preview";

const DEFAULT_MARKDOWN = `
# H1
## H2
### H3
#### H4
##### H5

__bold__
**bold**
_italic_
`;

type Note =
    | {
        name: string;
        markdown: string;
        metadata: any;
    }
    | any;

type NoteManagerProps =
    | {
        auth: AuthProps | any;
        note: Note | any;
    }
    | any;
interface NoteManagerActionProps {
    saveNote: () => void;
}
class NoteManager extends Component<NoteManagerProps, Note> {
    constructor(props: any) {
        super(props);

        this.state = { markdown: DEFAULT_MARKDOWN };
    }
    static propTypes = {
        auth: PropTypes.shape({
            access_token: PropTypes.string,
            scope: PropTypes.string
        }),
        note: PropTypes.shape({
            name: PropTypes.string,
            markdown: PropTypes.string,
            metadata: PropTypes.shape({
                uri_id: PropTypes.string
            })
        })
    };
    static defaultProps:
        | InferProps<typeof NoteManager.propTypes>
        | NoteManagerProps
        | NoteManagerActionProps
        | any = {
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
            <Container fluid="md">
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

export default connect<NoteManagerProps & NoteManagerActionProps>(
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
