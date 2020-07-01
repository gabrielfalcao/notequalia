import json
import shutil
from functools import wraps
from sure import scenario
from pathlib import Path


unit_tests_path = Path(__file__).parent.absolute()
tests_path = unit_tests_path.parent
fixtures_path = tests_path.joinpath('.fixtures/merriam-webster-api')

CACHE = {}

def with_merriam_webster_fixture(path: str):
    location = fixtures_path.joinpath(path)
    assert location.exists(), f'{location} does not exist'
    assert location.is_file(), f'{location} is not a file'

    parsed = CACHE.get(path)
    if not parsed:
        with location.open('r') as fd:
            raw = fd.read()
            CACHE[path] = parsed = json.loads(raw)

    def dec(func):
        @wraps(func)
        def wrap(*args, **kwargs):
            return func(parsed, *args, **kwargs)

        return wrap

    return dec
