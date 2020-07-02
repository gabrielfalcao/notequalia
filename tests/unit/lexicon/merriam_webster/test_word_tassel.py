from sure import anything
from typing import Union
from notequalia.lexicon.merriam_webster.models import EntryMetadata, Definition
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/tassel.json")
def test_noun_verb_tassel_collegiate_definition(fixture: Union[dict, list]):
    ("noun + verb 'tassel' - Collegiate Data-modeling")

    # Given a two definitions of "tassel"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    noun, verb = definitions

    # Then their type matches
    noun.functional_label.should.equal("noun")
    verb.functional_label.should.equal("verb")

    noun.to_dict().should.equal(
        {
            "definitions": [
                {
                    "sense_sequence": {
                        "senses": [
                            {
                                "defining_text": {
                                    "data": [
                                        [
                                            "text",
                                            "{bc}a dangling ornament made by laying parallel a bunch of cords or threads of even length and fastening them at one end",
                                        ]
                                    ]
                                },
                                "number": "1",
                            },
                            {
                                "defining_text": {
                                    "data": [
                                        [
                                            "text",
                                            "{bc}something resembling a tassel",
                                        ]
                                    ]
                                },
                                "number": "2",
                            },
                        ]
                    }
                }
            ],
            "etymology": [
                {
                    "text": [
                        "Middle English, clasp, tassel, from Anglo-French, from Vulgar Latin {it}*tassellus{/it}, alteration of Latin {it}taxillus{/it} small die; akin to Latin {it}talus{/it} anklebone, die"
                    ]
                }
            ],
            "functional_label": "noun",
            "headword": "tas*sel",
            "homograph": 1,
            "offensive": False,
            "pronounciations": [
                {
                    "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/t/tassel01.mp3",
                    "default": "ˈta-səl",
                },
                {"default": "ˈtä-", "label_before": "usually of corn"},
                {"default": "ˈtȯ-"},
            ],
            "short": [
                "a dangling ornament made by laying parallel a bunch of cords or threads of even length and fastening them at one end",
                "something resembling a tassel; especially : the terminal male inflorescence of some plants and especially corn",
            ],
            "stems": ["tassel", "tassels", "tiercel", "torsel"],
        }
    )
    verb.to_dict().should.equal(
        {
            "definitions": [
                {
                    "sense_sequence": {
                        "senses": [
                            {
                                "defining_text": {
                                    "data": [
                                        [
                                            "text",
                                            "{bc}to adorn with {a_link|tassels}",
                                        ]
                                    ]
                                }
                            }
                        ]
                    },
                    "verb_divider": "transitive verb",
                },
                {
                    "sense_sequence": {
                        "senses": [
                            {
                                "defining_text": {
                                    "data": [
                                        [
                                            "text",
                                            "{bc}to put forth tassel inflorescences",
                                        ]
                                    ]
                                }
                            }
                        ]
                    },
                    "verb_divider": "intransitive verb",
                },
            ],
            "functional_label": "verb",
            "headword": "tassel",
            "homograph": 2,
            "offensive": False,
            "short": [
                "to adorn with tassels",
                "to put forth tassel inflorescences",
            ],
            "stems": [
                "tassel",
                "tasseled",
                "tasseling",
                "tasselled",
                "tasselling",
                "tassels",
            ],
        }
    )
