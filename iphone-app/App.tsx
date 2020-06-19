import React, { Component } from "react";
import { StyleSheet, Alert, View } from "react-native";
import { connect } from "react-redux";
import PropTypes, { InferProps } from "prop-types";
import Constants from "expo-constants";
import { Provider } from "react-redux";
import store from "./store";
import {
    Container,
    Header,
    Title,
    Content,
    Footer,
    FooterTab,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Text
} from "native-base";
import { AuthPropTypes } from "./domain/auth";
import { TermsReducerState, TermListState } from "./reducers/types";
import { TermPropTypes, TermProps } from "./domain/terms";
import { DictionaryAPIClient } from "./networking";

import TermList from "./components/TermList";

const AppPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addTerms: PropTypes.func
};

type AppProps =
    | (InferProps<typeof AppPropTypes> & { terms: TermsReducerState })
    | any;

class App extends Component<AppProps, TermListState> {
    private api: DictionaryAPIClient;
    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    constructor(props: AppProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
    }
    public fetchDefinitions = () => {
        const { addTerms }: TermListProps = this.props;

        this.api.listDefinitions(addTerms);
    };

    render() {
        const { terms }: TermListProps = this.props;
        const { by_term } = terms;
        const { fetchDefinitions } = this;
        const all: TermProps[] = Object.values(by_term);

        return (
            <Container>
                <Header>
                    <Left>
                        <Button
                            transparent
                            onPress={() => {
                                Alert.alert("Menu not yet implemented");
                            }}
                        >
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Lexicon</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <TermList />
                </Content>
                <Footer>
                    <FooterTab>
                        <Button
                            full
                            onPress={() => {
                                fetchDefinitions();
                            }}
                        >
                            <Text>Refresh</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

function Separator() {
    return <View style={styles.separator} />;
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        marginHorizontal: 16
    },
    title: {
        textAlign: "center",
        marginVertical: 8
    },
    fixToText: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: "#737373",
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});

const ConnectedApp = connect<AppProps>(
    (state: TermListState) => {
        return { ...state };
    },
    {
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
)(App);

const FinalApp = () => (
    <Provider store={store}>
        <ConnectedApp />
    </Provider>
);

export default FinalApp;
