import React, { Component } from "react";

import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import Modal from "react-native-modalbox";
import { Dimensions } from "react-native";

import { AuthPropTypes } from "../domain/auth";
import Constants from "expo-constants";
import ErrorView from "./ErrorView";
import {
    List,
    ListItem,
    Text,
    Form,
    Item,
    Input,
    Icon,
    Button,
    Left,
    Right,
    Body
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
export type TermListRouteProp = RouteProp<RootStackParamList, "WordDefinition">;

export type TermListProps =
    | (InferProps<typeof TermListPropTypes> & {
        terms: TermsReducerState;
        navigation: TermListNavigationProp;
        route: TermListRouteProp;
    })
    | any;

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
        this.state = {
            searchTerm: "",
            termName: ""
        };
    }
    confirmDeletion = ({ termName }: TermListState) => {
        this.setState({ termName });
        this.refs.confirmDeletion.open();
    };
    deleteTerm = ({ termName }: TermListState) => {
        const { deleteTerm, navigation }: TermListProps = this.props;

        this.api.deleteDefinition(termName, (term: TermProps) => {
            deleteTerm(term.term);
            this.refs.confirmDeletion.close();
        });
    };

    public fetchDefinitions = () => {
        const { addTerms }: TermListProps = this.props;

        this.api.listDefinitions(addTerms);
    };

    render() {
        const { deleteTerm, fetchDefinitions, props }: TermListProps = this;
        const { terms, navigation }: TermListProps = props;
        const { by_term } = terms;

        const all: TermProps[] = Object.values(by_term);
        const filtered = all.filter((item: TermProps, index) => {
            if (this.state.searchTerm.length > 0) {
                return item.term.includes(this.state.searchTerm);
            }
            return true;
        });
        if (all.length === 0) {
            this.fetchDefinitions();
            return <ErrorView error={"No definitions found, try refreshing"} />;
        }
        return (
            <React.Fragment>
                <Form>
                    <Item stackedLabel>
                        <Input
                            style={{
                                marginRight: 15
                            }}
                            placeholder="type here to filter"
                            onChangeText={text =>
                                this.setState({ searchTerm: text })
                            }
                        />
                    </Item>
                </Form>

                <List>
                    {filtered.map((term: TermProps, index: number) => {
                        const termName = term.term || "";
                        const meta = term.content
                            ? JSON.parse(term.content)
                            : { pydictionary: { meaning: {} } };
                        const { pydictionary }: any = meta;
                        const { meaning } = pydictionary;
                        return (
                            <ListItem key={`${index}`}>
                                <Left>
                                    <Text
                                        onPress={() => {
                                            navigation.push("WordDefinition", {
                                                termName
                                            });
                                        }}
                                    >
                                        {termName ? termName : "[unnamed]"}
                                    </Text>
                                </Left>
                                <Body
                                    onPress={() => {
                                        navigation.push("WordDefinition", {
                                            termName
                                        });
                                    }}
                                >
                                    {meaning ? (
                                        Object.keys(meaning).map(
                                            (key, index) => (
                                                <React.Fragment
                                                    key={`${key}-${index}`}
                                                >
                                                    <Text note>{`${key}`}</Text>
                                                    {false
                                                        ? Object.values(
                                                            meaning[key]
                                                        ).map((item, i) => (
                                                            <Text
                                                                note
                                                                key={`${key}-${index}-${i}`}
                                                            >
                                                                {`${item}`}
                                                            </Text>
                                                        ))
                                                        : null}
                                                </React.Fragment>
                                            )
                                        )
                                    ) : (
                                            <Text>{termName}</Text>
                                        )}
                                </Body>
                                <Right>
                                    <Icon
                                        onPress={() =>
                                            this.confirmDeletion({ termName })
                                        }
                                        type="MaterialCommunityIcons"
                                        color="#e74c3c"
                                        name="delete"
                                    />
                                </Right>
                            </ListItem>
                        );
                    })}
                </List>
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
            </React.Fragment>
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
        deleteTerm: function(term: string) {
            return {
                type: "DELETE_TERM",
                term
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
