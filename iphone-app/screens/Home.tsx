import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import Modal from "react-native-modalbox";

import { StyleSheet, Alert, View } from "react-native";
import { connect } from "react-redux";

import Constants from "expo-constants";

import {
    //    Container,
    Content,
    Button,
    Icon,
    Spinner,
    Text,
    Card,
    CardItem
} from "native-base";

import { AuthPropTypes } from "../domain/auth";
import { TermsReducerState, TermListState } from "../reducers/types";
import { TermPropTypes, TermProps } from "../domain/terms";
import { DictionaryAPIClient } from "../networking";
import { RootStackParamList } from "../domain/navigation";

import TermList, { TermListProps } from "../components/TermList";
import MainMenu from "../components/MainMenu";

export type HomeNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Home"
>;
export type HomeRouteProp = StackRouteProp<RootStackParamList, "Home">;
export const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    confirmDeletionModal: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        height: 150,
        backgroundColor: "#2c3e50"
    },
    loadingModal: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        height: 150,
        backgroundColor: "#ecf0f1"
    }
});

const HomePropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addTerms: PropTypes.func
};

type HomeProps =
    | (InferProps<typeof HomePropTypes> & {
        terms: TermsReducerState;
        navigation: HomeNavigationProp;
        route: HomeRouteProp;
    })
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

    componentDidMount() { }
    render() {
        const { terms, navigation, route }: TermListProps = this.props;
        const { by_term } = terms;
        const { fetchDefinitions } = this;
        const all: TermProps[] = Object.values(by_term);
        const termCount = all.length;

        return (
            <React.Fragment>
                <Content>
                    {termCount > 0 ? (
                        <TermList navigation={navigation} route={route} />
                    ) : (
                            <View
                                style={{
                                    alignItems: "center",
                                    marginTop: 240,
                                    justifyContent: "center",
                                    flex: 1
                                }}
                            >
                                <Spinner
                                    style={{
                                        flex: 1,
                                        alignSelf: "center"
                                    }}
                                    color="black"
                                />
                                <Text style={[styles.text, { marginTop: 30 }]}>
                                    Loading lexicon
							</Text>
                            </View>
                        )}
                </Content>
                <MainMenu navigation={navigation} />
            </React.Fragment>
        );
    }
}

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
