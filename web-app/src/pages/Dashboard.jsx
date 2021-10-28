import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
// import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { needs_login, AuthPropTypes } from "../domain/auth";
import NoteList from "../components/NoteList";
import TermList from "../components/TermList";
import TermSearch from "../components/TermSearch";
import { DictionaryAPIClient } from "../networking";
const DashboardPropTypes = {
	logout: PropTypes.func,
	errors: PropTypes.any,
	purgeData: PropTypes.func,
	addError: PropTypes.func,
	addTerms: PropTypes.func,
	utilities: PropTypes.bool,
	auth: AuthPropTypes,
};
class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.performDashboard = () => {
			this.props.logout();
		};
		this.fetchDefinitions = () => {
			const { addTerms } = this.props;
			this.api.listDefinitions(addTerms);
		};
		const { addError } = props;
		this.api = new DictionaryAPIClient(
			addError,
			props.auth.access_token.content
		);
		this.state = {};
	}
	render() {
		const { auth, errors, purgeData, utilities } = this.props;
		const { fetchDefinitions } = this;
		if (needs_login(auth)) {
			return <Redirect to="/" />;
		}
		return (
			<Container>
				{errors.current
					? errors.all.map((error) => (
							<Alert variant="danger">
								<h3>{error.name}</h3>
								<p>{error.message}</p>
								{error.config ? (
									<p>
										{error.config.method.toUpperCase()}{" "}
										{error.config.url}
									</p>
								) : null}

								<pre style={{ color: "white" }}>
									{error.stack}
								</pre>
							</Alert>
					  ))
					: null}

				<Row>
					{utilities ? (
						<React.Fragment>
							<Col md={6}>
								<TermSearch />
							</Col>

							<Col md={6}>
								<Modal.Dialog>
									<Modal.Header>
										<Modal.Title>Actions</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<p>
											<Button
												variant="danger"
												onClick={() => {
													purgeData();
												}}
											>
												Purge all data{" "}
											</Button>
										</p>
										<p>
											<Button
												onClick={() => {
													fetchDefinitions();
												}}
												variant="success"
											>
												{"Fetch Definitions"}
											</Button>
										</p>
									</Modal.Body>
								</Modal.Dialog>
							</Col>
						</React.Fragment>
					) : null}

					{false ? (
						<Col md={12}>
							<Card bg="light" text="dark" className="mb-2">
								<Card.Header>Notes</Card.Header>
								<Card.Body>
									<NoteList />
									<LinkContainer to="/notes/new">
										<Button variant="success">
											Add new Note{" "}
										</Button>
									</LinkContainer>
								</Card.Body>
							</Card>
						</Col>
					) : null}
					{utilities ? (
						<Col md={12}>
							<Card bg="light" text="dark" className="mb-2">
								<Card.Header>Lexicon</Card.Header>
								<Card.Body>
									<TermList hideFunctionalLabels />
								</Card.Body>
							</Card>
						</Col>
					) : null}
				</Row>
			</Container>
		);
	}
}
Dashboard.propTypes = DashboardPropTypes;
export default connect(
	(state) => {
		return { ...state };
	},
	{
		logout: function () {
			return {
				type: "LOGOUT",
			};
		},
		purgeData: function () {
			return {
				type: "PURGE_DATA",
			};
		},
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
)(Dashboard);
