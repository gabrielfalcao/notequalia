# -*- coding: utf-8 -*-
import time
import logging
import coloredlogs

__INSTALLED = {}

CHATTY_LOGGER_NAMES = ["vcr", "urllib3"]

__LEVEL_STYLES = {
    "critical": {"color": "red", "bold": True},
    "debug": {"color": "green"},
    "error": {"color": "red"},
    "info": {},
    "notice": {"color": "magenta"},
    "spam": {"color": "green", "faint": True},
    "success": {"color": "green", "bold": True},
    "verbose": {"color": "blue"},
    "warning": {"color": "yellow"},
}
__FIELD_STYLES = {
    "asctime": {"color": "green"},
    "hostname": {"color": "magenta"},
    "levelname": {"color": "black", "bold": True},
    "name": {"color": "blue"},
    "programname": {"color": "cyan"},
}


def install(levelname):
    if __INSTALLED:
        return

    params = dict(
        fmt="[%(asctime)s] %(name)s %(levelname)s %(message)s",
        level_styles=__LEVEL_STYLES,
        field_styles=__FIELD_STYLES,
    )
    coloredlogs.install(levelname, **params)
    __INSTALLED[levelname] = time.time()
    mute_chatty_loggers()


def set_log_level_by_name(loglevel: str, loggername=None):
    loglevel = loglevel.upper()
    install(loglevel)
    if loggername:
        logger = logging.getLogger(loggername)
    else:
        logger = logging.getLogger()

    logger.setLevel(getattr(logging, loglevel.upper(), logging.DEBUG))
    mute_chatty_loggers()
    return logger


def set_debug_mode():
    # logger = logging.getLogger()
    # logger.addHandler(logging.StreamHandler(sys.stderr))
    # return logger
    return set_log_level_by_name("DEBUG")


def mute_chatty_loggers():
    for chatty in CHATTY_LOGGER_NAMES:
        logging.getLogger(chatty).setLevel(logging.CRITICAL)
