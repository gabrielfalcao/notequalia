import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { HotKeys, configure } from "react-hotkeys";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import ReactMediumEditor from "./ReactMediumEditor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/bootstrap.css";
const EvergreenNotePropTypes = {
	title: PropTypes.string,
	text: PropTypes.string,
	content: PropTypes.string,
	children: PropTypes.arrayOf(PropTypes.element),
};
configure({
	ignoreEventsCondition: (event) => {
		return false;
	},
});
class EvergreenNote extends Component {
	constructor(props) {
		super(props);
		this.keyMap = {
			SAVE_NOTE: "command+s",
		};
		this.titleRef = React.createRef();
		this.saveNote = (e) => {
			const { newTitle } = this.state;
			e.preventDefault();
			this.setState({ showToastSaveNote: true, title: newTitle });
		};
		this.onEditNote = (text, medium) => {
			this.setState({ text: text });
		};
		this.onEditTitle = (event) => {
			this.setState({ newTitle: this.titleRef.current.innerText });
		};
		this.state = {
			showToastSaveNote: false,
			title: props.title,
			newTitle: props.title,
			text: props.text,
		};
		this.keyBindings = {
			SAVE_NOTE: this.saveNote,
		};
	}
	render() {
		const { title } = this.state;
		return (
			<Col md={5} lg={4}>
				<Toast
					style={{ position: "absolute", zIndex: 10000000 }}
					show={this.state.showToastSaveNote}
					delay={2000}
					onClose={() => {
						this.setState({ showToastSaveNote: false });
					}}
					autohide
				>
					<Toast.Header>
						<strong className="mr-auto">Saving {title}</strong>
						<small>saving note</small>
					</Toast.Header>
					<Toast.Body
						dangerouslySetInnerHTML={{ __html: this.state.text }}
					/>
				</Toast>
				<HotKeys
					keyMap={this.keyMap}
					handlers={this.keyBindings}
					className="mt-3 border-right"
					style={{ height: "100%", position: "relative" }}
				>
					<h1
						contentEditable
						onKeyDown={this.onEditTitle}
						ref={this.titleRef}
						dangerouslySetInnerHTML={{ __html: title }}
					/>

					<ReactMediumEditor
						tag="article"
						text={this.state.text}
						onChange={this.onEditNote}
					/>
				</HotKeys>
			</Col>
		);
	}
}
EvergreenNote.propTypes = EvergreenNotePropTypes;
export default connect((state) => {
	return { ...state };
}, {})(EvergreenNote);
