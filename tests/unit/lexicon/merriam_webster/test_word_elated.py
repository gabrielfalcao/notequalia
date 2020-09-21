from sure import anything
from typing import Union
from notequalia.lexicon.merriam_webster.models import EntryMetadata, Definition
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/elated.json")
def test_adjective_verb_elated_collegiate_definition(fixture: Union[dict, list]):
    ("adjective + verb 'elated' - Collegiate Data-modeling")

    # Given a two definitions of "elated"
    Definition.List(fixture).to_dict().should.equal(
        [
            {
                "pronounciations": [
                    {
                        "default": "i-ˈlā-təd",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/e/elate01m.mp3",
                    }
                ],
                "short": ["marked by high spirits : exultant"],
                "functional_label": "adjective",
                "headword": "elat*ed",
                "offensive": False,
                "stems": ["elated", "elatedly", "elatedness", "elatednesses"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}marked by high spirits {bc}{sx|exultant||}"
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "pronounciations": [
                    {
                        "default": "i-ˈlāt",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/e/elate001.mp3",
                    }
                ],
                "etymology": [
                    {
                        "text": [
                            "Latin {it}elatus{/it} (past participle of {it}efferre{/it} to carry out, elevate), from {it}e-{/it} + {it}latus{/it}, past participle of {it}ferre{/it} to carry {ma}{mat|tolerate|}, {mat|bear|}{/ma}"
                        ]
                    }
                ],
                "short": ["to fill with joy or pride"],
                "functional_label": "verb",
                "homograph": 1,
                "headword": "elate",
                "offensive": False,
                "stems": ["elate", "elated", "elates", "elating"],
                "definitions": [
                    {
                        "verb_divider": "transitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}to fill with joy or pride"
                                    }
                                }
                            ]
                        },
                    }
                ],
            },
        ]
    )
