import json
from notequalia.web.api.terms import define_new_term

from .helpers import auth_web_test, vcr


@vcr.use_cassette("ap1/v1/dict/definitions/POST:201.yaml")
@auth_web_test
def test_create_definition(context):
    ("POST on /api/v1/dict/definitions should return 201")

    # Given that I perform a POST /api/v1/dict/definitions
    response = context.http.post(
        "/api/v1/dict/definitions",
        data=json.dumps({"term": "inadvertently"}),
        headers={"Content-Type": "application/json"},
    )

    # # When I check the response
    # response.headers.should.have.key("Content-Type").being.equal("application/json")

    # And check if the status was 201
    response.status_code.should.equal(201)

    # And it contains a definition
    data = json.loads(response.data)
    data.should.have.key("content").being.a(dict)
    data.should.have.key("thesaurus").being.a(list)
    data.should.have.key("pydictionary").being.a(dict)


@vcr.use_cassette("ap1/v1/dict/definitions/POST:200.yaml")
@auth_web_test
def test_get_or_create_definition(context):
    ("POST on /api/v1/dict/definitions should return 200 when term already exists")

    # Given that a term exists in the database
    term, _ = define_new_term("rife")

    # When I perform a POST /api/v1/dict/definitions
    response = context.http.post(
        "/api/v1/dict/definitions",
        data=json.dumps({"term": "rife"}),
        headers={"Content-Type": "application/json"},
    )

    # Then the response should be 200
    response.status_code.should.equal(200)

    # And it contains the definition
    json.loads(response.data).should.equal(term.to_dict())


@vcr.use_cassette("ap1/v1/dict/definitions/GET:200.yaml")
@auth_web_test
def test_list_definitions(context):
    ("GET /api/v1/dict/definitions should return 200 with a list of definitions")

    # Given that there are 5 definitions in the database
    term, _ = define_new_term("ensue")
    term, _ = define_new_term("excise")
    term, _ = define_new_term("substrate")
    term, _ = define_new_term("prerogative")
    term, _ = define_new_term("rapport")

    # When I perform a GET on /api/v1/dict/definitions
    response = context.http.get("/api/v1/dict/definitions")

    # Then the response should be 200
    response.status_code.should.equal(200)

    # And it contains the 5 definitions
    result = json.loads(response.data)
    result.should.have.length_of(5)


@vcr.use_cassette("ap1/v1/dict/definitions/DELETE:200.yaml")
@auth_web_test
def test_delete_definitions(context):
    ("DELETE /api/v1/dict/definitions should return 204 with a list of definitions")

    # Given that there are 5 definitions in the database
    term, _ = define_new_term("ensue")
    term, _ = define_new_term("excise")
    term, _ = define_new_term("substrate")
    term, _ = define_new_term("prerogative")
    term, _ = define_new_term("rapport")

    # When I perform a DELETE one definition via URL
    response = context.http.delete("/api/v1/dict/term/prerogative")

    # # And I perform a DELETE one definition via body
    # response = context.http.delete("/api/v1/dict/definitions", data=json.dumps({"term": "substrate"}))

    # Then the response should be 204
    response.status_code.should.equal(204)
