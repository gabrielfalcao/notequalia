import React, { Component } from "react";

import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import Table from "react-bootstrap/Table";
import { withRouter } from "react-router";
// import Alert from "react-bootstrap/Alert";

import { LinkContainer } from "react-router-bootstrap";

import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";
import { AuthPropTypes } from "../domain/auth";

import { TermPropTypes, TermProps } from "../domain/terms";
import { TermsReducerState, TermListState } from "../reducers/types";
import { DictionaryAPIClient } from "../networking";

// const x = { FormControl< "input" >}
const TermListPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addTerms: PropTypes.func
};

type TermListProps =
    | (InferProps<typeof TermListPropTypes> & { terms: TermsReducerState })
    | any;

class TermList extends Component<TermListProps, TermListState> {
    private api: DictionaryAPIClient;
    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    constructor(props: TermListProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
    }

    public fetchDefinitions = () => {
        const { addTerms }: TermListProps = this.props;

        this.api.listDefinitions(addTerms);
    };

    componentDidMount() { }
    render() {
        const { terms }: TermListProps = this.props;
        const { by_term } = terms;
        const { fetchDefinitions } = this;
        const all: TermProps[] = Object.values(by_term);
        return (
            <React.Fragment>
                <Table responsive bordered hover>
                    <thead>
                        <tr>
                            <th>Term</th>
                            <th>Meaning</th>
                            <th>Action</th>
                            {
                                //     <th>Synonyms</th>
                                // <th>Antonyms</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {all.map((term: TermProps, index: number) => {
                            const meta: any = term.content;
                            const {
                                pydictionary,
                                collegiate,
                                thesaurus
                            } = meta;

                            if (!pydictionary && !collegiate && !thesaurus) {
                                return null;
                            }

                            return (
                                <tr key={`${index}`}>
                                    <td>
                                        <h3>{term.term}</h3>
                                    </td>
                                    {pydictionary ? (
                                        <React.Fragment>
                                            <td>
                                                <pre>
                                                    {JSON.stringify(
                                                        pydictionary,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                                <pre>
                                                    {JSON.stringify(
                                                        thesaurus,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                                <pre>
                                                    {JSON.stringify(
                                                        collegiate,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </td>
                                            <td>
                                                <LinkContainer
                                                    to={`/terms/delete/${term.term}`}
                                                >
                                                    <Button variant="danger">
                                                        Delete{""}
                                                    </Button>
                                                </LinkContainer>
                                                <LinkContainer
                                                    to={`/terms/view/${term.term}`}
                                                >
                                                    <Button variant="primary">
                                                        View{""}
                                                    </Button>
                                                </LinkContainer>
                                            </td>
                                            {
                                                // <td>
                                                //     {pydictionary.synonym || ""}
                                                // </td>
                                                // <td>
                                                //     {pydictionary.antonym || ""}
                                                // </td>
                                            }
                                        </React.Fragment>
                                    ) : (
                                            <React.Fragment>
                                                <td>UNDEFINED</td>
                                            </React.Fragment>
                                        )}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <Button
                    onClick={() => {
                        fetchDefinitions();
                    }}
                    variant="success"
                >
                    Fetch{""}
                </Button>
            </React.Fragment>
        );
    }
}

export default withRouter(
    connect<TermListProps>(
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
    )(TermList)
);
