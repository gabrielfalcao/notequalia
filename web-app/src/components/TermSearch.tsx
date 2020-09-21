import React, { Component, ChangeEvent } from "react";
import PropTypes, { InferProps } from "prop-types";

import { connect } from "react-redux";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { withRouter } from "react-router";
import Button from "react-bootstrap/Button";

import { AuthPropTypes } from "../domain/auth";

import { TermPropTypes, TermProps } from "../domain/terms";
import { DictionaryAPIClient } from "../networking";
import { TermsReducerState } from "../reducers/types";

// const x = { FormControl< "input" >}
const TermSearchPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addTerms: PropTypes.func
};

type TermSearchProps =
    | (InferProps<typeof TermSearchPropTypes> & { terms: TermsReducerState })
    | any;
type TermSearchState = {
    term: string;
};

class TermSearch extends Component<TermSearchProps, TermSearchState> {
    // private termInputRef = React.createRef<HTMLInputElement>();
    private api: DictionaryAPIClient;
    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    constructor(props: TermSearchProps) {
        super(props);
        const { addError } = props;

        this.state = {
            term: ""
        };

        this.api = new DictionaryAPIClient(
            addError,
            props.auth.access_token.content
        );
    }

    public search = () => {
        const { addTerms, history }: TermSearchProps = this.props;

        this.api.searchDefinition(this.getTerm(), (term: TermProps) => {
            addTerms([term]);
            this.setState({ term: "" });
            history.push(`/terms/view/${term.term}`);
        });
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
                            value={this.state.term}
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

export default withRouter(
    connect<TermSearchProps>(
        state => {
            return { ...state };
        },
        {
            addTerms: function(terms: TermSearchState[]) {
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
    )(TermSearch)
);
