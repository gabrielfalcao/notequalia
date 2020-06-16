import React, { Component } from "react";

import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import Table from "react-bootstrap/Table";
// import Alert from "react-bootstrap/Alert";

// import { LinkContainer } from "react-router-bootstrap";

import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";
import { AuthPropTypes } from "../domain/auth";

import { TermPropTypes, TermProps } from "../domain/terms";
import { TermsReducerState } from "../reducers/types";
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
type TermListState = {};

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
                            {
                                //     <th>Synonyms</th>
                                // <th>Antonyms</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {all.map((term: TermProps, index: number) => {
                            const meta: any = JSON.parse(term.content);
                            const { pydictionary } = meta;

                            if (!pydictionary) {
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
                                                                        .meaning[
                                                                    key
                                                                    ];
                                                                return (
                                                                    <ListGroup.Item
                                                                        key={`${index}`}
                                                                    >
                                                                        <h4>
                                                                            {
                                                                                key
                                                                            }
                                                                        </h4>
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

export default connect<TermListProps>(
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
)(TermList);
