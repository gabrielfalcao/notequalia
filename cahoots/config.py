import os
import redis
from pathlib import Path

module_path = Path(__file__).parent

current_working_path = Path(os.getcwd()).expanduser().absolute()

DEFAULT_UPLOAD_PATH = current_working_path.joinpath("cahoots-in-uploads")
APP_URL_EXTERNAL = os.getenv("APP_URL_EXTERNAL") or "https://pron-f1l3-serv3r.ngrok.io/"

REDIS_HOST = os.getenv("REDIS_HOST")
if REDIS_HOST:
    SESSION_TYPE = "redis"
    SESSION_REDIS = redis.Redis(
        host=REDIS_HOST or "localhost", port=int(os.getenv("REDIS_PORT") or 6379), db=0
    )
else:
    SESSION_TYPE = "filesystem"

# set this to true when serving the application via HTTPS or else the
# flask-restful routes won't show up on swagger.
HTTPS_API = os.getenv("HTTPS_API")

SECRET_KEY = b"//>;,;42zy_{lz@eat-m00r3-AsS)f:P128<\\"
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER") or str(DEFAULT_UPLOAD_PATH)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


class dbconfig:
    host = os.getenv("POSTGRES_HOST") or "localhost"
    port = int(os.getenv("POSTGRES_PORT") or 5432)
    username = os.getenv("POSTGRES_USERNAME") or "cahoots_in"
    password = os.getenv("POSTGRES_PASSWORD") or "Wh15k3y"
    database = os.getenv("POSTGRES_DATABASE") or "cahoots_in"
    auth = os.getenv("POSTGRES_AUTH") or (
        password and f"{username}:{password}" or username
    )
    domain = os.getenv("POSTGRES_DOMAIN") or f"{host}:{port}"

    @classmethod
    def sqlalchemy_url(config):
        return "/".join(
            [
                f"postgresql+psycopg2:/",
                f"{config.auth}@{config.domain}",
                f"{config.database}",
            ]
        )
