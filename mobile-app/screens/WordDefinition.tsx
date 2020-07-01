import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { connect } from "react-redux";

import { AuthPropTypes } from "../domain/auth";
import { RootStackParamList } from "../domain/navigation";
import { TermPropTypes } from "../domain/terms";
import { TermsReducerState } from "../reducers/types";
import { DictionaryAPIClient } from "../networking";
import TermDetailCard from "../components/TermDetailCard";
import ErrorView from "../components/ErrorView";

const WordDefinitionPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addTerms: PropTypes.func,
    terms: TermPropTypes
};

export type WordDefinitionNavigationProp = StackNavigationProp<
    RootStackParamList,
    "WordDefinition"
>;
type WordDefinitionRouteProp = RouteProp<RootStackParamList, "WordDefinition">;

type WordDefinitionProps =
    | (InferProps<typeof WordDefinitionPropTypes> & {
        terms: TermsReducerState;
        navigation: WordDefinitionNavigationProp;
        route: WordDefinitionRouteProp;
    })
    | any;

class WordDefinition extends Component<WordDefinitionProps, TermsReducerState> {
    private api: DictionaryAPIClient;
    static propTypes = WordDefinitionPropTypes;
    constructor(props: WordDefinitionProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
    }
    public fetchDefinitions = () => {
        const { addTerms }: WordDefinitionProps = this.props;

        this.api.listDefinitions(addTerms);
    };

    render() {
        const { terms, route }: WordDefinitionProps = this.props;
        const { by_term } = terms;
        const { termName } = route.params;
        const term = by_term[termName];

        if (!term) {
            return <ErrorView error={"Term not found: ${termName}"} />;
        }

        const meta: any = term.content;
        if (!meta) {
            return (
                <ErrorView error={"The term ${termName} has no definitions"} />
            );
        }

        const { pydictionary } = meta;

        if (!pydictionary) {
            return (
                <ErrorView
                    error={"The definitions of term ${termName} are missing"}
                />
            );
        }
        return <TermDetailCard term={term} pydictionary={pydictionary} />;
    }
}

export default connect<WordDefinitionProps>(
    (state: any) => {
        return { ...state };
    },
    {
        addTerms: function(terms: any[]) {
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
)(WordDefinition);
