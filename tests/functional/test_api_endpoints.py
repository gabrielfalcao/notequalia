# import vcr
import json
from .helpers import web_test


@web_test
def test_list_notes(context):
    ("GET on /api/v1/notes should return 200")

    # Given that I perform a GET /api/v1/notes/note
    response = context.http.get("/api/v1/notes/")

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal("application/json")

    # And check if the status was 401
    response.status_code.should.equal(200)


@web_test
def test_create_note_without_authentication(context):
    ("POST on /api/v1/notes should return a json ")

    # Given that I perform a POST /api/v1/notes/note
    response = context.http.post(
        "/api/v1/notes/",
        data=json.dumps(
            {"name": "test create note 1", "content": json.dumps({"some": "data"})}
        ),
        headers={"Content-Type": "application/json"},
    )

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal("application/json")

    # And check if the status was 201
    response.status_code.should.equal(201)
