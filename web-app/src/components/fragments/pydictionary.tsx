import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import ListGroup from "react-bootstrap/ListGroup";

const PyDictionaryFragmentPropTypes = {
    pydictionary: PropTypes.object
};

type PyDictionaryFragmentProps = InferProps<
    typeof PyDictionaryFragmentPropTypes
>;

class PyDictionaryFragment extends Component<PyDictionaryFragmentProps> {
    render() {
        const { pydictionary }: any = this.props;
        return (
            <React.Fragment>
                <td>
                    {pydictionary.meaning ? (
                        <ListGroup variant="flush">
                            {Object.keys(pydictionary.meaning).map(
                                (key: string, index: number) => {
                                    const values: string[] =
                                        pydictionary.meaning[key];
                                    return (
                                        <ListGroup.Item key={`${index}`}>
                                            <h4>{key}</h4>
                                            {values.map(
                                                (
                                                    description,
                                                    index: number
                                                ) => (
                                                        <ListGroup.Item
                                                            key={`${index}`}
                                                        >
                                                            <h5>{description}</h5>
                                                        </ListGroup.Item>
                                                    )
                                            )}
                                        </ListGroup.Item>
                                    );
                                }
                            )}
                        </ListGroup>
                    ) : null}
                </td>
            </React.Fragment>
        );
    }
}

export default connect(state => {
    return { ...state };
}, {})(PyDictionaryFragment);
