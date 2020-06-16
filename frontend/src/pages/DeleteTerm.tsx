import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";
// import ListGroup from "react-bootstrap/ListGroup";
// import ProgressBar from "react-bootstrap/ProgressBar";
// import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
// import { ComponentWithStore } from "../ui";
import { AuthPropTypes } from "../domain/auth";
import { TermProps } from "../domain/terms";
import { TermsReducerState, TermListState } from "../reducers/types";

import Error from "../components/Error";
import { DictionaryAPIClient } from "../networking";

const DeleteTermPropTypes = {
    addError: PropTypes.func,
    addTerms: PropTypes.func,
    auth: AuthPropTypes
};

type MatchParams = {
    termID: string;
};

type DeleteTermProps =
    | (RouteComponentProps<MatchParams> & {
        terms: TermsReducerState;
    } & InferProps<typeof DeleteTermPropTypes>)
    | any;

class DeleteTerm extends Component<DeleteTermProps, TermsReducerState> {
    private api: DictionaryAPIClient;
    constructor(props: DeleteTermProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
    }

    render() {
        const { terms, match, deleteTerm }: DeleteTermProps = this.props;

        if (!match) {
            return <Error message="failed to parse term id from url" />;
        }
        const { termID } = match.params;
        const term: TermProps = terms.by_term[termID];

        console.log("DeleteTerm", terms.by_term);
        if (!term) {
            return <pre>{JSON.stringify(terms, null, 4)}</pre>;
        }
        return (
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Confirm Term Deletion</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                Are you sure you want to delete the term "
								{term.term}"?
							</Modal.Body>

                            <Modal.Footer>
                                <Button
                                    onClick={() => {
                                        deleteTerm(term);
                                    }}
                                    variant="danger"
                                >
                                    Yes, delete it
								</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect<DeleteTermProps>(
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
)(DeleteTerm);
