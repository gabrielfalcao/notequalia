# -*- coding: utf-8 -*-
import os
import time
import sys
import json
import socket
import click
import logging
import zmq
from pathlib import Path
from datetime import datetime
from zmq.devices import Device
from chemist import set_default_uri

# import from notequalia.api to cascade all route declarations
from notequalia.web import application

from notequalia import config
from notequalia.config import dbconfig
from notequalia.models import metadata, Term
from notequalia.worker.client import EchoClient
from notequalia.worker.server import EchoServer
from notequalia.es import es
from notequalia.filesystem import alembic_ini_path
from notequalia.logs import set_log_level_by_name, set_debug_mode
from notequalia import version
from notequalia import email
from notequalia import mailserver
from alembic.config import Config as AlembicConfig
from alembic import command as alembic_command


DEFAULT_ROUTER_PORT = os.getenv("ZMQ_ROUTER_PORT") or 4242
DEFAULT_ROUTER_HOST = os.getenv("ZMQ_ROUTER_HOST") or "0.0.0.0"

DEFAULT_ROUTER_ADDRESS = os.getenv("ZMQ_ROUTER_ADDRESS") or (
    f"tcp://{DEFAULT_ROUTER_HOST}:{DEFAULT_ROUTER_PORT}"
)

DEFAULT_DEALER_PORT = os.getenv("ZMQ_DEALER_PORT") or 6969
DEFAULT_DEALER_HOST = os.getenv("ZMQ_DEALER_HOST") or "0.0.0.0"

DEFAULT_DEALER_ADDRESS = os.getenv("ZMQ_DEALER_ADDRESS") or (
    f"tcp://{DEFAULT_DEALER_HOST}:{DEFAULT_DEALER_PORT}"
)

DEFAULT_PUBLISHER_PORT = os.getenv("ZMQ_PUBLISHER_PORT") or 5353
DEFAULT_PUBLISHER_HOST = os.getenv("ZMQ_PUBLISHER_HOST") or "0.0.0.0"

DEFAULT_PUBLISHER_ADDRESS = os.getenv("ZMQ_PUBLISHER_ADDRESS") or (
    f"tcp://{DEFAULT_PUBLISHER_HOST}:{DEFAULT_PUBLISHER_PORT}"
)

DEFAULT_SUBSCRIBER_PORT = os.getenv("ZMQ_SUBSCRIBER_PORT") or 5858
DEFAULT_SUBSCRIBER_HOST = os.getenv("ZMQ_SUBSCRIBER_HOST") or "0.0.0.0"

DEFAULT_SUBSCRIBER_ADDRESS = os.getenv("ZMQ_SUBSCRIBER_ADDRESS") or (
    f"tcp://{DEFAULT_SUBSCRIBER_HOST}:{DEFAULT_SUBSCRIBER_PORT}"
)


level_choices = click.Choice(
    ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"], case_sensitive=False
)


def check_db_connection(engine):
    url = engine.url
    logger.info(f"Trying to connect to DB: {str(url)!r}")
    result = engine.connect()
    logger.info(f"SUCCESS: {url}")
    result.close()


def check_database_dns():
    try:
        logger.info(f"Check ability to resolve name: {dbconfig.host}")
        host = socket.gethostbyname(dbconfig.host)
        logger.info(f"SUCCESS: {dbconfig.host!r} => {host!r}")
    except Exception as e:
        return e

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        logger.info(f"Checking TCP connection to {host!r}")
        sock.connect((host, int(dbconfig.port)))
        logger.info(f"SUCCESS: TCP connection to database works!!")
    except Exception as e:
        return e
    finally:
        sock.close()


logger = logging.getLogger("notequalia-io")


@click.group()
@click.option("--loglevel", default="INFO", type=level_choices)
@click.pass_context
def main(ctx, loglevel):
    "notequalia-io command-line manager"
    set_log_level_by_name(loglevel)
    ctx.obj = dict(engine=set_default_uri(dbconfig.sqlalchemy_url()))


@main.command(name="version")
def print_version():
    "prints the version to the STDOUT"
    print(f"notequalia-io {version} / {sys.platform}")


@main.command(name="purge-sessions")
def purge_session():
    if config.SESSION_TYPE == "filesystem":
        path = Path(config.SESSION_FILE_DIR)
        for path in path.glob("*"):
            path.unlink()
            print(f"deleted {path}")
    else:
        print("cannot purge session type {config.SESSION_TYPE}")


@main.command("check")
def check():
    "checks python installation"

    set_debug_mode()
    logger.info("Python installation works!")
    env = json.dumps(dict(os.environ), indent=4)
    logger.info(f"DATABASE HOSTNAME: {dbconfig.sqlalchemy_url()!r}")
    print(f"\033[1;33m{env}\033[0m")


@main.command("smtp")
@click.option(
    "--port",
    "-p",
    help="HTTP PORT",
    type=int,
    default=int(os.getenv("INBOX_PORT", 8825)),
)
@click.option(
    "--host", "-H", help="HTTP HOST", default=os.getenv("INBOX_HOST") or "0.0.0.0"
)
@click.option(
    "--debug",
    "-d",
    is_flag=True,
    help="enable debug mode (should not use in production)",
    default=True,
)
@click.pass_context
def run_smtp(ctx, host, port, debug):
    "runs the web server"
    debug = debug or bool(os.getenv("INBOX_DEBUG"))
    if debug:
        set_debug_mode()

    mailserver.run(host=host, port=port)


@main.command("web")
@click.option(
    "--port",
    "-p",
    help="HTTP PORT",
    type=int,
    default=int(os.getenv("FLASK_PORT", 5000)),
)
@click.option(
    "--host", "-H", help="HTTP HOST", default=os.getenv("FLASK_HOST") or "0.0.0.0"
)
@click.option(
    "--debug",
    "-d",
    is_flag=True,
    help="enable debug mode (should not use in production)",
    default=False,
)
@click.pass_context
def run_web(ctx, host, port, debug):
    "runs the web server"
    debug = debug or bool(os.getenv("FLASK_DEBUG"))
    if debug:
        set_debug_mode()

    application.run(debug=debug, host=host or None, port=port)


@main.command("check-db")
@click.pass_context
def check_db(ctx):
    "checks if the application can connect to the configured db"

    set_debug_mode()

    error = check_database_dns()
    if error:
        logger.error(f"could not resolve {dbconfig.host!r}: {error}")
        raise SystemExit(1)

    engine = ctx.obj["engine"]
    check_db_connection(engine)


@main.command("migrate-db")
@click.option("--target", default="head")
@click.option("--drop/--no-drop", default=False)
@click.pass_context
def migrate_db(ctx, drop, target):
    "runs the migrations"

    set_debug_mode()
    error = check_database_dns()
    if error:
        logger.error(f"could not resolve {dbconfig.host!r}: {error}")
        raise SystemExit(1)

    alembic_cfg = AlembicConfig(str(alembic_ini_path))
    alembic_cfg.set_section_option(
        "alembic", "sqlalchemy.url", dbconfig.sqlalchemy_url()
    )
    alembic_command.upgrade(alembic_cfg, target)
    delete_invalid_terms()


def delete_invalid_terms():
    for term in Term.all():
        if not term.term:
            print(f"deleting term {term}: {term.delete()}")


@main.command("worker")
@click.option(
    "--address",
    "-c",
    help="the zeromq address of the router",
    default=DEFAULT_DEALER_ADDRESS,
)
@click.option(
    "--polling-timeout",
    help="in miliseconds. Lower times means faster responses, but more CPU consumption.",
    type=int,
    default=60000,
)
@click.pass_context
def worker(ctx, address, polling_timeout):
    "runs a worker"

    server = EchoServer(zmq_uri=address, polling_timeout=polling_timeout)
    server.run()


@main.command("enqueue", context_settings=dict(ignore_unknown_options=True))
@click.argument("data")
@click.option(
    "--address",
    "-p",
    help="the zeromq address of the router",
    default=DEFAULT_ROUTER_ADDRESS,
)
@click.option("--number", "-n", help="of attempts", type=int, default=5)
@click.option("--times", "-x", help="of execution", type=int, default=1)
@click.pass_context
def enqueue(ctx, address, data, number, times):
    "sends a message"

    client = EchoClient(zmq_uri=address)

    for x in range(1, times + 1):
        logger.warning(f"request {x}/{times}")
        for i in range(1, number + 1):
            response = client.request(data)
            if response:
                logger.info(f"received: {number}")
                break

            logger.warning(f"attempt {i}/{number}")


@main.command("queue")
@click.option(
    "--router",
    help="the zeromq address of the router",
    default=f"tcp://0.0.0.0:{DEFAULT_ROUTER_PORT}",
)
@click.option(
    "--dealer",
    help="the zeromq address of the dealer",
    default=f"tcp://0.0.0.0:{DEFAULT_DEALER_PORT}",
)
@click.pass_context
def queue(ctx, router, dealer):
    "runs a queue"

    device = Device(zmq.QUEUE, zmq.ROUTER, zmq.DEALER)
    device.setsockopt_in(zmq.IDENTITY, b"requester")
    device.setsockopt_out(zmq.IDENTITY, b"responder")
    device.bind_in(router)
    device.bind_out(dealer)
    logger.info(f"ROUTER: {router!r}")
    logger.info(f"DEALER: {dealer!r}")
    device.start()
    device.join()


@main.command("forwarder")
@click.option(
    "--publisher",
    help="the zeromq address of the publisher",
    default=f"tcp://0.0.0.0:{DEFAULT_PUBLISHER_PORT}",
)
@click.option(
    "--subscriber",
    help="the zeromq address of the subscriber",
    default=f"tcp://0.0.0.0:{DEFAULT_SUBSCRIBER_PORT}",
)
@click.pass_context
def forwarder(ctx, publisher, subscriber):
    "runs a pubsub forwarder"

    forwarder = Device(zmq.FORWARDER, zmq.PUB, zmq.SUB)
    forwarder.bind_in(publisher)
    forwarder.bind_out(subscriber)
    logger.info(f"PUBLISHER: {publisher!r}")
    logger.info(f"SUBSCRIBER: {subscriber!r}")
    forwarder.start()
    forwarder.join()


@main.command("close", context_settings=dict(ignore_unknown_options=True))
@click.option(
    "--address",
    "-p",
    help="the zeromq address of the router",
    default=DEFAULT_ROUTER_ADDRESS,
)
@click.pass_context
def close_server(ctx, address):
    "tells the RPC server to kill itself"

    client = EchoClient(zmq_uri=address)
    response = client.close_server()
    if response:
        logger.info(f"server responded: {response}")
    else:
        logger.warning(f"no response from server")


@main.command("index", context_settings=dict(ignore_unknown_options=True))
@click.argument("data")
@click.pass_context
def es_index(ctx, data):
    "tells the RPC server to kill itself"

    doc = {"author": os.environ["USER"], "text": data, "timestamp": datetime.now()}
    res = es.index(index="random-index", doc_type="cli", id=1, body=doc)
    print(res)
