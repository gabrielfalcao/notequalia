import React, { Component } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { RouteComponentProps } from "react-router-dom";

class NotFound extends Component<RouteComponentProps> {
    render() {
        const { location }: RouteComponentProps = this.props;
        return (
            <Container fluid="md">
                <Row>
                    <Col md={12}>
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Not Found</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <p>
                                    No match for url{" "}
                                    <code>{location.pathname}</code>
                                </p>
                            </Modal.Body>

                            <Modal.Footer>
                                <p>
                                    <LinkContainer to="/">
                                        <Button>Back to dashboard</Button>
                                    </LinkContainer>
                                </p>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect(state => {
    return { ...state };
}, {})(NotFound);
