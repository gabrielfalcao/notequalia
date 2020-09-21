# -*- coding: utf-8 -*-
#
import logging
from flask_restplus import Api

from flask import url_for
from notequalia.utils import json_response
from notequalia.web.base import application

# from notequalia.web.core import ValidationError

from notequalia import config

# from notequalia.worker.client import EchoClient

# from notequalia.web.core import oidc

logger = logging.getLogger(__name__)


if config.HTTPS_API:

    # monkey-patch Flask-RESTful to generate proper swagger url
    @property
    def specs_url(self):
        """Monkey patch for HTTPS"""
        return url_for(self.endpoint("specs"), _external=True, _scheme="https")

    logger.warning(
        "monkey-patching swagger to support https " "(because HTTPS_API env var is set)"
    )
    Api.specs_url = specs_url


api = Api(application, doc="/api/")


@application.route("/health")
def get(*args, **kw):
    return json_response({"system": "ok"})


# @application.errorhandler(ValidationError)
# def handle_validation_error(e):
#     return json_response({"error": str(e)}, status=400)
