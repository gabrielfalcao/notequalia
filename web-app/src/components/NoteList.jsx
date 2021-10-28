import React, { Component } from "react";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { AuthPropTypes } from "../domain/auth";
import { NotePropTypes } from "../domain/notes";
const NoteListPropTypes = {
	auth: AuthPropTypes,
};
class NoteList extends Component {
	propTypes = NoteListPropTypes;
	componentDidMount() {}
	render() {
		const { notes } = this.props;
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
					{all.map((note, index) => (
						<tr key={`${index}`}>
							<td>{note.id}</td>
							<td>{note.metadata.title}</td>
							<td>
								<LinkContainer to={`/notes/edit/${note.id}`}>
									<Button variant="info">Edit</Button>
								</LinkContainer>{" "}
								<LinkContainer to={`/notes/delete/${note.id}`}>
									<Button variant="danger">Delete</Button>
								</LinkContainer>{" "}
								<LinkContainer to={`/notes/view/${note.id}`}>
									<Button variant="primary">View</Button>
								</LinkContainer>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		);
	}
}
NoteList.propTypes = {
	auth: AuthPropTypes,
	note: NotePropTypes,
};
export default connect((state) => {
	return { ...state };
}, {})(NoteList);
