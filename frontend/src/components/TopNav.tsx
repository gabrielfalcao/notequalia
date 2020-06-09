import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";

import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { ComponentWithStore } from "../ui";

import { needs_login, AuthPropTypes } from "../domain/auth";

const TopNavPropTypes = {
    logout: PropTypes.func,
    auth: AuthPropTypes
};

type TopNavProps = InferProps<typeof TopNavPropTypes> | any;

class TopNav extends Component<TopNavProps, any> {
    static propTypes = TopNavPropTypes;
    render() {
        const { auth } = this.props;
        return (
            <Navbar bg="light" expand="lg" sticky="top" className="mb-3">
                <LinkContainer to="/">
                    <Navbar.Brand>NoteQualia</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="notequalia-navbar-nav" />

                <Navbar.Collapse
                    className="justify-content-end"
                    id="notequalia-navbar-nav"
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
export default ComponentWithStore(TopNav);
