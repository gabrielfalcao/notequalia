import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Table from "react-bootstrap/Table";
// import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import { AuthPropTypes } from "../../domain/auth";
import { AdminAPIClient } from "../../networking";
// const x = { FormControl< "input" >}
export const UserListPropTypes = {
	auth: AuthPropTypes,
	addError: PropTypes.func,
	addUsers: PropTypes.func,
};
class UserList extends Component {
	constructor(props) {
		super(props);
		this.fetchUsers = () => {
			const { addUsers } = this.props;
			this.api.listUsers(addUsers);
		};
		const { addError } = props;
		this.api = new AdminAPIClient(
			addError,
			props.auth.access_token.content
		);
	}
	componentDidMount() {}
	render() {
		const { users } = this.props;
		const { by_id } = users;
		const { fetchUsers } = this;
		const all = Object.values(by_id);
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
						{all.map((user, index) => {
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
UserList.propTypes = UserListPropTypes;
export default connect(
	(state) => {
		return { ...state };
	},
	{
		addUsers: function (users) {
			return {
				type: "ADD_USERS",
				users,
			};
		},
		addError: function (error) {
			return {
				type: "ADD_ERROR",
				error,
			};
		},
	}
)(UserList);
