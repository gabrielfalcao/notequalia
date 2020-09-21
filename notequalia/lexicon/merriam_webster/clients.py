import logging
import requests
from typing import Dict, Union, List


from collections import defaultdict
from notequalia import config
from notequalia.errors import NotequaliaException
from .models import Definition

# https://dictionaryapi.com/api/v3/references/thesaurus/json/eluded?key=
# https://dictionaryapi.com/api/v3/references/collegiate/json/eluded?key=

logger = logging.getLogger(__name__)


class MerriamWebsterAPIClientError(NotequaliaException):
    pass


class BaseClient(object):
    base_url: str
    config_key: str

    def __init__(self, key: str = None):
        self.key = key or getattr(config, self.config_key, None)
        self.http = requests.Session()
        self.http.params = {"key": str(self.key)}

    def get_definitions(self, term: str) -> Definition.List:
        url = self.base_url.format(term=term)
        try:
            response = self.http.get(url)
        except Exception as e:
            logger.exception(f"failed to retrieve term {term!r} via {url!r}")
            raise MerriamWebsterAPIClientError(
                f"failed to retrieve term {term!r} via {url!r}"
            )

        if response.status_code != 200:
            logger.warning(f"failed request {response.request}: {response}")
            return Definition.List([])

        try:
            return Definition.List(response.json())
        except Exception as e:
            return Definition.List([])


class CollegiateClient(BaseClient):
    base_url = "https://dictionaryapi.com/api/v3/references/collegiate/json/{term}"
    config_key = "MERRIAM_WEBSTER_DICTIONARY_API_KEY"


class ThesaurusClient(BaseClient):
    base_url = "https://dictionaryapi.com/api/v3/references/thesaurus/json/{term}"
    config_key = "MERRIAM_WEBSTER_THESAURUS_API_KEY"
