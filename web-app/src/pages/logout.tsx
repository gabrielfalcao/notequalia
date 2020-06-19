import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes, { InferProps } from "prop-types";

import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { needs_login, AuthPropTypes } from "../domain/auth";

const LogoutPropTypes = {
    logout: PropTypes.func,
    auth: AuthPropTypes
};

type LogoutProps = InferProps<typeof LogoutPropTypes>;

class Logout extends Component<LogoutProps> {
    static propTypes = LogoutPropTypes;

    constructor(props: LogoutProps) {
        super(props);
        this.state = {};
    }

    public performLogout = () => {
        this.props.logout();
    };

    render() {
        const { auth } = this.props;
        if (needs_login(auth)) {
            return <Redirect to="/" />;
        }

        return (
            <Container fluid="md">
                <Row>
                    <Col md={12}>
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>
                                    Do you really wish to logout?
								</Modal.Title>
                            </Modal.Header>

                            <Modal.Footer>
                                <Button
                                    onClick={this.performLogout}
                                    variant="danger"
                                >
                                    Logout
								</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default connect(
    state => {
        return { ...state };
    },
    {
        logout: function() {
            return {
                type: "LOGOUT"
            };
        }
    }
)(Logout);
