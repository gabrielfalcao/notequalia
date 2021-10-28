import React, { Component } from "react";
import PropTypes from "prop-types";
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
import { Markdown } from "../markdown";
import Error from "../components/Error";
const NoteEditorPropTypes = {
	saveNote: PropTypes.func,
	auth: AuthPropTypes,
};
class NoteEditor extends Component {
	propTypes = NoteEditorPropTypes;
	constructor(props) {
		super(props);
		const { notes, match } = this.props;
		const { noteID } = match.params;
		const note = notes.by_id[noteID];
		this.state = {
			markdown: note.markdown,
		};
	}
	render() {
		const { notes, match, saveNote, history } = this.props;
		if (!match) {
			return <Error message="failed to parse note id from url" />;
		}
		const { noteID } = match.params;
		const note = notes.by_id[noteID];
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
									markdown: content,
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
						setMarkdownContent={(md) => {
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
	connect(
		(state) => {
			return { ...state };
		},
		{
			saveNote: function (note) {
				return {
					type: "SAVE_NOTE",
					note,
				};
			},
		}
	)(NoteEditor)
);
