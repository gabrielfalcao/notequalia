"""data models for the `Merriam-Webster API <https://dictionaryapi.com/products/json>`_
"""
import re
from itertools import chain
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

        params = {"language_code": "en", "country_code": "US", "format": "mp3"}
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


class CognateCrossReferenceTarget(Model):
    """represents a `Cognate Cross-Reference Target <https://dictionaryapi.com/products/json#sec-2.cxs>`_
    """

    label: str
    reference: str
    hyperlink_text: str
    sense_number: str

    @property
    def label(self) -> str:
        return self.get("cxl")

    @property
    def reference(self) -> str:
        return self.get("cxr")

    @property
    def hyperlink_text(self) -> str:
        return self.get("cxt")

    @property
    def sense_number(self) -> str:
        return self.get("cxn")


class CognateCrossReference(Model):
    """represents `Cognate Cross-Reference <https://dictionaryapi.com/products/json#sec-2.cxs>`_
    """

    label: str
    targets: CognateCrossReferenceTarget.List

    @property
    def label(self) -> str:
        return self.get("cxl")

    @property
    def targets(self) -> CognateCrossReferenceTarget.List:
        return CognateCrossReferenceTarget.List(self.get("cxtis") or [])


class UsageNotes(Model):
    """represents a `Usage Notes <https://dictionaryapi.com/products/json#sec-2.uns>`_
    """

    text: List[str]  # https://dictionaryapi.com/products/json#sec-2.fmttokens

    def __init__(self, __data__, *args, **kw):
        if isinstance(__data__, str):
            __data__ = {"text": __data__}
        elif isinstance(__data__, list):
            data = {}
            for sequence in __data__:
                for k, *v in sequence:
                    try:
                        data[k] = "\n".join(v)
                    except TypeError as e:
                        data[k] = VerbalIllustration.List(chain(*v))
            __data__ = data

        elif not isinstance(__data__, dict):
            raise NotImplementedError(
                "please write add a unit test and implement this"
            )

        super().__init__(__data__=__data__, *args, **kw)

    def serialize(self, *args, **kw):
        return self.text


class SubSource(Model):
    """represents an `Attribution Of Quote` <https://dictionaryapi.com/products/json#sec-2.aq>`_
    """

    source: str
    publication_date: str

    @property
    def publication_date(self) -> str:
        return self.get("aqdate")


class AttributionOfQuote(Model):
    """represents an `Attribution Of Quote` <https://dictionaryapi.com/products/json#sec-2.aq>`_
    """

    author: str

    @property
    def author(self) -> str:
        meta = self.get("auth")

    source: str
    subsource: SubSource

    author: str

    @property
    def author(self) -> str:
        meta = self.get("auth")

    publication_date: str

    @property
    def publication_date(self) -> str:
        return self.get("aqdate")


class VerbalIllustration(Model):
    """represents `Verbal Illustrations <https://dictionaryapi.com/products/json#sec-2.vis>`_
    """

    text: str  # https://dictionaryapi.com/products/json#sec-2.fmttokens
    attribution: AttributionOfQuote

    @property
    def text(self) -> str:
        return self.get("t")

    @property
    def attribution(self) -> AttributionOfQuote:
        attr = self.get("aq")
        return attr


class DefiningText(Model):
    """represents a `Defining Text <https://dictionaryapi.com/products/json#sec-2.dt>`_
    """

    text: str  # https://dictionaryapi.com/products/json#sec-2.fmttokens

    usage_notes: UsageNotes
    verbal_illustrations: VerbalIllustration.List

    @property
    def usage_notes(self) -> UsageNotes:
        return self.get("uns")

    @property
    def verbal_illustrations(self) -> VerbalIllustration.List:
        return self.get("vis")

    def __init__(self, __data__, *args, **kw):
        # if isinstance(__data__, str):
        #     __data__ = {"text": __data__}
        if isinstance(__data__, list):
            data = {}
            for k, v in __data__:
                if k in data:
                    raise NotImplementedError(
                        "please add unit tests and implement this"
                    )
                data[k] = v

            __data__ = data

        elif not isinstance(__data__, dict):
            raise NotImplementedError(
                "please add unit tests and implement this"
            )

        super().__init__(__data__=__data__, *args, **kw)


class Etymology(Model):
    """represents an `Etymology <https://dictionaryapi.com/products/json#sec-2.et>`_
    """

    def __init__(self, elements):
        super().__init__(elements=elements)

    def serialize(self, *args, **kwargs):
        result = []
        for item in self.get("elements"):
            kind, *lines = item
            result.append({kind: lines})

        return result


class DividedSense(Model):
    """represents a `Divided Sense <https://dictionaryapi.com/products/json#sec-2.sdsense>`_
    """

    divider: str

    @property
    def divider(self) -> str:
        return self.get("sd")

    etymology: Etymology

    @property
    def etymology(self) -> Etymology:
        return self.get("et")

    status_labels: List[str]

    @property
    def status_labels(self) -> List[str]:
        return self.get("sls")

    variants: Variant.List

    @property
    def variants(self) -> Variant.List:
        return self.get("vrs")

    pronounciations: Pronounciation.List

    @property
    def pronounciations(self) -> Pronounciation.List:
        return self.hwi.pronounciations

    defining_text: DefiningText

    @property
    def defining_text(self) -> DefiningText:
        return self.get("dt")


class Sense(Model):
    """represents a `Sense <https://dictionaryapi.com/products/json#sec-2.sense>`_
    """

    number: str

    def __init__(self, __data__, *args, **kw):
        if (
            isinstance(__data__, list)
            and len(__data__) == 2
            and __data__[0] == "sense"
            and isinstance(__data__[1], dict)
        ):
            __data__ = __data__[1]
        elif not isinstance(__data__, (Model, dict)):
            __data__ = {str(__data__): __data__}

        super().__init__(__data__=__data__, *args, **kw)

    @property
    def number(self) -> str:
        return self.get("sn")

    labels: List[str]

    @property
    def labels(self) -> List[str]:
        return self.get("lbs")

    status_labels: List[str]

    @property
    def status_labels(self) -> List[str]:
        return self.get("sls")

    variants: Variant.List

    @property
    def variants(self) -> Variant.List:
        return self.get("vrs")

    pronounciations: Pronounciation.List

    @property
    def pronounciations(self) -> Pronounciation.List:
        return self.hwi.pronounciations

    defining_text: DefiningText

    @property
    def defining_text(self) -> DefiningText:
        return self.get("dt")

    divided_sense: DividedSense

    @property
    def divided_sense(self) -> DividedSense:
        return self.get("sdsense")

    inflections: Inflection.List

    @property
    def inflections(self) -> Inflection.List:
        return self.hwi.inflections

    etymology: Etymology

    @property
    def etymology(self) -> Etymology:
        return self.get("et")


class SenseSequence(Model):
    """represents a `Sense Sequence <https://dictionaryapi.com/products/json#sec-2.sseq>`_
    """

    senses: Sense.List

    def __init__(self, sequences):
        senses = map(Sense, chain(*sequences))
        super().__init__(senses=senses)


class DefinitionSection(Model):
    """represents a `Definition Section <https://dictionaryapi.com/products/json#sec-2.def>`_
    """

    verb_divider: str

    @property
    def verb_divider(self) -> str:
        return self.get("vd")

    sense_sequence: SenseSequence

    @property
    def sense_sequence(self) -> Sense.List:
        return self.get("sseq")

    status_labels: List[str]

    @property
    def status_labels(self) -> List[str]:
        return self.get("sls")


class Definition(Sense):
    """represents `Definition <https://dictionaryapi.com/products/json#sec-2>`_
    """

    short: List[str]

    @property
    def short(self) -> List[str]:
        return self.get("shortdef")

    regional_label: str

    @property
    def regional_label(self) -> str:
        return self.get("psl")

    functional_label: str

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

    homograph: int

    @property
    def homograph(self) -> int:
        return self.get("hom")

    headword: str

    @property
    def headword(self) -> str:
        return self.hwi.headword

    offensive: bool

    @property
    def offensive(self) -> bool:
        return self.meta.offensive

    stems: List[str]

    @property
    def stems(self) -> List[str]:
        return self.meta.stems

    definitions: DefinitionSection.List

    @property
    def definitions(self) -> DefinitionSection.List:
        return self.get("def")

    def to_dict(self, **kw):
        return self.serialize(only_visible=True)
