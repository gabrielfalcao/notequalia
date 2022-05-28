import React, { Component } from "react";
import { InferProps } from "prop-types";
import { connect } from "react-redux";

import { withRouter } from "react-router";

import { RouteComponentProps } from "react-router-dom";
import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
// import Form from "react-bootstrap/Form";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
// import ListGroup from "react-bootstrap/ListGroup";
// import ProgressBar from "react-bootstrap/ProgressBar";
// import Card from "react-bootstrap/Card";
// import { ComponentWithStore } from "../ui";
import { AuthPropTypes } from "../domain/auth";

import Preview from "../components/Preview";

import { NoteProps } from "../domain/notes";
import { NotesReducerState } from "../reducers/types";
import Error from "../components/Error";

const NoteViewPropTypes = {
    auth: AuthPropTypes
};
type MatchParams = {
    noteID: string;
};

type NoteViewProps =
    | (RouteComponentProps<MatchParams> & {
        notes: NotesReducerState;
    } & InferProps<typeof NoteViewPropTypes>)
    | any;
type NoteViewState = NoteProps;

class NoteView extends Component<NoteViewProps, NoteViewState> {
    render() {
        const { notes, match }: NoteViewProps = this.props;
        if (!match) {
            return <Error message="failed to parse note id from url" />;
        }
        const { noteID } = match.params;
        const note: NoteProps = notes.by_id[noteID];
        const content = note.markdown;

        return (
            <Container>
                <Row>
                    <Preview theme={"light"} markdownContent={content} />
                </Row>
            </Container>
        );
    }
}

export default withRouter(
    connect<NoteViewProps>(state => {
        return { ...state };
    }, {})(NoteView)
);
