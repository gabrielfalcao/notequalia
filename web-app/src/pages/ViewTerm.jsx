import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { LinkContainer } from "react-router-bootstrap";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
// import ListGroup from "react-bootstrap/ListGroup";
// import ProgressBar from "react-bootstrap/ProgressBar";
// import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
// import { ComponentWithStore } from "../ui";
import { AuthPropTypes } from "../domain/auth";
import TermSearch from "../components/TermSearch";
import Error from "../components/Error";
import { DictionaryAPIClient } from "../networking";
const ViewTermPropTypes = {
	addError: PropTypes.func,
	addTerms: PropTypes.func,
	auth: AuthPropTypes,
};
class ViewTerm extends Component {
	propTypes = ViewTermPropTypes;
	constructor(props) {
		super(props);
		const { addError } = props;
		this.api = new DictionaryAPIClient(
			addError,
			props.auth.access_token.content
		);
	}
	render() {
		const { terms, match } = this.props;
		if (!match) {
			return <Error message="failed to parse term id from url" />;
		}
		const { termID } = match.params;
		const term = terms.by_term[termID];
		if (!term) {
			return <Redirect to="/" />;
		}
		const meta = term.content;
		const { collegiate, thesaurus } = meta;
		if (!collegiate && !thesaurus) {
			return null;
		}
		return (
			<Container fluid>
				<Row>
					<Col md={12}>
						<Modal.Dialog>
							<Modal.Header>
								<Modal.Title>{term.term}</Modal.Title>
							</Modal.Header>

							<Modal.Body>
								{thesaurus ? (
									<ListGroup variant="flush">
										{thesaurus.map((definition, index) => {
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
										})}
									</ListGroup>
								) : null}
								{collegiate ? (
									<ListGroup variant="flush">
										{collegiate.map((definition, index) => {
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
										})}
									</ListGroup>
								) : null}
							</Modal.Body>

							<Modal.Footer>
								<LinkContainer to={`/`}>
									<Button variant="warning">Back{""}</Button>
								</LinkContainer>
							</Modal.Footer>
						</Modal.Dialog>
						<TermSearch />
					</Col>
				</Row>
			</Container>
		);
	}
}
export default withRouter(
	connect(
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
	)(ViewTerm)
);
