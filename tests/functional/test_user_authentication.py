# import vcr
import json
from .helpers import web_test
from .helpers import response_errors_for_field, response_matches_status
from notequalia.models import User


@web_test
def test_authenticate_success(context):
    ("POST on /api/v1/auth should return 200 with a token")

    params = {"email": "chuck@norris.com", "password": "I+:El_3366hLaH|Bh%Q'`"}
    # Given that a user exists
    User.create(**params)

    # And that I try to authenticate with the same email and password
    response = context.http.post("/api/v1/auth/", json=params)

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal("application/json")

    # And check if the status was 200
    data = response_matches_status(response, 200)

    data.should.be.a(dict)
    data.should.have.key("access_token").not_being.empty
