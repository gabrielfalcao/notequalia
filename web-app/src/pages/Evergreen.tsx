import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { LoremIpsum } from "lorem-ipsum";
// import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";

import { needs_login, AuthPropTypes } from "../domain/auth";
import EvergreenTopBar from "../components/EvergreenTopBar";
import EvergreenNote from "../components/EvergreenNote";

const EvergreenPropTypes = {
    auth: AuthPropTypes,
    notebookId: PropTypes.string
};

type EvergreenProps = InferProps<typeof EvergreenPropTypes>;
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

class Evergreen extends Component<EvergreenProps> {
    static propTypes = EvergreenPropTypes;

    constructor(props: EvergreenProps) {
        super(props);
        this.state = {};
    }
    render() {
        const { auth } = this.props;
        if (needs_login(auth)) {
            return <Redirect to="/" />;
        }
        return (
            <Container fluid>
                <EvergreenTopBar />
                <Row className="mt-3" style={{ minHeight: "100vh" }}>
                    <EvergreenNote
                        title={"Notes should be linkable"}
                        text={`<p>...</p>`}
                    />
                    <EvergreenNote
                        title={"Second-level note"}
                        text={`<p>${lorem.generateParagraphs(1)}</p>`}
                    />
                </Row>
            </Container>
        );
    }
}
export default connect(state => {
    return { ...state };
}, {})(Evergreen);
