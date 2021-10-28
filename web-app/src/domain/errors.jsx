import PropTypes from "prop-types";
//import { AuthPropTypes } from "./auth";
export const ErrorPropTypes = PropTypes.shape({
	message: PropTypes.string,
	name: PropTypes.string,
	data: PropTypes.string,
	config: PropTypes.shape({
		url: PropTypes.string,
		method: PropTypes.string,
		data: PropTypes.string,
		headers: PropTypes.object,
	}),
});
