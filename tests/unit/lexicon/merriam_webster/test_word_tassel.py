from sure import anything
from typing import Union
from notequalia.lexicon.merriam_webster.models import EntryMetadata, Definition
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/tassel.json")
def test_noun_verb_tassel_collegiate_definition(fixture: Union[dict, list]):
    ("noun + verb 'tassel' - Collegiate Data-modeling")

    # Given a two definitions of "tassel"
    Definition.List(fixture).to_dict().should.equal(
        [
            {
                "pronounciations": [
                    {
                        "default": "ˈta-səl",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/t/tassel01.mp3",
                    },
                    {"default": "ˈtä-", "label_before": "usually of corn"},
                    {"default": "ˈtȯ-"},
                ],
                "etymology": [
                    {
                        "text": [
                            "Middle English, clasp, tassel, from Anglo-French, from Vulgar Latin {it}*tassellus{/it}, alteration of Latin {it}taxillus{/it} small die; akin to Latin {it}talus{/it} anklebone, die"
                        ]
                    }
                ],
                "short": [
                    "a dangling ornament made by laying parallel a bunch of cords or threads of even length and fastening them at one end",
                    "something resembling a tassel; especially : the terminal male inflorescence of some plants and especially corn",
                ],
                "functional_label": "noun",
                "homograph": 1,
                "headword": "tas*sel",
                "offensive": False,
                "stems": ["tassel", "tassels", "tiercel", "torsel"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}a dangling ornament made by laying parallel a bunch of cords or threads of even length and fastening them at one end"
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {
                                        "text": "{bc}something resembling a tassel"
                                    },
                                    "divided_sense": {
                                        "divider": "especially",
                                        "defining_text": {
                                            "text": "{bc}the terminal male inflorescence of some plants and especially corn"
                                        },
                                    },
                                },
                            ]
                        }
                    }
                ],
            },
            {
                "short": [
                    "to adorn with tassels",
                    "to put forth tassel inflorescences",
                ],
                "functional_label": "verb",
                "homograph": 2,
                "headword": "tassel",
                "offensive": False,
                "stems": [
                    "tassel",
                    "tasseled",
                    "tasseling",
                    "tasselled",
                    "tasselling",
                    "tassels",
                ],
                "definitions": [
                    {
                        "verb_divider": "transitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}to adorn with {a_link|tassels}"
                                    }
                                }
                            ]
                        },
                    },
                    {
                        "verb_divider": "intransitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}to put forth tassel inflorescences"
                                    }
                                }
                            ]
                        },
                    },
                ],
            },
        ]
    )
