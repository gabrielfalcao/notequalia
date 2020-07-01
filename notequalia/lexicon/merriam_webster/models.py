"""data models for the `Merriam-Webster API <https://dictionaryapi.com/products/json>`_
"""
import re
from typing import List, Optional, Dict, Tuple, Any
from uiclasses import Model, IterableCollection, ModelList, ModelSet
from uiclasses.typing import Getter
from uiclasses.collections import COLLECTION_TYPES

Serializable = (Model,) + tuple(COLLECTION_TYPES.values())


def is_serializable(value) -> bool:
    if not isinstance(value, type):
        return False
    if not issubclass(value, Serializable):
        return False

    return isinstance(value, Serializable)


class EntryMetadata(Model):
    """represents `Entry Metadata <https://dictionaryapi.com/products/json#sec-2.meta>`_
    """

    id: str
    uuid: str
    section: str
    sort: str
    stems: List[str]
    offensive: bool



class Sound(Model):
    """represents `Sound <https://dictionaryapi.com/products/json#sec-2.prs>`_
    """

    filename: str
    subdirectory: str



    @property
    def filename(self) -> str:
        return self.get("audio") or ""

    @property
    def subdirectory(self) -> str:
        if self.filename.startswith("bix"):
            return "bix"
        if self.filename.startswith("gg"):
            return "gg"
        if re.search(r"^\w", self.filename):
            return self.filename[0]
        return "number"


class Pronounciation(Model):
    """represents `Pronounciations <https://dictionaryapi.com/products/json#sec-2.prs>`_
    """

    default: str
    label_before: str
    label_after: str
    punctuation: str
    audio_url: str
    sound: Getter[Sound]

    @property
    def sound(self) -> Sound:
        params = self.get("sound") or {}
        return Sound(**params)

    @property
    def default(self) -> str:
        return self.get("mw")

    @property
    def label_before(self) -> str:
        return self.get("l")

    @property
    def label_after(self) -> str:
        return self.get("l2")

    @property
    def punctuation(self) -> str:
        return self.get("pun")

    @property
    def audio_url(self) -> Optional[str]:
        if not self.sound.filename:
            return

        params = {"language_code": "en", "country_code": "US", "format": "wav"}
        params.update(self.sound.to_dict())
        url = "https://media.merriam-webster.com/audio/prons/{language_code}/{country_code}/{format}/{subdirectory}/{filename}.{format}".format(
            **params
        )
        return url

    def to_html(self):
        # check recommendations for format in https://dictionaryapi.com/products/json#sec-2.prs
        return f"<em>{this.label_after}</em>"


class Inflection(Model):
    """represents `Pronounciations <https://dictionaryapi.com/products/json#sec-2.ins>`
    """

    default: str
    cutback: str
    label: str
    pronounciations: Pronounciation.List
    sense_specific_label: str

    @property
    def sense_specific_label(self) -> str:
        # https://dictionaryapi.com/products/json#sec-2.spl
        return self.get("spl")

    @property
    def pronounciations(self) -> Pronounciation.List:
        return self.get("prs")

    @property
    def default(self) -> str:
        return self.get("if")

    @property
    def cutback(self) -> str:
        return self.get("ifc")

    @property
    def label(self) -> str:
        return self.get("il")


class HeadwordInformation(Model):
    """represents `Homographs <https://dictionaryapi.com/products/json#sec-2.hwi>`_
    """

    headword: str
    pronounciations: Pronounciation.List

    @property
    def headword(self) -> str:
        return self.get("hw")

    @property
    def pronounciations(self) -> Pronounciation.List:
        return self.get("prs")



class Variant(Model):
    """represents `Variants <https://dictionaryapi.com/products/json#sec-2.vrs>`_
    """

    name: str
    pronounciations: Pronounciation.List
    sense_specific_label: str

    @property
    def name(self) -> str:
        return self.get("va")

    @property
    def sense_specific_label(self) -> str:
        # https://dictionaryapi.com/products/json#sec-2.spl
        return self.get("spl")

    @property
    def pronounciations(self) -> Pronounciation.List:
        return self.get("prs")



class Definition(Model):
    """represents `Definition <https://dictionaryapi.com/products/json#sec-2>`_
    """

    functional_label: str
    offensive: bool
    stems: List[str]
    short: List[str]
    homograph: int
    headword: str
    variants: Variant.List
    pronounciations: Pronounciation.List
    inflections: Inflection.List

    labels: List[str]
    status_labels: List[str]

    @property
    def short(self) -> List[str]:
        return self.get("shortdef")

    @property
    def labels(self) -> List[str]:
        return self.get("lbs")

    @property
    def status_labels(self) -> List[str]:
        return self.get("sls")

    @property
    def regional_label(self) -> str:
        return self.get("psl")

    @property
    def functional_label(self) -> str:
        return self.get("fl")

    @property
    def meta(self) -> EntryMetadata:
        params = self.get("meta") or {}
        return EntryMetadata(**params)

    @property
    def hwi(self) -> HeadwordInformation:
        params = self.get("hwi") or {}
        return HeadwordInformation(**params)

    @property
    def variants(self) -> Variant.List:
        return self.get("vrs")

    @property
    def homograph(self) -> int:
        return self.get("hom")

    @property
    def headword(self) -> str:
        return self.hwi.headword

    @property
    def pronounciations(self) -> Pronounciation.List:
        return self.hwi.pronounciations

    @property
    def inflections(self) -> Inflection.List:
        return self.hwi.inflections

    @property
    def offensive(self) -> bool:
        return self.meta.offensive

    @property
    def stems(self) -> List[str]:
        return self.meta.stems

    def to_dict(self, **kw):
        return self.serialize(only_visible=True)


class ThesaurusDefinition(Definition):
    """responsible for modeling a `Definition within the Thesaurus Dictionary <https://dictionaryapi.com/products/json#sec-3>`_
    of the `Merriam-Webster API <https://dictionaryapi.com/products/json>`_
    """
