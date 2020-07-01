import requests
from typing import Dict, Union, List

from collections import defaultdict
from notequalia import config
from .models import Definition

# https://dictionaryapi.com/api/v3/references/thesaurus/json/eluded?key=eb37bf1c-0f2a-4399-86b8-ba444a0a9fbb
# https://dictionaryapi.com/api/v3/references/collegiate/json/eluded?key=234297ff-eb8d-49e5-94d6-66aec4c4b7e0


class BaseClient(object):
    base_url: str
    config_key: str

    def __init__(self, key: str):
        self.key = key or getattr(config, self.config_key, None)
        self.http = requests.Session()
        self.http.params = {"key": str(self.key)}

    def get_definitions(self, term: str) -> Definition.List:
        response = self.http.get(self.base_url.format(term=term))
        if response.status_code != 200:
            import ipdb

            ipdb.set_trace()

        data = response.json()
        return data


class DictionaryClient(object):
    base_url = "https://dictionaryapi.com/api/v3/references/dictionary/json/{term}"
    config_key = "MERRIAM_WEBSTER_DICTIONARY_API_KEY"


class ThesaurusClient(object):
    base_url = "https://dictionaryapi.com/api/v3/references/thesaurus/json/{term}"
    config_key = "MERRIAM_WEBSTER_THESAURUS_API_KEY"
