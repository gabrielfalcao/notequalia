import React, { Component } from "react";
import PropTypes from "prop-types";

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";
/* import { NavLink } from "react-router-dom";*/
// import { ComponentWithStore } from "./ui";

import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import ProfilePage from "./pages/home";
import NoteManager from "./pages/NoteManager";
import Login from "./pages/login";
import Logout from "./pages/logout";
import { ComponentWithStore } from "./ui";
import { needs_login } from "./auth";

type AppState = {
    user: any;
    error: Error | null;
};
type AppProps = {
    auth: any;
};

class App extends Component<AppProps, AppState> {
    static propTypes = {
        auth: PropTypes.object
    };
    render() {
        const { auth } = this.props;

        function AuthenticatedRoute({
            children,
            ...rest
        }: {
            [key: string]: any;
        }) {
            return (
                <Route
                    {...rest}
                    render={({ location }) =>
                        !needs_login(auth) ? (
                            children
                        ) : (
                                <Redirect
                                    to={{
                                        pathname: "/login",
                                        state: { from: location }
                                    }}
                                />
                            )
                    }
                />
            );
        }

        return (
            <Router>
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
                                        <LinkContainer to="/notes">
                                            <Nav.Link>Notes</Nav.Link>
                                        </LinkContainer>

                                        <Nav.Link href="/api">Browse API</Nav.Link>

                                        <LinkContainer to="/logout">
                                            <Nav.Link>Logout</Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/profile">
                                            <Nav.Link>Profile</Nav.Link>
                                        </LinkContainer>
                                    </React.Fragment>
                                )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/logout">
                        <Logout />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/notes" />
                    </Route>
                    <AuthenticatedRoute path="/profile">
                        <ProfilePage />
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path="/notes">
                        <NoteManager />
                    </AuthenticatedRoute>
                </Switch>
            </Router>
        );
    }
}
export default ComponentWithStore(App);
