import PyDictionary.core as PD

PD.print = lambda *args, **kw: None

import requests
from typing import Dict, Union, List

from collections import defaultdict
from notequalia import config
from PyDictionary import PyDictionary

# https://dictionaryapi.com/api/v3/references/thesaurus/json/eluded?key=eb37bf1c-0f2a-4399-86b8-ba444a0a9fbb
# might be too technical - https://dictionaryapi.com/api/v3/references/collegiate/json/eluded?key=234297ff-eb8d-49e5-94d6-66aec4c4b7e0


class MerriamWebsterAPIClient(object):
    def __init__(self, key: str = None):
        self.key = key or config.MERRIAM_WEBSTER_THESAURUS_API_KEY
        self.http = requests.Session()
        self.http.params = {"key": str(self.key)}
        self.thesaurus_url = (
            "https://dictionaryapi.com/api/v3/references/thesaurus/json/{term}"
        )

    def get_thesaurus_definitions(self, term: str) -> List[dict]:
        response = self.http.get(self.thesaurus_url.format(term=term))
        if response.status_code != 200:
            import ipdb

            ipdb.set_trace()

        data = response.json()
        return data


class PyDictionaryClient(object):
    def __init__(self):
        self.dictionary = PyDictionary()

    def define_term(self, term: str) -> Dict[str, Union[dict, str]]:
        result = {}
        result["meaning"] = self.dictionary.meaning(term)
        result["synonym"] = self.dictionary.synonym(term)
        result["antonym"] = self.dictionary.antonym(term)
        return result
