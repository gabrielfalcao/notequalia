import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";

import {
    //    Container,
    Title,
    Content,
    Card,
    CardItem,
    Text
} from "native-base";

import { TermPropTypes } from "../domain/terms";
import ErrorView from "./ErrorView";

const TermDetailCardPropTypes = {
    pydictionary: PropTypes.any,
    term: TermPropTypes
};

type TermDetailCardProps = InferProps<typeof TermDetailCardPropTypes>;

export default class TermDetailCard extends Component<
    TermDetailCardProps,
    any
    > {
    static propTypes = TermDetailCardPropTypes;
    render() {
        const { pydictionary, term }: TermDetailCardProps = this.props;
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
                </Content>
            </React.Fragment>
        );
    }
}
