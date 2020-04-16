from flask import Flask
from flask_cors import CORS
from flask_session import Session

from cahoots.filesystem import templates_path


params = {
    "template_folder": templates_path,
    "static_url_path": "",
    "static_folder": "web/static",
}

application = Flask(__name__, **params)
application.config.from_object("cahoots.config")

cors = CORS(application, resources="/*")

session_manager = Session(application)
