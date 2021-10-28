import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { needs_login, AuthPropTypes } from "../domain/auth";
const LogoutPropTypes = {
	logout: PropTypes.func,
	auth: AuthPropTypes,
};
class Logout extends Component {
	constructor(props) {
		super(props);
		this.performLogout = () => {
			this.props.logout();
		};
		this.state = {};
	}
	render() {
		const { auth } = this.props;
		if (needs_login(auth)) {
			return <Redirect to="/" />;
		}
		return (
			<Container fluid="md">
				<Row>
					<Col md={12}>
						<Modal.Dialog>
							<Modal.Header>
								<Modal.Title>
									Do you really wish to logout?
								</Modal.Title>
							</Modal.Header>

							<Modal.Footer>
								<Button
									onClick={this.performLogout}
									variant="danger"
								>
									Logout
								</Button>
							</Modal.Footer>
						</Modal.Dialog>
					</Col>
				</Row>
			</Container>
		);
	}
}
Logout.propTypes = LogoutPropTypes;
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
	}
)(Logout);
