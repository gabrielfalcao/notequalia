import React, { Component } from "react";
// import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import Container from "react-bootstrap/Container";
import MindMap from "react-mindmap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { DEFAULT_MINDMAP } from "./map";

import {
    AuthProps
    //, Scope
} from "../auth";

type Note =
    | {
        name: string;
        markdown: string;
        metadata: any;
    }
    | any;

type MindMapViewProps =
    | {
        auth: AuthProps | any;
        note: Note | any;
    }
    | any;
interface MindMapViewActionProps {
    saveMap: () => void;
}
class MindMapView extends Component<MindMapViewProps, Note> {
    render() {
        return (
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <MindMap
                            nodes={DEFAULT_MINDMAP.nodes}
                            connections={DEFAULT_MINDMAP.connections}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect<MindMapViewProps & MindMapViewActionProps>(
    state => {
        return { ...state, auth: {} };
    },
    {
        saveMap: function(note: any) {
            return {
                type: "SAVE_MINDMAP",
                note
            };
        }
    }
)(MindMapView);
