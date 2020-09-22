import PropTypes, { InferProps } from "prop-types";
//import { AuthPropTypes } from "./auth";

export const ErrorPropTypes = PropTypes.shape({
    message: PropTypes.string
});
export type ErrorProps = InferProps<typeof ErrorPropTypes> | any;
