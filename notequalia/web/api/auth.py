# -*- coding: utf-8 -*-
import re
import logging
from decorator import decorator
from flask import request, g
from flask_restplus import Resource
from flask_restplus import reqparse
from flask_restplus import inputs
from flask_restplus import fields

from notequalia.models import User, AccessToken
from .base import api

from .inputs import password as password_input

logger = logging.getLogger(__name__)



@decorator
def require_auth(func, scope=None, *args, **kw):
    return func(*args, **kw)

    header = request.headers.get('Authorization', '')
    found = re.search(r'[bB]earer\s(?P<token>\S+)', header)

    token = AccessToken.find_one_by(content=found.group('token'))
    if token:
        g.user = token.user
        g.access_token = token
        return func(*args, **kw)

    return {'error': 'unauthorized'}, 401


authorization_parser = reqparse.RequestParser()
authorization_parser.add_argument("Authorization", required=False, location='headers')

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
    def post(self):
        params = self.prepare_auth_params()
        logger.info(f'auth request {params}')
        auth_user = User.find_one_by_email(email=params['email'])
        if not auth_user:
            return {'error': "user not found"}, 401

        if not auth_user.match_password(params['password']):
            return {'error': "invalid password"}, 401

        token = auth_user.create_token(duration=300)

        return token.to_dict(), 200
