import React, { Component } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { AuthPropTypes } from "../domain/auth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const MindMapViewPropTypes = {
	setUser: PropTypes.func,
	auth: AuthPropTypes,
	graph: PropTypes.any,
	height: PropTypes.number,
	width: PropTypes.number,
};
class MindMapView extends Component {
	componentDidMount() {
		const context = d3.select(this.ref);
		const color = d3.scaleOrdinal(d3.schemeAccent);
		const simulation = d3
			.forceSimulation()
			.force(
				"link",
				d3.forceLink().id(function (d) {
					return d.id;
				})
			)
			.force("charge", d3.forceManyBody())
			.force(
				"center",
				d3.forceCenter(this.props.width / 2, this.props.height / 2)
			);
		let link = context
			.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(this.props.graph.links)
			.enter()
			.append("line")
			.attr("stroke-width", function (d) {
				return Math.sqrt(d.value);
			});
		const node = context
			.append("g")
			.attr("class", "nodes")
			.selectAll("circle")
			.data(this.props.graph.nodes)
			.enter()
			.append("circle")
			.attr("r", 5)
			.attr("fill", function (d) {
				return color(d.group.toString());
			})
			.call(
				d3
					.drag()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended)
			);
		node.append("title").text(function (d) {
			return d.id;
		});
		simulation.nodes(this.props.graph.nodes).on("tick", ticked);
		simulation.force("link").links(this.props.graph.links);
		function dragstarted(d) {
			if (!d3.event.active) {
				simulation.alphaTarget(0.3).restart();
			}
			d.fx = d.x;
			d.fy = d.y;
		}
		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}
		function dragended(d) {
			if (!d3.event.active) {
				simulation.alphaTarget(0);
			}
			d.fx = null;
			d.fy = null;
		}
		function ticked() {
			link.attr("x1", function (d) {
				return d.source.x;
			})
				.attr("y1", function (d) {
					return d.source.y;
				})
				.attr("x2", function (d) {
					return d.target.x;
				})
				.attr("y2", function (d) {
					return d.target.y;
				});
			node.attr("cx", function (d) {
				return d.x;
			}).attr("cy", function (d) {
				return d.y;
			});
		}
	}
	render() {
		return (
			<Container>
				<Row>
					<Col md={12}>
						<svg
							className="container"
							ref={(ref) => (this.ref = ref)}
							width={this.props.width}
							height={this.props.height}
						></svg>
					</Col>
				</Row>
			</Container>
		);
	}
}
MindMapView.defaultProps = {
	graph: {
		links: [],
		nodes: [],
	},
};
MindMapView.propTypes = MindMapViewPropTypes;
export default connect(
	(state) => {
		return { ...state };
	},
	{
		setUser: function (user) {
			return {
				type: "NEW_AUTHENTICATION",
				user,
			};
		},
	}
)(MindMapView);
