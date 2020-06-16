import shutil
from vcr import VCR
from sure import scenario
from pathlib import Path
from notequalia.config import dbconfig
from notequalia.web import application
from notequalia.logs import set_debug_mode
from chemist import set_default_uri, metadata

functional_tests_path = Path(__file__).parent.absolute()
tests_path = functional_tests_path.parent
vcr = VCR(cassette_library_dir=str(functional_tests_path.joinpath(".cassetes")))


def supports_postgres():
    return shutil.which("initdb") is not None


def before_each_test(context):
    set_debug_mode()
    context.web = application
    context.http = context.web.test_client()
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


web_test = scenario(before_each_test, after_each_test)
