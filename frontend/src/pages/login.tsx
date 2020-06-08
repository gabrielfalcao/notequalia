import React, { Component } from "react";
// import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import Container from "react-bootstrap/Container";
// import * as toastr from "toastr";
import { Redirect } from "react-router-dom";
// import { LinkContainer } from "react-router-bootstrap";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { needs_login } from "../auth";
type LoginProps = {
    setUser: any;
};
type LoginState = {
    user: any;
};

class Login extends Component<LoginProps, LoginState> {
    public login = () => {
        // dummy login
        this.props.setUser({
            scope: "notes:write notes:read",
            user: { email: "johndoe@mail.visualcu.es" },
            access_token: "FAKETOKEN",
            profile: {
                preferred_username: "John Doe"
            }
        });
    };

    render() {
        const { auth }: any = this.props;
        if (!needs_login(auth)) {
            return <Redirect to="/" />;
        }
        return (
            <Container fluid="md">
                <Row>
                    <Col md={12}>
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Login</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <p>
                                    This is a dummy login for now, just click
                                    login.
								</p>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button onClick={this.login} variant="success">
                                    Proceed
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
        setUser: function(user: any) {
            return {
                type: "NEW_AUTHENTICATION",
                user
            };
        }
    }
)(Login);
