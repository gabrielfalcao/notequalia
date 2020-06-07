import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes, { InferProps } from "prop-types";

import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { needs_login, AuthProps } from "../auth";
// import { ComponentWithStore } from "../ui";

const LogoutPropTypes = {
    logout: PropTypes.func,
    auth: PropTypes.shape({
        scope: PropTypes.string,
        access_token: PropTypes.string,
        id_token: PropTypes.string,
        refresh_token: PropTypes.string,
        profile: PropTypes.shape({
            preferred_username: PropTypes.string
        })
    })
};

type LogoutProps = AuthProps | InferProps<typeof LogoutPropTypes> | any;

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
