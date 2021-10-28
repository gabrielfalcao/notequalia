import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Table from "react-bootstrap/Table";
// import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { AuthPropTypes } from "../domain/auth";
import { TermPropTypes } from "../domain/terms";
import { DictionaryAPIClient } from "../networking";
// const x = { FormControl< "input" >}
export const TermListPropTypes = {
	auth: AuthPropTypes,
	hideFunctionalLabels: PropTypes.bool,
	addError: PropTypes.func,
	addTerms: PropTypes.func,
	terms: TermPropTypes,
};
class TermList extends Component {
	constructor(props) {
		super(props);
		this.fetchDefinitions = () => {
			const { addTerms } = this.props;
			this.api.listDefinitions(addTerms);
		};
		const { addError } = props;
		this.api = new DictionaryAPIClient(
			addError,
			props.auth.access_token.content
		);
	}
	componentDidMount() {}
	render() {
		const { terms, hideFunctionalLabels } = this.props;
		const { by_term } = terms;
		const all = Object.values(by_term);
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
						{all.map((term, index) => {
							const meta = term.content;
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
												(definition, index) => {
													const short_definitions =
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
									{collegiate ? (
										<ListGroup variant="flush">
											{collegiate.map(
												(definition, index) => {
													const short_definitions =
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
			</React.Fragment>
		);
	}
}
TermList.propTypes = TermListPropTypes;
export default connect(
	(state) => {
		return { ...state };
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
)(TermList);
