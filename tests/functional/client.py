# -*- coding: utf-8 -*-

import os
import io
import json
import re
import traceback

from pathlib import Path
from flask.testing import FlaskClient


class JSONFlaskClient(FlaskClient):
    def __init__(self, *args, **kwargs):
        bearer_token = kwargs.pop('bearer_token', None)
        self.default_headers = {
            'Content-Type': 'application/json',
        }
        if bearer_token:
            self.default_headers['Authorization'] = f'Bearer {bearer_token}'

        super().__init__(*args, **kwargs)

    def open(self, *args, **kw):
        json_source = kw.pop("json", None)
        if json_source:
            kw["data"] = json.dumps(json_source)

        headers = self.default_headers.copy()
        headers.update(kw.pop('headers', {}))
        kw["headers"] = headers

        return super().open(*args, **kw)

    @classmethod
    def from_app(cls, app, **kwargs):
        return cls(app, app.response_class, **kwargs)
