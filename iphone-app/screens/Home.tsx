import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";

import { StyleSheet, Alert, View } from "react-native";
import { connect } from "react-redux";

import Constants from "expo-constants";

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
import { AuthPropTypes } from "../domain/auth";
import { TermsReducerState, TermListState } from "../reducers/types";
import { TermPropTypes, TermProps } from "../domain/terms";
import { DictionaryAPIClient } from "../networking";

import TermList from "../components/TermList";

const HomePropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addTerms: PropTypes.func
};

type HomeProps =
    | (InferProps<typeof HomePropTypes> & { terms: TermsReducerState })
    | any;

class Home extends Component<HomeProps, TermListState> {
    private api: DictionaryAPIClient;
    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    constructor(props: HomeProps) {
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

export default connect<HomeProps>(
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
)(Home);
