import React from "react";
import { connect } from "react-redux";
import PropTypes, { InferProps } from "prop-types";
import { Provider } from "react-redux";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { AuthPropTypes } from "./domain/auth";

import store from "./store";
import Home from "./screens/Home";

const AppPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func
};

type AppProps = InferProps<typeof AppPropTypes> | any;

const Stack = createStackNavigator();

const Navigation = connect<AppProps>(
    (state: any) => {
        return { ...state };
    },
    {
        addError: function(error: Error) {
            return {
                type: "ADD_ERROR",
                error
            };
        }
    }
)(({ }) => (
    <Home />
    // <NavigationContainer>
    //     <Stack.Navigator>
    //         <Stack.Screen name="Home" component={Home} />
    //     </Stack.Navigator>
    // </NavigationContainer>
));

const App = () => (
    <Provider store={store}>
        <Navigation />
    </Provider>
);

export default App;
