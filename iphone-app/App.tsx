import React from "react";
import { connect } from "react-redux";
import PropTypes, { InferProps } from "prop-types";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";

import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Container, Header, View, Button, Icon, Fab } from "native-base";

import { AuthPropTypes } from "./domain/auth";

import store from "./store";
import Home from "./screens/Home";
import WordDefinition from "./screens/WordDefinition";

const AppPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func
};

type AppProps = InferProps<typeof AppPropTypes> | any;
type AppState = {
    active: boolean;
};

enableScreens();
const Stack = createNativeStackNavigator();

class AppLayout extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            active: false
        };
    }

    render() {
        return (
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

                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: "#2c3e50" }}
                    position="bottomRight"
                    onPress={() =>
                        this.setState({ active: !this.state.active })
                    }
                >
                    <Icon type="SimpleLineIcons" name="screen-tablet" />
                    <Button style={{ backgroundColor: "#8e44ad" }}>
                        <Icon type="MaterialCommunityIcons" name="graphql" />
                    </Button>
                    <Button style={{ backgroundColor: "#d35400" }}>
                        <Icon
                            type="MaterialCommunityIcons"
                            name="textbox-password"
                        />
                    </Button>
                    <Button
                        style={{
                            backgroundColor: "#2980b9"
                        }}
                    >
                        <Icon
                            type="MaterialCommunityIcons"
                            name="note-multiple"
                        />
                    </Button>
                </Fab>
            </NavigationContainer>
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
        <AppContainer />
    </Provider>
);

export default App;
