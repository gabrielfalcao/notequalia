import PropTypes, { InferProps } from "prop-types";
//import { AuthPropTypes } from "./auth";

export const TermPropTypes = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    term: PropTypes.string,
    content: PropTypes.object,
    thesaurus: PropTypes.array,
    collegiate: PropTypes.array,
    children: PropTypes.array
});
export type TermProps = InferProps<typeof TermPropTypes> | any;
