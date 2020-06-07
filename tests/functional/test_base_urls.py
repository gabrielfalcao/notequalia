from .helpers import web_test


@web_test
def test_logout(context):
    ("GET on /logout should return 302")

    # Given that I perform a GET /logout
    response = context.http.get("/logout")

    # And check if the status was 200
    response.status_code.should.equal(200)

    response.headers.should.have.key("Set-Cookie").being.match("session=.*")
