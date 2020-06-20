import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { RouteProp } from "@react-navigation/native";
import { StackRouteProp } from "@react-navigation/stack";

import { StyleSheet, Alert, View } from "react-native";
import { connect } from "react-redux";

import Constants from "expo-constants";

import {
    //    Container,
    Content,
    Button,
    Body,
    Icon,
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

export type HomeNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Home"
>;
export type HomeRouteProp = StackRouteProp<RootStackParamList, "Home">;

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
                            <Card>
                                <CardItem header>
                                    <Text>No definitions found</Text>
                                </CardItem>
                                <CardItem>
                                    <Button
                                        onPress={() => {
                                            fetchDefinitions();
                                        }}
                                    >
                                        <Text>Load Definitions</Text>
                                    </Button>
                                </CardItem>
                            </Card>
                        )}
                </Content>
            </React.Fragment>
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
