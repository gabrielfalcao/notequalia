# -*- coding: utf-8 -*-
import json
from flask import render_template, jsonify

from notequalia.logs import set_log_level_by_name
from notequalia.errors import NotequaliaException
from notequalia.web.core import application, ValidationError

# from notequalia import config


logger = set_log_level_by_name("DEBUG", __name__)


@application.route("/backend")
def backend():
    return render_template("token-debug.html")


@application.route("/")
@application.route("/admin")
@application.route("/notes")
@application.route("/dashboard")
@application.route("/notes/<path:path>")
@application.route("/terms/<path:path>")
@application.route("/profile")
@application.route("/app")
@application.route("/app/<path:path>")
@application.route("/login")
@application.route("/logout")
@application.route("/oauth2/callback")
def index(path=None):
    return render_template("index.html")



@application.errorhandler(ValidationError)
def handle_validation_error(error):
    return json.dumps({'errors': {error.field: error.message}}), 400, {'Content-Type': 'application/json'}


@application.errorhandler(NotequaliaException)
def handle_internal_error(error):
    return json.dumps({'errors': f"{error}"}), 419, {'Content-Type': 'application/json'}
