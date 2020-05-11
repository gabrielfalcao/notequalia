from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask_session import Session

from authlib.integrations.flask_client import OAuth

from loginpass import create_flask_blueprint
from loginpass import Google

from cahoots.filesystem import templates_path, static_path

params = {
    "template_folder": str(templates_path),
    "static_url_path": "/static/",
    "static_folder": str(static_path),
}

application = Flask(__name__, **params)
application.config.from_object("cahoots.config")

cors = CORS(application, resources="*")

session_manager = Session(application)

oauth = OAuth(application)


def handle_authorize(remote, token, user_info):
    print(user_info)
    return jsonify(user_info)


google = create_flask_blueprint(Google, oauth, handle_authorize)
application.register_blueprint(google, url_prefix="/google")

# oauth.register(
#     name='github',
#     client_id='{{ your-twitter-consumer-key }}',
#     client_secret='{{ your-twitter-consumer-secret }}',
#     request_token_url='https://api.twitter.com/oauth/request_token',
#     request_token_params=None,
#     access_token_url='https://api.twitter.com/oauth/access_token',
#     access_token_params=None,
#     authorize_url='https://api.twitter.com/oauth/authenticate',
#     authorize_params=None,
#     api_base_url='https://api.twitter.com/1.1/',
#     client_kwargs=None,
# )
