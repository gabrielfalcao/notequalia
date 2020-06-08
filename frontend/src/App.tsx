import React, { Component } from "react";
import { InferProps } from "prop-types";

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";

import ProfilePage from "./pages/profile-page";
import NoteManager from "./pages/NoteManager";
import Login from "./pages/login";
import MindMapView from "./views/MindMapView";
import Logout from "./pages/logout";
import { ComponentWithStore } from "./ui";
import TopNav from "./components/TopNav";
import { needs_login, AuthPropTypes } from "./auth";
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
