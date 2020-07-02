import React from "react";
import { connect } from "react-redux";
import PropTypes, { InferProps } from "prop-types";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";
import * as SplashScreen from "expo-splash-screen";
import { Audio } from "expo-av";
// import { RootStackParamList } from "./domain/navigation";

import { createNativeStackNavigator } from "react-native-screens/native-stack";
import Modal from "react-native-modalbox";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Container, Button, Text, Icon } from "native-base";

import { AuthPropTypes } from "./domain/auth";
import { TermProps } from "./domain/terms";
import { DictionaryAPIClient } from "./networking";
import { capitalize } from "./utils";
import store from "./store";

import Home from "./screens/Home";
import WordDefinition from "./screens/WordDefinition";
import SearchDefinition from "./screens/SearchDefinition";

enableScreens();

const AppPropTypes = {
    auth: AuthPropTypes,
    refs: PropTypes.object,
    addError: PropTypes.func
};

type AppProps = (InferProps<typeof AppPropTypes> & {}) | any;
type AppState = {
    termName: string;
    deleteTerm: string;
};

const Stack = createNativeStackNavigator();
export const styles = StyleSheet.create({
    text: {
        fontSize: 15
    },
    confirmDeletionModal: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        height: 150,
        backgroundColor: "#2c3e50"
    }
});

class AppLayout extends React.Component<AppProps, AppState> {
    private api: DictionaryAPIClient;
    constructor(props: AppProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
        this.state = {
            termName: "",
            deleteTerm: ""
        };
    }
    confirmDeletion = ({ termName }: AppState) => {
        this.setState({ termName });
        this.refs.confirmDeletion.open();
    };
    deleteTerm = ({ termName }: AppState) => {
        const { deleteTerm }: AppProps = this.props;

        this.api.deleteDefinition(termName, (term: TermProps) => {
            const { router }: any = this.refs;
            deleteTerm(term.term);
            this.refs.confirmDeletion.close();
            if (router.canGoBack()) {
                router.goBack();
            } else {
                router.reset();
            }
            this.setState({ termName: "" });
        });
    };
    public fetchDefinitions = () => {
        const { addTerms }: AppProps = this.props;

        this.api.listDefinitions(addTerms);
    };

    async componentDidMount() {
        // Prevent native splash screen from autohiding
        try {
            await SplashScreen.preventAutoHideAsync();
        } catch (e) {
            console.warn(e);
        }
        this.prepareResources();
    }
    prepareResources = async () => {
        this.fetchDefinitions();
        await SplashScreen.hideAsync();
    };
    render() {
        const { deleteTerm } = this;
        return (
            <NavigationContainer ref={"router"}>
                <Container>
                    <Stack.Navigator initialRouteName="Lexicon">
                        <Stack.Screen name="Lexicon" component={Home} />
                        <Stack.Screen
                            name="WordDefinition"
                            component={WordDefinition}
                            options={({ route }: any) => ({
                                title: `Term: "${capitalize(
                                    route.params.termName
                                )}"`,
                                headerRight: () => (
                                    <Icon
                                        onPress={() =>
                                            this.confirmDeletion(route.params)
                                        }
                                        type="MaterialCommunityIcons"
                                        color="#e74c3c"
                                        name="delete-circle"
                                    />
                                )
                            })}
                        />
                        <Stack.Screen
                            name="SearchDefinition"
                            component={SearchDefinition}
                            options={{}}
                        />
                    </Stack.Navigator>
                    <Modal
                        style={styles.confirmDeletionModal}
                        backdrop={true}
                        coverScreen={true}
                        position={"center"}
                        entry={"top"}
                        ref={"confirmDeletion"}
                    >
                        <Text style={[styles.text, { color: "white" }]}>
                            {`Are you sure you want to delete the term definition "${this.state.termName}" ?`}
                        </Text>
                        <Button
                            danger
                            onPress={() => {
                                deleteTerm(this.state);
                            }}
                        >
                            <Text>Delete</Text>
                        </Button>
                    </Modal>
                </Container>
            </NavigationContainer>
        );
    }
}
const AppContainer = connect<AppProps>(
    (state: AppState) => {
        return { ...state };
    },
    {
        deleteTerm: function(term: string) {
            return {
                type: "DELETE_TERM",
                term
            };
        },
        addTerms: function(terms: TermListState[]) {
            return {
                type: "ADD_TERMS",
                terms
            };
        },

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
