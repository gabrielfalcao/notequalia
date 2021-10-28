import React, { Component } from "react";
import PropTypes from "prop-types";
import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { ComponentWithStore } from "../ui";
import {
	// needs_login,
	AuthPropTypes,
} from "../domain/auth";
const EvergreenTopBarPropTypes = {
	logout: PropTypes.func,
	auth: AuthPropTypes,
};
class EvergreenTopBar extends Component {
	render() {
		// const { auth } = this.props;
		return (
			<Navbar bg="light" expand="lg" sticky="top" className="mb-3">
				<LinkContainer to="/">
					<Navbar.Brand>
						{false
							? "Notebook: <strong>Note-taking App</strong>"
							: "Evergreen Notes"}
					</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle aria-controls="cognodes-navbar-nav" />

				<Navbar.Collapse
					className="justify-content-end"
					id="cognodes-navbar-nav"
				>
					<Nav>
						<NavDropdown title="Notebook" id="basic-nav-dropdown">
							<NavDropdown.Item href="#action/3.1">
								{"Add Note"}
							</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">
								{"Save/Export"}
							</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">
								{"Share"}
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.3">
								{"Settings"}
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.4">
								{"Publish"}
							</NavDropdown.Item>
						</NavDropdown>
						<LinkContainer to="/dashboard">
							<Nav.Link>{"back to dashboard"}</Nav.Link>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
EvergreenTopBar.propTypes = EvergreenTopBarPropTypes;
export default ComponentWithStore(EvergreenTopBar);
