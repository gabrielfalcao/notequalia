import React, { Component } from "react";
import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
// import { Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
// import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";
// import ListGroup from "react-bootstrap/ListGroup";
// import ProgressBar from "react-bootstrap/ProgressBar";
// import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
// import { ComponentWithStore } from "../../ui";
import { AuthPropTypes } from "../../domain/auth";
import { UserProps } from "../../domain/users";
import { UsersReducerState } from "../../reducers/types";

import Error from "../../components/Error";
import { AdminAPIClient } from "../../networking";

const DeleteUserPropTypes = {
    addError: PropTypes.func,
    addUsers: PropTypes.func,
    deleteUser: PropTypes.func,
    auth: AuthPropTypes
};

type MatchParams = {
    id: string;
};

type DeleteUserProps =
    | (RouteComponentProps<MatchParams> & {
        users: UsersReducerState;
    } & InferProps<typeof DeleteUserPropTypes>)
    | any;

class DeleteUser extends Component<DeleteUserProps, UsersReducerState> {
    private api: AdminAPIClient;
    constructor(props: DeleteUserProps) {
        super(props);
        const { addError } = props;
        this.api = new AdminAPIClient(
            addError,
            props.auth.access_token.content
        );
    }

    deleteUser = (user: UserProps) => {
        const { fetchUsers } = this;
        const { history } = this.props;
        const { deleteUser }: DeleteUserProps = this.props;
        this.api.deleteUser(user.id, (user: UserProps) => {
            deleteUser(user);
            fetchUsers();
            history.goBack();
        });
    };
    public fetchUsers = () => {
        const { addUsers } = this.props;

        this.api.listUsers(addUsers);
    };

    render() {
        const { users, match }: DeleteUserProps = this.props;
        const { deleteUser } = this;

        if (!match) {
            return <Error message="failed to parse user name from url" />;
        }
        const { id } = match.params;
        const user: UserProps = users.by_id[id];

        if (!user) {
            return <Error message={`no user found with id ${id}`} />;
        }
        console.log("DeleteUser", users.by_id);
        if (!match) {
            return <Error message={JSON.stringify(users, null, 2)} />;
        }

        return (
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Confirm User Deletion</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                {`Are you sure you want to delete the user ${user.email} ?`}
                            </Modal.Body>

                            <Modal.Footer>
                                <Button
                                    onClick={() => {
                                        deleteUser(user);
                                    }}
                                    variant="danger"
                                >
                                    {"Yes, delete it"}
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
    connect<DeleteUserProps>(
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
            deleteUser: function(user: UserProps) {
                return {
                    type: "DELETE_USER",
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
    )(DeleteUser)
);
