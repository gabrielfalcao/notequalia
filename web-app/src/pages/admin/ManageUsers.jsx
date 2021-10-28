import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
// import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { needs_login, AuthPropTypes } from "../../domain/auth";
import UserList from "./UserList";
import { AdminAPIClient } from "../../networking";
const ManageUsersPropTypes = {
	auth: AuthPropTypes,
	addError: PropTypes.func,
	addUsers: PropTypes.func,
};
class ManageUsers extends Component {
	constructor(props) {
		super(props);
		this.performManageUsers = () => {};
		this.onSetNewUserEmail = (event) => {
			this.setState({ newUserEmail: event.target.value });
		};
		this.onSetNewUserPassword = (event) => {
			this.setState({ newUserPassword: event.target.value });
		};
		this.submitNewUser = () => {
			const { fetchUsers } = this;
			const { history } = this.props;
			this.api.createUser(
				this.state.newUserEmail,
				this.state.newUserPassword,
				(user) => {
					// update redux
					fetchUsers();
					history.push(`/.admin/users/view/${user.email}`);
				}
			);
		};
		this.fetchUsers = () => {
			const { addUsers } = this.props;
			this.api.listUsers(addUsers);
		};
		this.state = {
			newUserEmail: "",
			newUserPassword: "",
		};
		const { addError } = props;
		this.api = new AdminAPIClient(
			addError,
			props.auth.access_token.content
		);
	}
	render() {
		const { auth } = this.props;
		if (needs_login(auth)) {
			return <Redirect to="/" />;
		}
		return (
			<Container>
				<Row>
					<Col md={6}>
						<Card bg="light" text="dark" className="mb-2">
							<Card.Header>Create User</Card.Header>
							<Card.Body>
								<Form.Group controlId="formAdminCreateUser">
									<Form.Text className="text-muted">
										{"Email"}
									</Form.Text>

									<FormControl
										type="email"
										placeholder="foo@bar.com"
										onChange={this.onSetNewUserEmail}
										value={this.state.newUserEmail}
									/>
									<Form.Text className="text-muted">
										{"Password"}
									</Form.Text>

									<FormControl
										type="password"
										onChange={this.onSetNewUserPassword}
										value={this.state.newUserPassword}
									/>
								</Form.Group>

								<Button
									onClick={this.submitNewUser}
									variant="primary"
								>
									{"Create"}
								</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Card bg="light" text="dark" className="mb-2">
							<Card.Header>Users</Card.Header>
							<Card.Body>
								<UserList />
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}
}
ManageUsers.propTypes = ManageUsersPropTypes;
export default withRouter(
	connect(
		(state) => {
			return { ...state };
		},
		{
			addUsers: function (users) {
				return {
					type: "ADD_USERS",
					users,
				};
			},
			addError: function (error) {
				return {
					type: "ADD_ERROR",
					error,
				};
			},
		}
	)(ManageUsers)
);
