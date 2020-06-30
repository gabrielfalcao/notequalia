import PyDictionary.core as PD

PD.print = lambda *args, **kw: None

from typing import Dict, Union
from collections import defaultdict

from PyDictionary import PyDictionary

# https://dictionaryapi.com/api/v3/references/collegiate/json/test?key=234297ff-eb8d-49e5-94d6-66aec4c4b7e0
# https://dictionaryapi.com/api/v3/references/thesaurus/json/test?key=eb37bf1c-0f2a-4399-86b8-ba444a0a9fbb

class LexiconEngine(object):
    def __init__(self):
        self.dictionary = PyDictionary()

    def define_term(self, term: str) -> Dict[str, Union[dict, str]]:
        result = defaultdict(dict)
        result["pydictionary"]["googlemeaning"] = self.dictionary.googlemeaning(term)
        result["pydictionary"]["meaning"] = self.dictionary.meaning(term)
        result["pydictionary"]["synonym"] = self.dictionary.synonym(term)
        result["pydictionary"]["antonym"] = self.dictionary.antonym(term)
        return result
