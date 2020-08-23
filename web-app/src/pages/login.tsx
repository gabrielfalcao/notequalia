import React, { Component, ChangeEvent } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";

import Container from "react-bootstrap/Container";
import { Redirect } from "react-router-dom";
// import { LinkContainer } from "react-router-bootstrap";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { needs_login, AuthPropTypes } from "../domain/auth";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { AuthAPIClient } from "../networking";
import { UserProps } from "../domain/users";

const LoginPropTypes = {
    addError: PropTypes.func,
    setUser: PropTypes.func,
    auth: AuthPropTypes
};

type LoginProps = InferProps<typeof LoginPropTypes> & RouteComponentProps;
type LoginState = {
    email: string;
    password: string;
};
class Login extends Component<LoginProps, LoginState> {
    private api: AuthAPIClient;
    static propTypes = LoginPropTypes;

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        const { addError } = props;
        this.api = new AuthAPIClient(addError);
    }

    public login = () => {
        const { setUser, history } = this.props;
        const { email, password } = this.state;
        this.api.authenticate(email, password, (user: UserProps) => {
            console.log(user);
            setUser({
                user: user
            });
            history.push(`/`);
        });
    };
    public onSetEmail = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: event.target.value });
    };
    public onSetPassword = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.target.value });
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
                                <Form.Group controlId="formLogin">
                                    <Form.Text className="text-muted">
                                        {"Email"}
                                    </Form.Text>

                                    <FormControl
                                        type="email"
                                        onChange={this.onSetEmail}
                                        value={this.state.email}
                                    />
                                    <Form.Text className="text-muted">
                                        {"Password"}
                                    </Form.Text>

                                    <FormControl
                                        type="password"
                                        onChange={this.onSetPassword}
                                        value={this.state.password}
                                    />
                                </Form.Group>
                            </Modal.Body>

                            <Modal.Footer className="text-center">
                                <Button onClick={this.login} variant="primary">
                                    {"Authenticate"}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(
    connect(
        state => {
            return { ...state };
        },
        {
            addError: function(error: Error) {
                return {
                    type: "ADD_ERROR",
                    error
                };
            },
            setUser: function(user: UserProps) {
                return {
                    type: "NEW_AUTHENTICATION",
                    user
                };
            }
        }
    )(Login)
);
