import PyDictionary.core as PD

PD.print = lambda *args, **kw: None

import requests
from typing import Dict, Union, List

from collections import defaultdict
from notequalia import config
from PyDictionary import PyDictionary
from notequalia.lexicon.merriam_webster.models import Definition
from notequalia.lexicon.merriam_webster.clients import CollegiateClient, ThesaurusClient


class MerriamWebsterAPIClient(object):
    def __init__(self):
        self.thesaurus = ThesaurusClient()
        self.collegiate = CollegiateClient()

    def get_thesaurus_definitions(self, term: str) -> List[dict]:
        return self.thesaurus.get_definitions(term)

    def get_collegiate_definitions(self, term: str) -> List[dict]:
        return self.collegiate.get_definitions(term)


class PyDictionaryClient(object):
    def __init__(self):
        self.dictionary = PyDictionary()

    def define_term(self, term: str) -> Dict[str, Union[dict, str]]:
        result = {}
        result["meaning"] = self.dictionary.meaning(term)
        return result
