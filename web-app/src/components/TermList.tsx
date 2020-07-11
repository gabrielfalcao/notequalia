import React, { Component } from "react";

import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

import { LinkContainer } from "react-router-bootstrap";

import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";
import { AuthPropTypes } from "../domain/auth";

import { TermProps } from "../domain/terms";
import { TermsReducerState, TermListState } from "../reducers/types";
import { DictionaryAPIClient } from "../networking";

// const x = { FormControl< "input" >}
export const TermListPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    hideFunctionalLabels: PropTypes.bool,
    addTerms: PropTypes.func,
    filterTerm: PropTypes.string
};

type TermListProps =
    | (InferProps<typeof TermListPropTypes> & {
        terms: TermsReducerState;
        filterTerm: string;
    })
    | any;

class TermList extends Component<TermListProps, TermListState> {
    private api: DictionaryAPIClient;
    private filterTermRef: React.RefObject<HTMLInputElement>;
    static propTypes = TermListPropTypes;
    constructor(props: TermListProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
        this.filterTermRef = React.createRef();
    }

    public fetchDefinitions = () => {
        const { addTerms }: TermListProps = this.props;

        this.api.listDefinitions(addTerms);
    };
    public filterDefinitions = () => {
        const { filterTerm }: TermListState = this.state;
        const { filterTerms }: TermListProps = this.props;

        filterTerms(filterTerm);
    };

    componentDidMount() { }
    render() {
        const { terms, hideFunctionalLabels }: TermListProps = this.props;
        const { by_term } = terms;
        const { fetchDefinitions, filterDefinitions } = this;
        const all: TermProps[] = Object.values(by_term);
        const showFunctionalLabels = !hideFunctionalLabels;
        return (
            <React.Fragment>
                <Form inline>
                    <Form.Control
                        type="text"
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            this.setState({
                                filterTerm: event.currentTarget.value
                            });
                        }}
                        placeholder="Filter"
                        className="mr-sm-2"
                    />
                    <Button
                        onClick={() => {
                            filterDefinitions();
                        }}
                        variant="outline-success"
                    >
                        Filter
					</Button>
                </Form>
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
                                        <LinkContainer
                                            to={`/terms/view/${term.term}`}
                                        >
                                            <h3>{term.term}</h3>
                                        </LinkContainer>
                                    </td>
                                    {showFunctionalLabels && pydictionary ? (
                                        <React.Fragment>
                                            <td>
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
                                                    </React.Fragment>
                                                ) : null}
												y{" "}
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
        filterTerms: function(filterTerm: string) {
            return {
                type: "FILTER_TERMS",
                filterBy: {
                    term: filterTerm
                }
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
