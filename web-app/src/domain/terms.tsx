import PropTypes, { InferProps } from "prop-types";
//import { AuthPropTypes } from "./auth";

export const TermPropTypes = PropTypes.shape({
    id: PropTypes.string,
    term: PropTypes.string,
    content: PropTypes.string,
    children: PropTypes.array
});
export type TermProps = InferProps<typeof TermPropTypes> | any;
