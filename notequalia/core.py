import os
import logging
from decorator import decorator

logger = logging.getLogger(__name__)


def initialize_gevent():
    if not os.getenv("GEVENT_DISABLED"):
        import gevent.monkey

        gevent.monkey.patch_all()
        logger.warning(f"gevent initialized")
    else:
        logger.warning(
            "GEVENT_DISABLED env var is set, gevent will not monkey-patch things"
        )


@decorator
def with_gevent(func, *args, **kw):
    initialize_gevent()
    return func(*args, **kw)
