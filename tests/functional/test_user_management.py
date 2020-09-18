# import vcr
import json
from .helpers import auth_web_test
from .helpers import response_errors_for_field, response_matches_status
from notequalia.models import User


# Deliberate Practice
@auth_web_test
def test_create_user_ok(context):
    ("POST on /api/v1/user should return 201")

    # Given that I perform a POST in /api/v1/user
    response = context.http.post("/api/v1/users/", json={
        "email": "chuck@norris.com",
        "password": "I+:El_3366hLaH|Bh%Q'`"
    })

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal(
        "application/json"
    )


    # And check if the status was 201
    assert response_matches_status(response, 201)

    # And a user should exist in the database
    found = User.authenticate('chuck@norris.com', "I+:El_3366hLaH|Bh%Q'`")
    found.should.be.a(User)
    found.email.should.equal('chuck@norris.com')


@auth_web_test
def test_create_user_missing_pw(context):
    ("POST on /api/v1/user with missing password should return 400")

    # Given that I perform a POST in /api/v1/user
    response = context.http.post("/api/v1/users/", json={
        "email": "chuck@norris.com",
    })

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal(
        "application/json"
    )

    # And check if the status was 400
    assert response_matches_status(response, 400)

    # And the response should have a meaningful message
    response_errors_for_field(response, "password").should.contain("'password' is a required property")


@auth_web_test
def test_create_user_short_pw(context):
    ("POST on /api/v1/user with short password should return 400")

    # Given that I perform a POST in /api/v1/user
    response = context.http.post("/api/v1/users/", json={
        "email": "chuck@norris.com",
        "password": "1234567",
    })

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal(
        "application/json"
    )

    # And check if the status was 400
    assert response_matches_status(response, 400)

    # And the response should have a meaningful message
    response_errors_for_field(response, "password").should.contain("should be at least 8 characters long.")


@auth_web_test
def test_create_user_weak_pw(context):
    ("POST on /api/v1/user with weak password should return 400")

    # Given that I perform a POST in /api/v1/user
    response = context.http.post("/api/v1/users/", json={
        "email": "chuck@norris.com",
        "password": "0123456789abcdef",
    })

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal(
        "application/json"
    )

    # And check if the status was 400
    assert response_matches_status(response, 400)

    # And the response should have a meaningful message
    response_errors_for_field(response, "password").should.contain("invalid password: should have at least one special character.")




@auth_web_test
def test_change_password_of_user(context):
    ("POST on /api/v1/user/<id>/change-password should return 200")

    # Given that a user exists
    created = User.create(email='foo@bar.com', password='aV2d5#5-dewf3')

    # And that I perform a POST in /api/v1/user
    response = context.http.post(f"/api/v1/users/{created.id}/change-password", json={
        "email": "foo@bar.com",
        "current_password": "aV2d5#5-dewf3",
        "new_password": "*8fbFAD__fdsf$",
        "confirm_new_password": "*8fbFAD__fdsf$",
    })

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal(
        "application/json"
    )

    # And check if the status was 200
    assert response_matches_status(response, 200)

    # And a user should exist in the database
    found = User.authenticate('foo@bar.com', "*8fbFAD__fdsf$")
    found.should.be.a(User)
    found.email.should.equal('foo@bar.com')


@auth_web_test
def test_get_user_by_email(context):
    ("GET on /api/v1/users/by-email?email=preexisting@email.com should return 200")

    # Given that a user exists with email preexisting@email.com
    created = User.create(email='preexisting@email.com', password='aV2d5#5-dewf3')

    # Given that I perform a GET in /api/v1/users/by-email?email=preexisting@email.com
    response = context.http.get(f"/api/v1/users/by-email?email=preexisting@email.com")

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal(
        "application/json"
    )

    # And check if the status was 200
    user = response_matches_status(response, 200)

    user.should.be.a(dict)
    user.should.have.key('email').being.equal('preexisting@email.com')


@auth_web_test
def test_delete_user_by_id(context):
    ("DELETE on /api/v1/users/<id> should return 204")

    # Given that a user exists with email preexisting@email.com
    created = User.create(email='preexisting@email.com', password='aV2d5#5-dewf3')

    # Given that I perform a DELETE in /api/v1/users?email=preexisting@email.com
    response = context.http.delete(f"/api/v1/users/{created.id}/")

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal(
        "application/json"
    )

    # And check if the status was 204
    response_matches_status(response, 204)

    # And the user should not be present in the database
    users = User.all()
    users.should.have.length_of(1)
    users[0].email.shouldnt.equal(created.email)


@auth_web_test
def test_list_users(context):
    ("GET on /api/v1/users should return 200")

    # Given that 3 users exist
    User.create(email='user1@email.com', password='aV2d5#5-dewf3')
    User.create(email='user2@email.com', password='aV2d5#5-dewf3')
    User.create(email='user3@email.com', password='aV2d5#5-dewf3')

    # When that I perform a GET in /api/v1/users
    response = context.http.get(f"/api/v1/users/")

    # When I check the response
    response.headers.should.have.key("Content-Type").being.equal(
        "application/json"
    )

    # And check if the status was 200
    result = response_matches_status(response, 200)

    # Then The result should be a list
    result.should.be.a(list)

    # And have 4 items
    result.should.have.length_of(4)
