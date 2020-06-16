import React, { Component } from "react";
import { InferProps } from "prop-types";

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";

import NewNote from "./pages/NewNote";
import NoteEditor from "./pages/NoteEditor";
import DeleteNote from "./pages/DeleteNote";
import DeleteTerm from "./pages/DeleteTerm";
import ViewTerm from "./pages/ViewTerm";

import Login from "./pages/login";
import MindMapView from "./views/MindMapView";
import Logout from "./pages/logout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ComponentWithStore } from "./ui";
import TopNav from "./components/TopNav";
import { needs_login, AuthPropTypes } from "./domain/auth";
import { DEFAULT_GRAPH } from "./constants";

type AppState = {
    error: Error | null;
};
const AppPropTypes = {
    auth: AuthPropTypes
};
type AppProps = InferProps<typeof AppPropTypes> | any;

class App extends Component<AppProps, AppState> {
    static propTypes = AppPropTypes;
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
                <TopNav />
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
                        <Dashboard utilities />
                    </Route>
                    <Route exact path="/notes">
                        <Dashboard />
                    </Route>
                    <AuthenticatedRoute path="/notes/new">
                        <NewNote />
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path="/notes/edit/:noteID">
                        <NoteEditor />
                    </AuthenticatedRoute>
                    <Route path="/notes/delete/:noteID">
                        <DeleteNote />
                    </Route>
                    <AuthenticatedRoute path="/terms/:termID">
                        <ViewTerm />
                    </AuthenticatedRoute>

                    <Route path="/terms/delete/:termID">
                        <DeleteTerm />
                    </Route>
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}
export default ComponentWithStore(App);
