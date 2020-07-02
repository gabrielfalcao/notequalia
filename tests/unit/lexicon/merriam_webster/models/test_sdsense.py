from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/abiogenesis.json")
def test_2_10_7_sdsense_collegiate(fixture: Union[dict, list]):
    (
        "2.10.7 DIVIDED SENSE: SDSENSE - https://dictionaryapi.com/products/json#sec-2.sdsense"
    )

    Definition.List(fixture).to_dict().should.equal(
        [
            {
                "pronounciations": [
                    {
                        "default": "ˌā-ˌbī-ō-ˈje-nə-səs",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/a/abioge01.mp3",
                    }
                ],
                "etymology": [
                    {
                        "text": [
                            "{et_link|a-:2|a-:2} + {et_link|bio-|bi-:2} + {et_link|genesis|genesis}"
                        ]
                    }
                ],
                "short": [
                    "the origin of life from nonliving matter; specifically : a theory in the evolution of early life on earth : organic molecules and subsequent simple life forms first originated from inorganic substances"
                ],
                "functional_label": "noun",
                "headword": "abio*gen*e*sis",
                "offensive": False,
                "stems": [
                    "abiogeneses",
                    "abiogenesis",
                    "abiogenesises",
                    "abiogenist",
                    "abiogenists",
                ],
                "definitions": [{"sense_sequence": {"senses": [{}]}}],
            },
            {
                "short": [
                    "a now discredited notion that living organisms spontaneously originate directly from nonliving matter"
                ],
                "functional_label": "noun",
                "headword": "spontaneous generation",
                "offensive": False,
                "stems": [
                    "abiogenesis",
                    "spontaneous generation",
                    "spontaneous generations",
                ],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}a now discredited notion that living organisms spontaneously originate directly from nonliving matter ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "A difficulty that we have forgotten lay in the widespread belief in {wi}spontaneous generation{/wi}. Aristotle had written that flies, worms, and other small animals originated spontaneously from putrefying matter.",
                                                "attribution": {},
                                            }
                                        ],
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
        ]
    )
