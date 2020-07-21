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
vcr = VCR(
    cassette_library_dir=str(functional_tests_path.joinpath(".cassetes"))
)


def supports_postgres():
    return dbconfig.host is not None and len(dbconfig.host) > 0


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
    context.password = '_^0123aBcD#$'
    context.user = User.create('injected@test.com', context.password)
    context.access_token = context.user.create_token()
    context.http = JSONFlaskClient.from_app(context.web, bearer_token=context.access_token.content)



web_test = scenario(before_each_test, after_each_test)
auth_web_test = scenario([before_each_test, inject_user_and_token], after_each_test)


def response_errors_for_field(response: flask.Response, field: str) -> List[str]:
    data = json.loads(response.data)
    data.should.have.key("errors")
    errors = data['errors']
    return errors[field]

def response_matches_status(response: flask.Response, status: int) -> bool:
    assert response.status_code == status, f'{response}\nexpected status code {status} but got {response.status_code}\n{response.json!s}'
    return response.json
