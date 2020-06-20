import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { connect } from "react-redux";

import {
    //    Container,
    Title,
    Content,
    Card,
    CardItem,
    Text
} from "native-base";
import { AuthPropTypes } from "../domain/auth";
import { RootStackParamList } from "../domain/navigation";
import { TermPropTypes } from "../domain/terms";
import { TermsReducerState } from "../reducers/types";
import { DictionaryAPIClient } from "../networking";

const SearchDefinitionPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addTerms: PropTypes.func
};

export type SearchDefinitionNavigationProp = StackNavigationProp<
    RootStackParamList,
    "SearchDefinition"
>;

type SearchDefinitionRouteProp = RouteProp<
    RootStackParamList,
    "SearchDefinition"
>;

type SearchDefinitionState = any;

type SearchDefinitionProps =
    | (InferProps<typeof SearchDefinitionPropTypes> & {
        terms: TermsReducerState;
        navigation: SearchDefinitionNavigationProp;
        route: SearchDefinitionRouteProp;
    })
    | any;

class SearchDefinition extends Component<
    SearchDefinitionProps,
    TermsReducerState
    > {
    private api: DictionaryAPIClient;

    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    constructor(props: SearchDefinitionProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
    }

    render() {
        return <Title>Search Definition</Title>;
    }
}

export default connect<SearchDefinitionProps>(
    (state: SearchDefinitionState) => {
        return { ...state };
    },
    {
        addTerms: function(terms: SearchDefinitionState[]) {
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
)(SearchDefinition);
