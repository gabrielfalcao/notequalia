import React, { ChangeEvent } from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

interface Props {
    markdownContent: string;
    setMarkdownContent: (value: string) => void;
    theme: string;
}

const Editor: React.FC<Props> = ({
    markdownContent,
    setMarkdownContent,
    theme
}) => {
    return (
        <Col id="editor">
            <Form.Control
                as="textarea"
                rows={20}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setMarkdownContent(e.target.value)
                }
                defaultValue={markdownContent}
            />
        </Col>
    );
};

Editor.propTypes = {
    markdownContent: PropTypes.string.isRequired,
    setMarkdownContent: PropTypes.func.isRequired
};

export default Editor;
