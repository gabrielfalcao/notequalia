import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import {
    //    Container,
    Title,
    Content,
    Card,
    CardItem,
    Text
} from "native-base";

const ErrorPropTypes = {
    error: PropTypes.string
};

type ErrorProps = (InferProps<typeof ErrorPropTypes> & {}) | any;

class ErrorView extends Component<ErrorProps, any> {
    static propTypes = ErrorPropTypes;

    render() {
        const { error }: ErrorProps = this.props;
        return (
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Title>ErrorView</Title>
                    </CardItem>
                    <CardItem>
                        <Text>{error}</Text>
                    </CardItem>
                </Card>
            </Content>
        );
    }
}

export default connect<ErrorProps>((state: any) => {
    return { ...state };
}, {})(ErrorView);
