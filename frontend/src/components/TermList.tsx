import React, { Component } from "react";
import * as rm from "typed-rest-client/HttpClient";

import { InferProps } from "prop-types";
import { connect } from "react-redux";

import Table from "react-bootstrap/Table";
// import Alert from "react-bootstrap/Alert";

// import { LinkContainer } from "react-router-bootstrap";

import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";
import { AuthPropTypes } from "../domain/auth";

import { TermPropTypes, TermProps } from "../domain/terms";
import { TermsReducerState } from "../reducers/types";

// const x = { FormControl< "input" >}
const TermListPropTypes = {
    auth: AuthPropTypes
};

type TermListProps =
    | (InferProps<typeof TermListPropTypes> & { terms: TermsReducerState })
    | any;
type TermListState = {
    term: string;
};

class TermList extends Component<TermListProps, TermListState> {
    private http: rm.HttpClient;
    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    constructor(props: TermListProps) {
        super(props);
        this.state = {
            term: ""
        };
        this.http = new rm.HttpClient("list-terms");
    }

    public fetchDefinitions = () => {
        const { addTerms }: TermListProps = this.props;

        this.http
            .get("https://cognod.es/api/v1/dict/definitions")
            .then(res => {
                const bodyPromise = res.readBody();

                bodyPromise.then(
                    body => {
                        const items = JSON.parse(body);
                        addTerms(items);
                    },
                    reason => {
                        console.log("AJAX ERROR", reason);
                    }
                );
            })
            .catch(err => {
                console.log("AJAX ERROR", err);
            });
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

                            return (
                                <tr key={`${index}`}>
                                    <td>
                                        <h3>{term.term}</h3>
                                    </td>
                                    {pydictionary ? (
                                        <React.Fragment>
                                            <td>
                                                <ListGroup variant="flush">
                                                    {Object.keys(
                                                        pydictionary.meaning
                                                    ).map(key => {
                                                        const values: string[] =
                                                            pydictionary
                                                                .meaning[key];
                                                        return (
                                                            <ListGroup.Item>
                                                                <h4>{key}</h4>
                                                                {values.map(
                                                                    description => (
                                                                        <ListGroup.Item>
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
                                                    })}
                                                </ListGroup>
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
        }
    }
)(TermList);
