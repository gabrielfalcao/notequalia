import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
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
import Error from "../components/Error";
const NoteViewPropTypes = {
	auth: AuthPropTypes,
};
class NoteView extends Component {
	propTypes = NoteViewPropTypes;
	render() {
		const { notes, match } = this.props;
		if (!match) {
			return <Error message="failed to parse note id from url" />;
		}
		const { noteID } = match.params;
		const note = notes.by_id[noteID];
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
	connect((state) => {
		return { ...state };
	}, {})(NoteView)
);
