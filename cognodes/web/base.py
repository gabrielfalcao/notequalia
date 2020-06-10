# -*- coding: utf-8 -*-

from flask import render_template

from cognodes.logs import set_log_level_by_name
from cognodes.web.core import application

# from cognodes import config


logger = set_log_level_by_name("DEBUG", __name__)


@application.route("/backend")
def backend():
    return render_template("token-debug.html")


@application.route("/")
@application.route("/admin")
@application.route("/notes")
@application.route("/profile")
@application.route("/app")
@application.route("/app/<path:path>")
@application.route("/login")
@application.route("/logout")
@application.route("/oauth2/callback")
def index(path=None):
    return render_template("index.html")
