from typing import Dict, Union
from collections import defaultdict
from PyDictionary import PyDictionary


class LexiconEngine(object):
    def __init__(self):
        self.dictionary = PyDictionary()

    def define_term(self, term: str) -> Dict[str, Union[dict, str]]:
        result = defaultdict(dict)
        result['pydictionary']['googlemeaning'] = self.dictionary.googlemeaning(term)
        result['pydictionary']['meaning'] = self.dictionary.meaning(term)
        result['pydictionary']['synonym'] = self.dictionary.synonym(term)
        result['pydictionary']['antonym'] = self.dictionary.antonym(term)
        return result
