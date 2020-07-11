import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes, { InferProps } from "prop-types";

import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { needs_login, AuthPropTypes } from "../domain/auth";
import NoteList from "../components/NoteList";
import TermList from "../components/TermList";
import TermSearch from "../components/TermSearch";

const DashboardPropTypes = {
    logout: PropTypes.func,
    purgeData: PropTypes.func,
    utilities: PropTypes.bool,
    auth: AuthPropTypes
};

type DashboardProps = InferProps<typeof DashboardPropTypes>;

class Dashboard extends Component<DashboardProps> {
    static propTypes = DashboardPropTypes;

    constructor(props: DashboardProps) {
        super(props);
        this.state = {};
    }

    public performDashboard = () => {
        this.props.logout();
    };

    render() {
        const { auth, purgeData, utilities } = this.props;
        if (needs_login(auth)) {
            return <Redirect to="/" />;
        }

        return (
            <Container>
                <Row>
                    {utilities ? (
                        <React.Fragment>
                            <Col md={6}>
                                <TermSearch />
                            </Col>

                            <Col md={6}>
                                <Card bg="light" text="dark" className="mb-2">
                                    <Card.Header>Utilities</Card.Header>
                                    <Card.Body>
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                purgeData();
                                            }}
                                        >
                                            Purge all data{" "}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </React.Fragment>
                    ) : null}

                    <Col md={12}>
                        <Card bg="light" text="dark" className="mb-2">
                            <Card.Header>Notes</Card.Header>
                            <Card.Body>
                                <NoteList />
                                <LinkContainer to="/notes/new">
                                    <Button variant="success">
                                        Add new Note{" "}
                                    </Button>
                                </LinkContainer>
                            </Card.Body>
                        </Card>
                    </Col>
                    {utilities ? (
                        <Col md={12}>
                            <Card bg="light" text="dark" className="mb-2">
                                <Card.Header>Lexicon</Card.Header>
                                <Card.Body>
                                    <TermList hideFunctionalLabels />
                                </Card.Body>
                            </Card>
                        </Col>
                    ) : null}
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
        },
        purgeData: function() {
            return {
                type: "PURGE_DATA"
            };
        }
    }
)(Dashboard);
