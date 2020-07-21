import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import NewNote from "./pages/NewNote";
import NoteEditor from "./pages/NoteEditor";
import NoteView from "./pages/NoteView";
import DeleteNote from "./pages/DeleteNote";
import DeleteTerm from "./pages/DeleteTerm";
import ViewTerm from "./pages/ViewTerm";

import Login from "./pages/login";
import MindMapView from "./views/MindMapView";
import Logout from "./pages/logout";
import Dashboard from "./pages/Dashboard";
import Evergreen from "./pages/Evergreen";
import NotFound from "./pages/NotFound";
import { ComponentWithStore } from "./ui";
import TopNav from "./components/TopNav";
import { needs_login, AuthPropTypes } from "./domain/auth";
import { DEFAULT_GRAPH } from "./constants";

type AppState = {
    error: Error | null;
};
const AppPropTypes = {
    auth: AuthPropTypes,
    error: PropTypes.any
};
type AppProps = InferProps<typeof AppPropTypes> | any;

class App extends Component<AppProps, AppState> {
    static propTypes = AppPropTypes;
    render() {
        const { auth, error } = this.props;

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
                {error ? <Alert variant="danger">{error}</Alert> : null}
                <Route
                    path={[
                        "/dashboard",
                        "/notes/edit",
                        "/notes/delete",
                        "/login",
                        "/mindmap",
                        "/logout"
                    ]}
                >
                    <TopNav />
                </Route>
                <Switch>
                    <Route path="/mindmap">
                        <MindMapView
                            width={500}
                            height={500}
                            graph={DEFAULT_GRAPH}
                        />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/logout">
                        <Logout />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/dashboard" />
                    </Route>

                    <AuthenticatedRoute exact path="/dashboard">
                        <Dashboard utilities />
                    </AuthenticatedRoute>
                    <Route exact path="/notes">
                        <Evergreen />
                    </Route>
                    <AuthenticatedRoute path="/notes/new">
                        <NewNote />
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path="/notes/edit/:noteID">
                        <NoteEditor />
                    </AuthenticatedRoute>
                    <Route path="/notes/view/:noteID">
                        <NoteView />
                    </Route>
                    <Route path="/notes/delete/:noteID">
                        <DeleteNote />
                    </Route>
                    <AuthenticatedRoute path="/terms/view/:termID">
                        <ViewTerm />
                    </AuthenticatedRoute>

                    <AuthenticatedRoute path="/terms/delete/:termID">
                        <DeleteTerm />
                    </AuthenticatedRoute>
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}
export default ComponentWithStore(App);
