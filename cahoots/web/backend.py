# -*- coding: utf-8 -*-
#

from pathlib import Path
from uiclasses import Model

# from uiclasses.typing import Property

from cahoots.logs import set_log_level_by_name

from cahoots import config

logger = set_log_level_by_name("DEBUG", __name__)

upload_path = Path(config.UPLOAD_FOLDER)


class File(Model):
    name: str
    size: int

    @classmethod
    def from_path(cls, path: Path):
        stat = path.stat()
        return cls(name=path.name, size=stat.st_size)


def list_files():
    return File.List(map(File.from_path, filter(lambda path: path.is_file(), upload_path.glob("*"))))
