import React, { Component, ChangeEvent } from "react";
import * as rm from "typed-rest-client/RestClient";

import { InferProps } from "prop-types";
import { connect } from "react-redux";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import { AuthPropTypes } from "../domain/auth";

import { TermPropTypes } from "../domain/terms";
import { TermsReducerState } from "../reducers/types";

// const x = { FormControl< "input" >}
const TermSearchPropTypes = {
    auth: AuthPropTypes
};

type TermSearchProps =
    | (InferProps<typeof TermSearchPropTypes> & { terms: TermsReducerState })
    | any;
type TermSearchState = {
    term: string;
};

class TermSearch extends Component<TermSearchProps, TermSearchState> {
    private termInputRef = React.createRef<HTMLInputElement>();
    private http: rm.RestClient;
    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    constructor(props: TermSearchProps) {
        super(props);
        this.state = {
            term: ""
        };
        const baseUrl = "https://cognod.es/api/v1/";
        this.http = new rm.RestClient("rest-samples", baseUrl);
    }

    public search = () => {
        const { addTerms }: TermSearchProps = this.props;
        interface TermQuery {
            term: string;
        }
        const term = this.getTerm();
        let query: TermQuery = { term };

        console.log("POSTing to API");
        this.http
            .create<TermQuery>(
                "https://cognod.es/api/v1/dict/definitions",
                query
            )
            .then((response: any) => {
                addTerms([response.result]);
            })
            .catch(err => {
                console.log("AJAX ERROR", err);
            });

        console.log(
            "isTermValidForSubmission",
            this.isTermValidForSubmission()
        );
        console.log("getTerm", this.getTerm());
    };

    public handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ term: event.target.value });
    };
    public isTermValidForSubmission = () => {
        return this.getTerm().length > 0;
    };
    public getTerm = () => {
        return this.state.term || "";
        // return this.termInputRef.current.value;
    };
    // TODO: call HTTP endpoints and then addTerms on success callback
    // inputRef={input => (this.termInputRef = input)}
    componentDidMount() { }
    render() {
        // const { terms }: TermSearchProps = this.props;
        const { handleChange } = this;
        return (
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Lexicon - Search and Save</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group controlId="formBasicCriteria">
                        <FormControl
                            type="text"
                            placeholder="e.g.: elated"
                            onChange={handleChange}
                        />
                        <Form.Text className="text-muted">
                            For now only support words, no support to phrases{" "}
                            <code>{this.state.term}</code>
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        onClick={this.search}
                        variant="primary"
                    // disabled={!this.isTermValidForSubmission()}
                    >
                        Search{""}
                    </Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}

export default connect<TermSearchProps>(
    state => {
        return { ...state };
    },
    {
        addTerms: function(terms: TermSearchState[]) {
            return {
                type: "ADD_TERMS",
                terms
            };
        }
    }
)(TermSearch);
