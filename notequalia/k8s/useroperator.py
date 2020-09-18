import kopf
import json
import asyncio
import logging
from notequalia.tools import create_user
from notequalia.models import User


logger = logging.getLogger(__name__)


def pretty_json(d):
    return json.dumps(dict(d), indent=4, default=str)


def get_credentials(spec: dict, require_password: bool = True):
    email = str(spec.get("email") or "")
    password = str(spec.get("password") or "")
    if not email:
        raise SyntaxError(f'missing "email" from spec')

    if require_password and not password:
        raise SyntaxError(f'missing "password" from spec')

    return email, password

def run():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(kopf.operator())

@kopf.on.login()
def login_fn(**kwargs):
    return kopf.login_via_client(**kwargs)

@kopf.on.create("cognod.es", "v1", "applicationauthusers")
def create_fn(body, spec, new, **kwargs):
    email, password = get_credentials(spec)
    user = create_user(email, password)
    if user:
        logger.info(f'created user {user}')
    else:
        raise kopf.PermanentError(f'failed to create user {spec}')

@kopf.on.update("cognod.es", "v1", "applicationauthusers")
def update_fn(body, spec, new, **kwargs):
    email, password = get_credentials(spec)
    user = update_user(email, password)
    if user:
        logger.info(f'updated user {user}')
    else:
        raise kopf.PermanentError(f'failed to update user {spec}')


@kopf.on.delete("cognod.es", "v1", "applicationauthusers")
def delete_fn(body, new, spec, **kwargs):
    email, _ = get_credentials(spec, require_password=False)

    user = User.find_one_by_email(email)
    if not user:
        raise kopf.PermanentError(f'user not found for email {email}')

    user.delete()
    logger.info(f'deleted user {user}')
