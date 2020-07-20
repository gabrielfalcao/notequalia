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

logger = logging.getLogger(__name__)


auth_json = api.model(
    "AccessToken",
    {
        "access_token": fields.String(),
        "duration": fields.String(),
        "created_at": fields.String(),
    },
)

auth_ns = api.namespace(
    "Auth API V1", description="Authentication API", path="/api/v1/auth",
)



parser_auth = reqparse.RequestParser()
parser_auth.add_argument("email", type=inputs.email(check=True), required=True)
parser_auth.add_argument("password", type=password_input, required=True)


@auth_ns.route("/")
class TokenEndpoint(Resource):

    def prepare_auth_params(self):
        email = api.payload.get("email")
        password = api.payload.get("password")
        return {"email": email, "password": password}

    @auth_ns.expect(parser_auth, validate=True)
    @auth_ns.marshal_with(auth_json)
    def post(self):
        params = self.prepare_auth_params()
        auth_user = User.authenticate(**params)
        if not auth_user:
            return {'error': "user not found"}, 404

        token = auth_user.create_token(duration=300)

        return token.to_dict(), 200
