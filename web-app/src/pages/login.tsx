import React, { Component, ChangeEvent } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import Container from "react-bootstrap/Container";
import { Redirect } from "react-router-dom";
// import { LinkContainer } from "react-router-bootstrap";

import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { needs_login, AuthPropTypes } from "../domain/auth";
import { AuthClient } from "../networking";

const LoginPropTypes = {
    addError: PropTypes.func,
    setUser: PropTypes.func,
    error: PropTypes.any,
    auth: AuthPropTypes
};

type LoginProps = InferProps<typeof LoginPropTypes>;

export type LoginState = {
    email: string;
    password: string;
};

class Login extends Component<LoginProps, LoginState> {
    private api: AuthClient;
    constructor(props: LoginProps) {
        super(props);
        const { addError } = props;
        this.api = new AuthClient(addError);
    }

    public login = () => {
        // const { setUser } = this.props;
        const { email, password } = this.state;
        this.api.authenticate(email, password, (data: any) => {
            console.log("SUCCESS LOGIN", data);
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
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            onChange={(
                                                event: React.ChangeEvent<
                                                    HTMLInputElement
                                                >
                                            ) => {
                                                this.setState({
                                                    email: event.target.value
                                                });
                                            }}
                                        />
                                        <Form.Text className="text-muted"></Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            onChange={(
                                                event: React.ChangeEvent<
                                                    HTMLInputElement
                                                >
                                            ) => {
                                                this.setState({
                                                    password: event.target.value
                                                });
                                            }}
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button onClick={this.login} variant="success">
                                    Proceed{""}
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
    (state: LoginState) => {
        return { ...state };
    },
    {
        setUser: function(user: any) {
            return {
                type: "NEW_AUTHENTICATION",
                user
            };
        },
        addError: function(error: Error) {
            return {
                type: "ADD_ERROR",
                error
            };
        }
    }
)(Login);
