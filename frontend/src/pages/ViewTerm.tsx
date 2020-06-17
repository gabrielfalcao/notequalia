import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
import { LinkContainer } from "react-router-bootstrap";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
// import ListGroup from "react-bootstrap/ListGroup";
// import ProgressBar from "react-bootstrap/ProgressBar";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
// import { ComponentWithStore } from "../ui";
import { AuthPropTypes } from "../domain/auth";
import { TermProps } from "../domain/terms";
import { TermsReducerState, TermListState } from "../reducers/types";
import Error from "../components/Error";
import { DictionaryAPIClient } from "../networking";

const ViewTermPropTypes = {
    addError: PropTypes.func,
    addTerms: PropTypes.func,
    auth: AuthPropTypes
};

type MatchParams = {
    termID: string;
};

type ViewTermProps =
    | (RouteComponentProps<MatchParams> & {
        terms: TermsReducerState;
    } & InferProps<typeof ViewTermPropTypes>)
    | any;

class ViewTerm extends Component<ViewTermProps, any> {
    private api: DictionaryAPIClient;
    constructor(props: ViewTermProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
    }

    render() {
        const { terms, match }: ViewTermProps = this.props;

        if (!match) {
            return <Error message="failed to parse term id from url" />;
        }
        const { termID } = match.params;
        const term: TermProps = terms.by_term[termID];

        if (!term) {
            return <Redirect to="/" />;
        }
        const meta: any = JSON.parse(term.content);

        const { pydictionary } = meta;

        if (!pydictionary) {
            return null;
        }

        return (
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>{term.term}</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                {pydictionary ? (
                                    <React.Fragment>
                                        {pydictionary.meaning ? (
                                            <ListGroup variant="flush">
                                                {Object.keys(
                                                    pydictionary.meaning
                                                ).map(
                                                    (
                                                        key: string,
                                                        index: number
                                                    ) => {
                                                        const values: string[] =
                                                            pydictionary
                                                                .meaning[key];
                                                        return (
                                                            <ListGroup.Item
                                                                key={`${index}`}
                                                            >
                                                                <h4>{key}</h4>
                                                                {values.map(
                                                                    (
                                                                        description,
                                                                        index
                                                                    ) => (
                                                                            <ListGroup.Item
                                                                                key={`${index}`}
                                                                            >
                                                                                <h5>
                                                                                    {
                                                                                        description
                                                                                    }
                                                                                </h5>
                                                                            </ListGroup.Item>
                                                                        )
                                                                )}
                                                            </ListGroup.Item>
                                                        );
                                                    }
                                                )}
                                            </ListGroup>
                                        ) : null}
                                    </React.Fragment>
                                ) : (
                                        <React.Fragment>
                                            <Alert>UNDEFINED</Alert>
                                        </React.Fragment>
                                    )}
                            </Modal.Body>

                            <Modal.Footer>
                                <LinkContainer to={`/`}>
                                    <Button variant="warning">Back{""}</Button>
                                </LinkContainer>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(
    connect<ViewTermProps>(
        state => {
            return { ...state };
        },
        {
            addTerms: function(terms: TermListState[]) {
                return {
                    type: "ADD_TERMS",
                    terms
                };
            },
            addError: function(error: Error) {
                return {
                    type: "ADD_ERROR",
                    error
                };
            }
        }
    )(ViewTerm)
);
