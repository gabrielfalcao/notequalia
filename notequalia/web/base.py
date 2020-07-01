# -*- coding: utf-8 -*-

from flask import render_template

from notequalia.logs import set_log_level_by_name
from notequalia.web.core import application

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
@application.route("/profile")
@application.route("/app")
@application.route("/app/<path:path>")
@application.route("/login")
@application.route("/logout")
@application.route("/oauth2/callback")
def index(path=None):
    return render_template("index.html")
