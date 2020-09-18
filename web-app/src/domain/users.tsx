import PropTypes, { InferProps } from "prop-types";

export const AccessTokenPropTypes = PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    scope: PropTypes.string,
    created_at: PropTypes.string,
    duration: PropTypes.number,
    user_id: PropTypes.number
});

export const UserPropTypes = PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    requested_subscription_at: PropTypes.string,
    invited_at: PropTypes.string,
    access_token: AccessTokenPropTypes
});

export type UserProps = InferProps<typeof UserPropTypes> | any;
export type AccessTokenProps = InferProps<typeof AccessTokenPropTypes> | any;
