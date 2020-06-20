import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { connect } from "react-redux";
import {
    Card,
    CardItem,
    Content,
    Container,
    Form,
    Input,
    Item,
    Label
} from "native-base";
import { AuthPropTypes } from "../domain/auth";
import { RootStackParamList } from "../domain/navigation";
import { TermPropTypes, TermProps } from "../domain/terms";
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

type SearchDefinitionState = {
    termName: string;
};

type SearchDefinitionProps =
    | (InferProps<typeof SearchDefinitionPropTypes> & {
        terms: TermsReducerState;
        navigation: SearchDefinitionNavigationProp;
        route: SearchDefinitionRouteProp;
    })
    | any;

class SearchDefinition extends Component<
    SearchDefinitionProps,
    SearchDefinitionState
    > {
    private api: DictionaryAPIClient;

    static propTypes = {
        auth: AuthPropTypes,
        terms: TermPropTypes
    };
    public search = ({ termName }: SearchDefinitionState) => {
        const { addTerms, navigation }: SearchDefinitionProps = this.props;

        this.api.searchDefinition(termName, (term: TermProps) => {
            addTerms([term]);
            this.setState({ termName: "" });
            navigation.goBack();
        });
    };

    constructor(props: SearchDefinitionProps) {
        super(props);
        const { addError } = props;
        this.api = new DictionaryAPIClient(addError);
        this.state = {
            termName: ""
        };
    }

    render() {
        return (
            <Container>
                <Form>
                    <Item stackedLabel>
                        <Label>Term:</Label>
                        <Input
                            onChangeText={text =>
                                this.setState({ termName: text })
                            }
                            onEndEditing={event => this.search(this.state)}
                        />
                    </Item>
                </Form>
                {false ? (
                    <Content>
                        <Card>
                            <CardItem></CardItem>
                        </Card>
                    </Content>
                ) : null}
            </Container>
        );
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
