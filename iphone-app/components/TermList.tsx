import React, { Component } from "react";

import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackRouteProp } from "@react-navigation/stack";

import { AuthPropTypes } from "../domain/auth";
import { Title } from "native-base";
import ErrorView from "./ErrorView";
import {
    List,
    ListItem,
    Content,
    Button,
    Icon,
    Text,
    Card,
    CardItem
} from "native-base";

import { RootStackParamList } from "../domain/navigation";

import { TermPropTypes, TermProps } from "../domain/terms";
import { TermsReducerState, TermListState } from "../reducers/types";
import { DictionaryAPIClient } from "../networking";

export const TermListPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addTerms: PropTypes.func
};
export type TermListNavigationProp = StackNavigationProp<
    RootStackParamList,
    "WordDefinition"
>;
export type TermListRouteProp = StackRouteProp<
    RootStackParamList,
    "WordDefinition"
>;

export type TermListProps =
    | (InferProps<typeof TermListPropTypes> & {
        terms: TermsReducerState;
        navigation: TermListNavigationProp;
        route: TermListRouteProp;
    })
    | any;

class TermList extends Component<TermListProps, TermListState> {
    private api: DictionaryAPIClient;
    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    constructor(props: TermListProps) {
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
        const { terms, navigation }: TermListProps = this.props;
        const { by_term } = terms;
        const { fetchDefinitions } = this;
        const all: TermProps[] = Object.values(by_term);
        if (all.length === 0) {
            return <Error error={"No definitions found, try refreshing"} />;
        }
        return (
            <List>
                {all.map((term: TermProps, index: number) => {
                    const termName = term.term;

                    return (
                        <ListItem key={`${index}`}>
                            <Text
                                onPress={() => {
                                    navigation.push("WordDefinition", {
                                        termName
                                    });
                                }}
                            >
                                {termName}
                            </Text>
                        </ListItem>
                    );
                })}
            </List>
        );
    }
}

export default connect<TermListProps>(
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
)(TermList);
