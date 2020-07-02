import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";

import { connect } from "react-redux";

import {
    //    Container,
    Title,
    Content,
    Card,
    CardItem,
    Accordion,
    View,
    Icon,
    Text
} from "native-base";

import { TermPropTypes } from "../domain/terms";
import ErrorView from "./ErrorView";

const TermDetailCardPropTypes = {
    pydictionary: PropTypes.any,
    thesaurus: PropTypes.any,
    collegiate: PropTypes.any,
    term: TermPropTypes
};

type TermDetailCardProps = InferProps<typeof TermDetailCardPropTypes>;

class TermDetailCard extends Component<TermDetailCardProps, any> {
    static propTypes = TermDetailCardPropTypes;
    _renderHeader(item: any, expanded: boolean) {
        return (
            <View
                style={{
                    flexDirection: "row",
                    padding: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#A9DAD6"
                }}
            >
                <Text style={{ fontWeight: "600" }}>
                    {item.functional_label} - {item.headword}{" "}
                    {item.offensive ? <Text>(offensive)</Text> : null}
                </Text>
                {expanded ? (
                    <Icon style={{ fontSize: 18 }} name="remove-circle" />
                ) : (
                        <Icon style={{ fontSize: 18 }} name="add-circle" />
                    )}
            </View>
        );
    }
    _renderContent(item: any) {
        const { pronounciations } = item;
        //console.log(item);
        return (
            <React.Fragment>
                <Text
                    style={{
                        backgroundColor: "#e3f1f1",
                        padding: 10,
                        fontStyle: "italic"
                    }}
                >
                    {item.short}
                </Text>
                {pronounciations
                    ? pronounciations.map((pronom: any, index: number) => (
                        <React.Fragment key={`${index}`}>
                            <Text>Pronounciation: {pronom.default}</Text>
                        </React.Fragment>
                    ))
                    : null}
            </React.Fragment>
        );
    }
    render() {
        const { term, pydictionary }: TermDetailCardProps = this.props;
        const { collegiate, thesaurus } = term;
        const { meaning } = pydictionary;

        const termName = term.term;
        return (
            <React.Fragment>
                <Content>
                    {meaning ? (
                        Object.keys(meaning).map(
                            (key: string, index: number) => {
                                const values: string[] =
                                    pydictionary.meaning[key];
                                return (
                                    <React.Fragment key={`${key}-${index}`}>
                                        <Title>{key}</Title>
                                        {values.map((description, index) => (
                                            <Card key={`card-${index}`}>
                                                <CardItem
                                                    key={`carditem-${index}`}
                                                >
                                                    <Text>{description}</Text>
                                                </CardItem>
                                            </Card>
                                        ))}
                                    </React.Fragment>
                                );
                            }
                        )
                    ) : (
                            <ErrorView error="Missing definition" />
                        )}
                    {collegiate ? (
                        <Card>
                            <Title>{"Collegiate (Merriam-Webster)"}</Title>
                            <CardItem>
                                <Accordion
                                    dataArray={collegiate}
                                    animation={true}
                                    expanded={true}
                                    renderHeader={this._renderHeader}
                                    renderContent={this._renderContent}
                                />
                            </CardItem>
                        </Card>
                    ) : null}
                    {thesaurus ? (
                        <Card>
                            <Title>{"Thesaurus (Merriam-Webster)"}</Title>
                            <CardItem>
                                <Accordion
                                    dataArray={thesaurus}
                                    animation={true}
                                    renderHeader={this._renderHeader}
                                    renderContent={this._renderContent}
                                    expanded={true}
                                />
                            </CardItem>
                        </Card>
                    ) : null}
                </Content>
            </React.Fragment>
        );
    }
}
export default connect<TermDetailCardProps>(
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
)(TermDetailCard);
