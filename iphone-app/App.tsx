import React from "react";
import { connect } from "react-redux";
import PropTypes, { InferProps } from "prop-types";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";

import { RootStackParamList } from "./domain/navigation";

import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Container } from "native-base";

import { AuthPropTypes } from "./domain/auth";

import store from "./store";
import Home from "./screens/Home";
import MainMenu from "./components/MainMenu";
import WordDefinition from "./screens/WordDefinition";
import SearchDefinition from "./screens/SearchDefinition";

enableScreens();

const AppPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func
};

type AppProps = (InferProps<typeof AppPropTypes> & {}) | any;
type AppState = {};

const Stack = createNativeStackNavigator();

class AppLayout extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Container>
                <Stack.Navigator initialRouteName="Lexicon">
                    <Stack.Screen name="Lexicon" component={Home} />
                    <Stack.Screen
                        name="WordDefinition"
                        component={WordDefinition}
                        options={({ route }: any) => ({
                            title: `Term: "${route.params.termName}"`
                        })}
                    />
                    <Stack.Screen
                        name="SearchDefinition"
                        component={SearchDefinition}
                    />
                </Stack.Navigator>
            </Container>
        );
    }
}
const AppContainer = connect<AppProps>(
    (state: AppState) => {
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
)(AppLayout);

const App = () => (
    <Provider store={store}>
        <NavigationContainer>
            <AppContainer />
        </NavigationContainer>
    </Provider>
);

export default App;
