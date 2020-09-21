import React, { Component } from "react";

import PropTypes, { InferProps } from "prop-types";
import { connect } from "react-redux";

import Table from "react-bootstrap/Table";
// import Alert from "react-bootstrap/Alert";

import { LinkContainer } from "react-router-bootstrap";

import Button from "react-bootstrap/Button";

import { AuthPropTypes } from "../../domain/auth";

import { UserProps } from "../../domain/users";
import { UsersReducerState, UserListState } from "../../reducers/types";
import { AdminAPIClient } from "../../networking";

// const x = { FormControl< "input" >}
export const UserListPropTypes = {
    auth: AuthPropTypes,
    addError: PropTypes.func,
    addUsers: PropTypes.func
};

type UserListProps =
    | (InferProps<typeof UserListPropTypes> & { users: UsersReducerState })
    | any;

class UserList extends Component<UserListProps, UserListState> {
    private api: AdminAPIClient;
    static propTypes = UserListPropTypes;
    constructor(props: UserListProps) {
        super(props);
        const { addError } = props;
        this.api = new AdminAPIClient(addError);
        this.api.setToken(props.auth.access_token.content);
    }

    public fetchUsers = () => {
        const { addUsers }: UserListProps = this.props;

        this.api.listUsers(addUsers);
    };

    componentDidMount() { }
    render() {
        const { users }: UserListProps = this.props;
        const { by_id } = users;
        const { fetchUsers } = this;
        const all: UserProps[] = Object.values(by_id);

        return (
            <React.Fragment>
                <Table responsive bordered hover>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {all.map((user: UserProps, index: number) => {
                            return (
                                <tr key={`${index}`}>
                                    <td>
                                        <h3>{user.email}</h3>
                                    </td>
                                    <td>
                                        <LinkContainer
                                            to={`/.admin/users/delete/${user.id}`}
                                        >
                                            <Button variant="danger">
                                                Delete{""}
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <Button
                    onClick={() => {
                        fetchUsers();
                    }}
                    variant="success"
                >
                    Fetch{""}
                </Button>
            </React.Fragment>
        );
    }
}

export default connect<UserListProps>(
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
)(UserList);
