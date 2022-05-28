import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

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
import { NoteProps } from "../domain/notes";

const NewNotePropTypes = {
    newNote: PropTypes.func,
    auth: AuthPropTypes
};

type NewNoteProps = InferProps<typeof NewNotePropTypes> | any;
type NewNoteState = NoteProps;

class NewNote extends Component<NewNoteProps, NewNoteState> {
    constructor(props: any) {
        super(props);

        this.state = { markdown: DEFAULT_MARKDOWN };
    }
    static propTypes = {
        auth: AuthPropTypes
    };
    static defaultProps: NewNoteProps = {};

    render() {
        const { newNote, history }: NewNoteProps = this.props;

        const markdown = this.state.markdown;
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <Button
                            variant="success"
                            onClick={() => {
                                newNote({
                                    markdown: this.state.markdown
                                });
                                history.push("/");
                            }}
                        >
                            Create
						</Button>
                    </Col>
                </Row>

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
            </Container>
        );
    }
}

export default withRouter(
    connect<NewNoteProps>(
        state => {
            return { ...state, auth: {} };
        },
        {
            newNote: function(note: any) {
                return {
                    type: "NEW_NOTE",
                    ...note
                };
            }
        }
    )(NewNote)
);
