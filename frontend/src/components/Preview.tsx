import React from "react";
import PropTypes from "prop-types";
import marked from "marked";
import Col from "react-bootstrap/Col";

interface Props {
    markdownContent: string;
    theme: string;
}

const Preview: React.FC<Props> = ({ markdownContent, theme }) => {
    const markdown = markdownContent || "# Dummy";
    const mardownFormattedContent = marked(markdown);

    return (
        <Col id="preview">
            <h2>Preview</h2>
            <div
                dangerouslySetInnerHTML={{ __html: mardownFormattedContent }}
            ></div>
        </Col>
    );
};

Preview.propTypes = {
    markdownContent: PropTypes.string.isRequired
};

export default Preview;
