import React, { Component } from "react";
import { InferProps } from "prop-types";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import { AuthPropTypes } from "../domain/auth";

import { NotePropTypes, NoteProps } from "../domain/notes";
import { NotesReducerState } from "../reducers/types";

const NoteListPropTypes = {
    auth: AuthPropTypes
};

type NoteListProps =
    | (InferProps<typeof NoteListPropTypes> & { notes: NotesReducerState })
    | any;
type NoteListState = NoteProps;

class NoteList extends Component<NoteListProps, NoteListState> {
    static propTypes = {
        auth: AuthPropTypes,
        note: NotePropTypes
    };

    componentDidMount() { }
    render() {
        const { notes }: NoteListProps = this.props;
        const { all } = notes;

        if (!notes || !all) {
            return (
                <Alert variant="info" className="text-center">
                    Empty
                </Alert>
            );
        }
        return (
            <Table responsive bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {all.map((note: NoteProps, index: number) => (
                        <tr key={`${index}`}>
                            <td>{note.id}</td>
                            <td>{note.metadata.title}</td>
                            <td>
                                <LinkContainer to={`/notes/edit/${note.id}`}>
                                    <Button variant="info">Edit</Button>
                                </LinkContainer>
                                <LinkContainer to={`/notes/delete/${note.id}`}>
                                    <Button variant="danger">Delete</Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }
}

export default connect<NoteListProps>(state => {
    return { ...state };
}, {})(NoteList);
