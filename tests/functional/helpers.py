import shutil
import flask
import json
from vcr import VCR
from sure import scenario
from typing import List
from pathlib import Path
from notequalia.config import dbconfig
from notequalia.web import application
from notequalia.logs import set_debug_mode
from notequalia.models import User
from chemist import set_default_uri, metadata
from .client import JSONFlaskClient


functional_tests_path = Path(__file__).parent.absolute()
tests_path = functional_tests_path.parent
vcr = VCR(cassette_library_dir=str(functional_tests_path.joinpath(".cassetes")))


def supports_postgres():
    return shutil.which("initdb") is not None


def before_each_test(context):
    set_debug_mode()
    context.web = application
    context.http = JSONFlaskClient.from_app(application)
    if supports_postgres():
        context.engine = set_default_uri(dbconfig.sqlalchemy_url())
        args = (context.engine,)
    else:
        context.engine = None
        args = ()

    metadata.drop_all(*args)
    metadata.create_all(*args)

    with context.http.session_transaction() as session:
        session["user"] = {"user": {"name": "foo bar"}}


def after_each_test(context):
    if context.engine:
        metadata.drop_all(context.engine)


def inject_user_and_token(context):
    context.password = "_^0123aBcD#$"
    context.user = User.create("injected@test.com", context.password)
    context.access_token = context.user.create_token(
        scope="manage:notes manage:terms admin:user admin"
    )
    context.http = JSONFlaskClient.from_app(
        context.web, bearer_token=context.access_token.content
    )


web_test = scenario(before_each_test, after_each_test)
auth_web_test = scenario([before_each_test, inject_user_and_token], after_each_test)


def response_errors_for_field(response: flask.Response, field: str) -> str:
    data = json.loads(response.data)
    data.should.have.key("message")
    message = data["message"]
    assert field in str(data), f"{field!r} is not present in {message!r}"
    return message


def response_matches_status(response: flask.Response, status: int) -> dict:
    assert (
        response.status_code == status
    ), f"{response}\nexpected status code {status} but got {response.status_code}\n{response.json!s}"
    if response.data and "json" in (response.headers.get("Content-Type") or ""):
        return response.json

    return {}
