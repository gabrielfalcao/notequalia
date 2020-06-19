import PropTypes, { InferProps } from "prop-types";
//import { AuthPropTypes } from "./auth";

export const NotePropTypes = PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    markdown: PropTypes.string,
    metadata: PropTypes.shape({
        title: PropTypes.string,
        created_at: PropTypes.string,
        modified_at: PropTypes.string,
        uri_id: PropTypes.string
    }),

    children: PropTypes.array
});
export type NoteProps = InferProps<typeof NotePropTypes> | any;
