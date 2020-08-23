import PropTypes, { InferProps } from "prop-types";
//import { AuthPropTypes } from "./auth";

export const UserPropTypes = PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    requested_subscription_at: PropTypes.string,
    invited_at: PropTypes.string
});
export const AccessTokenPropTypes = PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
    scope: PropTypes.string,
    created_at: PropTypes.string,
    duration: PropTypes.number,
    user_id: PropTypes.string
});
export type UserProps = InferProps<typeof UserPropTypes> | any;
export type AccessTokenProps = InferProps<typeof AccessTokenPropTypes> | any;
