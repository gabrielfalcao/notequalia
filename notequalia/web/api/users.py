# -*- coding: utf-8 -*-
#
import logging
from flask import request
from flask_restplus import Resource
from flask_restplus import reqparse
from flask_restplus import inputs
from flask_restplus import fields

from notequalia.models import User
from .base import api

from .inputs import password as password_input
from .fields import EmailField, PasswordField
from .validation import validate_password, ValidationError
from .auth import require_auth

logger = logging.getLogger(__name__)


user_json = api.model(
    "User",
    {
        "id": fields.String(required=True),
        "username": fields.String(),
        "access_token": fields.String(),
        "email": EmailField(required=True, description="verifiable email address"),
    },
)


create_user_json = api.model(
    "UserCreation",
    {
        "email": EmailField(required=True, description="verifiable email address"),
        "password": PasswordField(required=True, description="strong password"),
    },
)
change_password_json = api.model(
    "ChangeUserPassword",
    {
        "current_password": PasswordField(required=True, description="current user password"),
        "new_password": PasswordField(required=True, description="strong password"),
        "confirm_new_password": PasswordField(required=True, description="confirm strong password"),
    },
)


parser_create = reqparse.RequestParser()
parser_create.add_argument("email", type=inputs.email(check=True), required=True)
parser_create.add_argument("password", type=password_input, required=True)

parser_retrieve_by_email = reqparse.RequestParser()
parser_retrieve_by_email.add_argument("email", type=inputs.email(check=True), required=True, location='args')

# parser.add_argument('session', location='cookies', help='the session id containing the state of authentication')

user_ns = api.namespace(
    "User API V1", description="Users API", path="/api/v1/users",
)


@user_ns.route("/by-email")
class UsersByEmailEndpoint(Resource):
    @require_auth(scope='admin:user')
    def get(self):
        query = parser_retrieve_by_email.parse_args()
        user = User.find_one_by(**query)
        if not user:
            return {'error': "user not found"}, 404

        return user.to_dict(), 200, {'Content-Type': 'application/json'}

@user_ns.route("/")
class UserListEndpoint(Resource):
    @require_auth(scope='admin:user')
    def get(self):
        user = User.all()
        return [u.to_dict() for u in user], 200

    def prepare_creation_params(self):
        email = api.payload.get("email")
        password = validate_password(api.payload.get("password"))
        return {"email": email, "password": password}

    @require_auth(scope='admin:user')
    @user_ns.expect(create_user_json, validate=False)
    @user_ns.expect(parser_create, validate=True)
    def post(self):
        params = self.prepare_creation_params()
        user = User.create(**params)
        return user.to_dict(), 201


@user_ns.route("/<int:user_id>/")
class ManageUserEndpoint(Resource):

    @require_auth(scope='admin:user')
    def delete(self, user_id):
        user = User.find_one_by(id=user_id)
        if not user:
            return {"error": "user not found"}, 404

        user.delete()
        return "", 204


@user_ns.route("/<int:user_id>/change-password")
class ChangeUserPasswordEndpoint(Resource):

    def prepare_params(self):
        email = api.payload.get("email")
        current_password = api.payload.get("current_password")
        new_password = api.payload.get("new_password")
        confirm_new_password = api.payload.get("confirm_new_password")
        if new_password != confirm_new_password:
            raise ValidationError('new_password', f'confirmation does not match')
        return {"old_password": current_password, "new_password": new_password}

    @user_ns.expect(change_password_json, validate=True)
    @require_auth(scope='admin:user')
    def post(self, user_id):
        user = User.find_one_by(id=user_id)
        if not user:
            return {"error": "user not found"}, 404

        params = self.prepare_params()

        if user.change_password(**params):
            return user.to_dict(), 200

        return {"error": "failed to change password"}, 400
