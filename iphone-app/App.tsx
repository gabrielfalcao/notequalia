import React from "react";
import { connect } from "react-redux";
import PropTypes, { InferProps } from "prop-types";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";

import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { AuthPropTypes } from "./domain/auth";

import store from "./store";
import Home from "./screens/Home";
import WordDefinition from "./screens/WordDefinition";

const AppPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func
};

type AppProps = InferProps<typeof AppPropTypes> | any;

enableScreens();
const Stack = createNativeStackNavigator();

const AppContainer = connect<AppProps>(
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
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Lexicon">
            <Stack.Screen name="Lexicon" component={Home} />
            <Stack.Screen
                name="WordDefinition"
                component={WordDefinition}
                options={({ route }) => ({
                    title: `Term: "${route.params.termName}"`
                })}
            />
        </Stack.Navigator>
    </NavigationContainer>
));

const App = () => (
    <Provider store={store}>
        <AppContainer />
    </Provider>
);

export default App;
