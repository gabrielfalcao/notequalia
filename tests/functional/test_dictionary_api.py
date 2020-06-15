import json
from .helpers import web_test, vcr


@vcr.use_cassette("ap1/v1/dict/definitions/POST:201.yaml")
@web_test
def test_create_definition(context):
    ("POST on /api/v1/dict/definitions should return 201")

    # Given that I perform a POST /api/v1/dict/definitions
    response = context.http.post("/api/v1/dict/definitions", data=json.dumps({
        'term': 'inadvertently'
    }), headers={"Content-Type": "application/json"})

    # # When I check the response
    # response.headers.should.have.key("Content-Type").being.equal("application/json")

    # And check if the status was 201
    response.status_code.should.equal(201)

    # And it contains a definition
    json.loads(response.data).should.equal({'content': '{"pydictionary": {"googlemeaning": null, "meaning": {"Adverb": ["without knowledge or intention"]}, "synonym": null, "antonym": null}}', 'id': 1, 'parent_id': None, 'term': 'inadvertently'})
