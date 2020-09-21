import React, { Component } from "react";

import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import Table from "react-bootstrap/Table";
// import Alert from "react-bootstrap/Alert";

import { LinkContainer } from "react-router-bootstrap";

import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";
import { AuthPropTypes } from "../domain/auth";

import { TermPropTypes, TermProps } from "../domain/terms";
import { TermsReducerState, TermListState } from "../reducers/types";
import { DictionaryAPIClient } from "../networking";

// const x = { FormControl< "input" >}
export const TermListPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    hideFunctionalLabels: PropTypes.bool,
    addTerms: PropTypes.func,
    terms: TermPropTypes
};

type TermListProps =
    | (InferProps<typeof TermListPropTypes> & { terms: TermsReducerState })
    | any;

class TermList extends Component<TermListProps, TermListState> {
    private api: DictionaryAPIClient;
    static propTypes = TermListPropTypes;
    constructor(props: TermListProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
        this.api.setToken(props.auth.access_token.content);
        console.log(props);
    }

    public fetchDefinitions = () => {
        const { addTerms }: TermListProps = this.props;

        this.api.listDefinitions(addTerms);
    };

    componentDidMount() { }
    render() {
        const { terms, hideFunctionalLabels }: TermListProps = this.props;
        const { by_term } = terms;
        const { fetchDefinitions } = this;
        const all: TermProps[] = Object.values(by_term);
        const showFunctionalLabels = !hideFunctionalLabels;
        return (
            <React.Fragment>
                <Table responsive bordered hover>
                    <thead>
                        <tr>
                            <th>Term</th>
                            {showFunctionalLabels ? <th>Meaning</th> : null}
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

                            if (typeof meta !== "object") {
                                return (
                                    <tr key={`${index}`}>
                                        <td></td>
                                    </tr>
                                );
                            }
                            const { collegiate, thesaurus } = meta;

                            if (!collegiate && !thesaurus) {
                                return null;
                            }
                            return (
                                <tr key={`${index}`}>
                                    <td>
                                        <LinkContainer
                                            to={`/terms/view/${term.term}`}
                                        >
                                            <h3>{term.term}</h3>
                                        </LinkContainer>
                                    </td>

                                    {thesaurus ? (
                                        <ListGroup variant="flush">
                                            {thesaurus.map(
                                                (
                                                    definition: any,
                                                    index: number
                                                ) => {
                                                    const short_definitions: any =
                                                        definition.short;
                                                    return (
                                                        <ListGroup.Item
                                                            key={`${index}`}
                                                        >
                                                            <h4>
                                                                {
                                                                    definition.functional_label
                                                                }
                                                            </h4>
                                                            {short_definitions.map(
                                                                (
                                                                    description: any,
                                                                    index: number
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
                                    {collegiate ? (
                                        <ListGroup variant="flush">
                                            {collegiate.map(
                                                (
                                                    definition: any,
                                                    index: number
                                                ) => {
                                                    const short_definitions: any =
                                                        definition.short;
                                                    return (
                                                        <ListGroup.Item
                                                            key={`${index}`}
                                                        >
                                                            <h4>
                                                                {
                                                                    definition.functional_label
                                                                }
                                                            </h4>
                                                            {short_definitions.map(
                                                                (
                                                                    description: any,
                                                                    index: number
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
