import React, { Component, ChangeEvent } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes, { InferProps } from "prop-types";
import { withRouter, RouteComponentProps } from "react-router";

// import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { needs_login, AuthPropTypes } from "../../domain/auth";

import UserList from "./UserList";
import { AdminAPIClient } from "../../networking";
import { UserProps } from "../../domain/users";

const ManageUsersPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addUsers: PropTypes.func
};

type ManageUsersProps = InferProps<typeof ManageUsersPropTypes> &
    RouteComponentProps;
type ManageUsersState = {
    newUserEmail: string;
    newUserPassword: string;
};
class ManageUsers extends Component<ManageUsersProps, ManageUsersState> {
    private api: AdminAPIClient;
    static propTypes = ManageUsersPropTypes;

    constructor(props: ManageUsersProps) {
        super(props);
        this.state = {
            newUserEmail: "",
            newUserPassword: ""
        };
        const { addError } = props;
        this.api = new AdminAPIClient(addError);
    }

    public performManageUsers = () => { };

    public onSetNewUserEmail = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ newUserEmail: event.target.value });
    };
    public onSetNewUserPassword = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ newUserPassword: event.target.value });
    };
    public submitNewUser = () => {
        const { fetchUsers } = this;
        const { history }: ManageUsersProps = this.props;

        this.api.createUser(
            this.state.newUserEmail,
            this.state.newUserPassword,

            (user: UserProps) => {
                // update redux
                fetchUsers();
                history.push(`/.admin/users/view/${user.email}`);
            }
        );
    };
    public fetchUsers = () => {
        const { addUsers }: ManageUsersProps = this.props;

        this.api.listUsers(addUsers);
    };

    render() {
        const { auth } = this.props;
        if (needs_login(auth)) {
            return <Redirect to="/" />;
        }

        return (
            <Container>
                <Row>
                    <Col md={6}>
                        <Card bg="light" text="dark" className="mb-2">
                            <Card.Header>Create User</Card.Header>
                            <Card.Body>
                                <Form.Group controlId="formAdminCreateUser">
                                    <Form.Text className="text-muted">
                                        {"Email"}
                                    </Form.Text>

                                    <FormControl
                                        type="email"
                                        placeholder="foo@bar.com"
                                        onChange={this.onSetNewUserEmail}
                                        value={this.state.newUserEmail}
                                    />
                                    <Form.Text className="text-muted">
                                        {"Password"}
                                    </Form.Text>

                                    <FormControl
                                        type="password"
                                        onChange={this.onSetNewUserPassword}
                                        value={this.state.newUserPassword}
                                    />
                                </Form.Group>

                                <Button
                                    onClick={this.submitNewUser}
                                    variant="primary"
                                // disabled={!this.isTermValidForSubmission()}
                                >
                                    {"Create"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card bg="light" text="dark" className="mb-2">
                            <Card.Header>Users</Card.Header>
                            <Card.Body>
                                <UserList />
                            </Card.Body>
                        </Card>
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
            addUsers: function(users: UserProps[]) {
                return {
                    type: "ADD_USERS",
                    users
                };
            },
            addError: function(error: Error) {
                return {
                    type: "ADD_ERROR",
                    error
                };
            }
        }
    )(ManageUsers)
);
