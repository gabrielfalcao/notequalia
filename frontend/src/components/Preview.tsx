import React from "react";
import PropTypes from "prop-types";
import marked from "marked";
import Col from "react-bootstrap/Col";
//import "bootswatch/dist/journal/bootstrap.min.css";

interface Props {
    markdownContent: string;
    theme: string;
}

const Preview: React.FC<Props> = ({ markdownContent, theme }) => {
    const markdown = markdownContent || "> Empty note";
    const mardownFormattedContent = marked(markdown);

    return (
        <Col id="preview">
            <main
                dangerouslySetInnerHTML={{ __html: mardownFormattedContent }}
            ></main>
        </Col>
    );
};

Preview.propTypes = {
    markdownContent: PropTypes.string.isRequired
};

export default Preview;
