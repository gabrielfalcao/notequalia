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
        const termName = term.term;
        return (
            <React.Fragment>
                <Title>Term: "{termName}"</Title>
                <Content>
                    {Object.keys(pydictionary.meaning).map(
                        (key: string, index: number) => {
                            const values: string[] = pydictionary.meaning[key];
                            return (
                                <Card key={`${index}`}>
                                    <Title>{key}</Title>
                                    {values.map((description, index) => (
                                        <CardItem key={`${index}`}>
                                            <Text>{description}</Text>
                                        </CardItem>
                                    ))}
                                </Card>
                            );
                        }
                    )}
                </Content>
            </React.Fragment>
        );
    }
}
