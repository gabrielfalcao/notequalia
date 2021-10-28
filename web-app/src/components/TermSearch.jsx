import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { withRouter } from "react-router";
import Button from "react-bootstrap/Button";
import { AuthPropTypes } from "../domain/auth";
import { TermPropTypes } from "../domain/terms";
import { DictionaryAPIClient } from "../networking";
// const x = { FormControl< "input" >}
const TermSearchPropTypes = {
	auth: AuthPropTypes,
	addError: PropTypes.func,
	addTerms: PropTypes.func,
	title: PropTypes.string,
};
class TermSearch extends Component {
	propTypes = TermSearchPropTypes;
	constructor(props) {
		super(props);
		this.search = () => {
			const { addTerms, history } = this.props;
			this.api.searchDefinition(this.getTerm(), (term) => {
				addTerms([term]);
				this.setState({ term: "" });
				history.push(`/terms/view/${term.term}`);
			});
		};
		this.handleChange = (event) => {
			this.setState({ term: event.target.value });
		};
		this.handleKeyPress = (event) => {
			if (event.key === "Enter") {
				this.search();
			}
		};
		this.isTermValidForSubmission = () => {
			return this.getTerm().length > 0;
		};
		this.getTerm = () => {
			return this.state.term || "";
			// return this.termInputRef.current.value;
		};
		const { addError } = props;
		this.state = {
			term: "",
		};
		this.api = new DictionaryAPIClient((error) => {
			addError(error);
		}, props.auth.access_token.content);
	}
	// TODO: call HTTP endpoints and then addTerms on success callback
	// inputRef={input => (this.termInputRef = input)}
	componentDidMount() {}
	render() {
		// const { terms }: TermSearchProps = this.props;
		const { handleChange, handleKeyPress } = this;
		return (
			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>{"Define word"}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form.Group controlId="formBasicCriteria">
						<FormControl
							type="text"
							placeholder="e.g.: elated"
							onChange={handleChange}
							onKeyPress={handleKeyPress}
							value={this.state.term}
						/>
						<Form.Text className="text-muted">
							For now only support words, no support to phrases{" "}
							<code>{this.state.term}</code>
						</Form.Text>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={this.search} variant="primary">
						Search{""}
					</Button>
				</Modal.Footer>
			</Modal.Dialog>
		);
	}
}
TermSearch.propTypes = {
	auth: AuthPropTypes,
	terms: TermPropTypes,
};
export default withRouter(
	connect(
		(state) => {
			return { ...(state || {}) };
		},
		{
			addTerms: function (terms) {
				return {
					type: "ADD_TERMS",
					terms,
				};
			},
			addError: function (error) {
				return {
					type: "ADD_ERROR",
					error,
				};
			},
		}
	)(TermSearch)
);
