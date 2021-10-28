import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";
// import ListGroup from "react-bootstrap/ListGroup";
// import ProgressBar from "react-bootstrap/ProgressBar";
// import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
// import { ComponentWithStore } from "../ui";
import { AuthPropTypes } from "../domain/auth";
import Error from "../components/Error";
const DeleteNotePropTypes = {
	deleteNote: PropTypes.func,
	auth: AuthPropTypes,
};
class DeleteNote extends Component {
	propTypes = DeleteNotePropTypes;
	render() {
		const { notes, match, deleteNote } = this.props;
		if (!match) {
			return <Error message="failed to parse note id from url" />;
		}
		const { noteID } = match.params;
		const note = notes.by_id[noteID];
		if (!note) {
			return <Redirect to="/" />;
		}
		return (
			<Container fluid>
				<Row>
					<Col md={12}>
						<Modal.Dialog>
							<Modal.Header>
								<Modal.Title>Confirm Note Deletion</Modal.Title>
							</Modal.Header>

							<Modal.Body>
								Are you sure you want to delete the note "
								{note.id}"?
							</Modal.Body>

							<Modal.Footer>
								<Button
									onClick={() => {
										deleteNote(note);
									}}
									variant="danger"
								>
									Yes, delete it
								</Button>
							</Modal.Footer>
						</Modal.Dialog>
					</Col>
				</Row>
			</Container>
		);
	}
}
export default withRouter(
	connect(
		(state) => {
			return { ...state };
		},
		{
			deleteNote: function (note) {
				return {
					type: "DELETE_NOTE",
					note,
				};
			},
		}
	)(DeleteNote)
);
