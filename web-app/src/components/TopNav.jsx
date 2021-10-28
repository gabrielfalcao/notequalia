import React, { Component } from "react";
import PropTypes from "prop-types";
import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { ComponentWithStore } from "../ui";
import { needs_login, AuthPropTypes } from "../domain/auth";
const TopNavPropTypes = {
	logout: PropTypes.func,
	auth: AuthPropTypes,
};
class TopNav extends Component {
	render() {
		const { auth } = this.props;
		return (
			<Navbar bg="light" expand="lg" sticky="top" className="mb-3">
				<LinkContainer to="/">
					<Navbar.Brand>COGNOD.ES</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle aria-controls="cognodes-navbar-nav" />

				<Navbar.Collapse
					className="justify-content-end"
					id="cognodes-navbar-nav"
				>
					<Nav>
						{needs_login(auth) ? (
							<LinkContainer to="/login">
								<Nav.Link>Login</Nav.Link>
							</LinkContainer>
						) : (
							<React.Fragment>
								<LinkContainer to="/">
									<Nav.Link>Dashboard</Nav.Link>
								</LinkContainer>

								<LinkContainer to="/notes">
									<Nav.Link>Notes</Nav.Link>
								</LinkContainer>

								<LinkContainer to="/mindmap">
									<Nav.Link>MindMap</Nav.Link>
								</LinkContainer>
								<LinkContainer to="/.admin">
									<Nav.Link>Admin</Nav.Link>
								</LinkContainer>

								<LinkContainer to="/logout">
									<Nav.Link>Logout</Nav.Link>
								</LinkContainer>
							</React.Fragment>
						)}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
TopNav.propTypes = TopNavPropTypes;
export default ComponentWithStore(TopNav);
