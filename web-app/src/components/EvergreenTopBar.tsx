import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";

import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { ComponentWithStore } from "../ui";

import {
    // needs_login,
    AuthPropTypes
} from "../domain/auth";

const EvergreenTopBarPropTypes = {
    logout: PropTypes.func,
    auth: AuthPropTypes
};

type EvergreenTopBarProps = InferProps<typeof EvergreenTopBarPropTypes> | any;

class EvergreenTopBar extends Component<EvergreenTopBarProps, any> {
    static propTypes = EvergreenTopBarPropTypes;
    render() {
        // const { auth } = this.props;
        return (
            <Navbar bg="light" expand="lg" sticky="top" className="mb-3">
                <LinkContainer to="/">
                    <Navbar.Brand>
                        Notebook: <strong>Note-taking App</strong>
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
export default ComponentWithStore(EvergreenTopBar);
