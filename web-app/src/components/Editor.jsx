import React from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
const Editor = ({ markdownContent, setMarkdownContent, theme }) => {
	return (
		<Col id="editor">
			<Form.Control
				as="textarea"
				rows={
					typeof markdownContent === "string"
						? markdownContent.split("\n").length
						: 10
				}
				onChange={(e) => setMarkdownContent(e.target.value)}
				defaultValue={markdownContent}
			/>
		</Col>
	);
};
Editor.propTypes = {
	markdownContent: PropTypes.string.isRequired,
	setMarkdownContent: PropTypes.func.isRequired,
};
export default Editor;
