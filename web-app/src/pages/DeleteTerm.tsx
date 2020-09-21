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
import { TermsReducerState } from "../reducers/types";

import Error from "../components/Error";
import { DictionaryAPIClient } from "../networking";

const DeleteTermPropTypes = {
    addError: PropTypes.func,
    deleteTerm: PropTypes.func,
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
        this.api = new DictionaryAPIClient(
            addError,
            props.auth.access_token.content
        );
    }

    deleteTerm = (term: string) => {
        const { deleteTerm }: DeleteTermProps = this.props;
        this.api.deleteDefinition(term, (term: TermProps) => {
            deleteTerm(term.term);
        });
    };
    render() {
        const { terms, match }: DeleteTermProps = this.props;
        const { deleteTerm } = this;

        if (!match) {
            return <Error message="failed to parse term name from url" />;
        }
        const { termID } = match.params;
        const term: TermProps = terms.by_term[termID];

        if (!term) {
            return <Redirect to="/" />;
        }
        console.log("DeleteTerm", terms.by_term);
        if (!match) {
            return <Error message={JSON.stringify(terms, null, 2)} />;
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
                                        deleteTerm(term.term);
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

export default withRouter(
    connect<DeleteTermProps>(
        state => {
            return { ...state };
        },
        {
            deleteTerm: function(term: string) {
                return {
                    type: "DELETE_TERM",
                    term
                };
            },
            addError: function(error: Error) {
                return {
                    type: "ADD_ERROR",
                    error
                };
            }
        }
    )(DeleteTerm)
);
