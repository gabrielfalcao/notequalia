import React, { Component } from "react";
import * as rm from "typed-rest-client/RestClient";

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
    private http: rm.RestClient;
    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    constructor(props: TermListProps) {
        super(props);
        this.state = {
            term: ""
        };
        const baseUrl = "https://cognod.es/api/v1/";
        this.http = new rm.RestClient("rest-samples", baseUrl);
    }

    public fetchDefinitions = () => {
        const { addTerms }: TermListProps = this.props;

        this.http
            .get("https://cognod.es/api/v1/dict/definitions")
            .then((response: any) => {
                addTerms(response.result);
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
                                                {Object.keys(
                                                    pydictionary.meaning
                                                ).map(key => {
                                                    const values: string[] =
                                                        pydictionary.meaning[
                                                        key
                                                        ];
                                                    return (
                                                        <p>
                                                            <h4>{key}</h4>
                                                            <ListGroup variant="flush">
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
                                                            </ListGroup>
                                                        </p>
                                                    );
                                                })}
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
