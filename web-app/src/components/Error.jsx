import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
const ErrorPropTypes = {
	message: PropTypes.string,
};
class Error extends Component {
	propTypes = ErrorPropTypes;
	render() {
		const { message } = this.props;
		return (
			<Container fluid="md">
				<Row>
					<Col md={12}>
						<Modal.Dialog>
							<Modal.Header>
								<Modal.Title>Error</Modal.Title>
							</Modal.Header>

							<Modal.Body>
								<Alert variant="danger">{message}</Alert>
							</Modal.Body>

							<Modal.Footer>
								<LinkContainer to="/">
									<Button variant="secondary">Go back</Button>
								</LinkContainer>
							</Modal.Footer>
						</Modal.Dialog>
					</Col>
				</Row>
			</Container>
		);
	}
}
export default connect((state) => {
	return { ...state };
}, {})(Error);
