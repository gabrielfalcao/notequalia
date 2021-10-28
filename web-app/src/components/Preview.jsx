import React from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import { Markdown } from "../markdown";
const Preview = ({ markdownContent, theme }) => {
	const content = markdownContent || "> Empty note";
	const markdown = new Markdown(content);
	return (
		<Col id="preview">
			<main
				dangerouslySetInnerHTML={{ __html: markdown.toHTML() }}
			></main>
		</Col>
	);
};
Preview.propTypes = {
	markdownContent: PropTypes.string.isRequired,
};
export default Preview;
