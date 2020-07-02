from sure import anything
from typing import Union
from notequalia.lexicon.merriam_webster.models import EntryMetadata, Definition
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/elated.json")
def test_adjective_verb_elated_collegiate_definition(
    fixture: Union[dict, list]
):
    ("adjective + verb 'elated' - Collegiate Data-modeling")

    # Given a two definitions of "elated"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    adjective, verb = definitions

    # Then their type matches
    adjective.functional_label.should.equal("adjective")
    verb.functional_label.should.equal("verb")

    adjective.to_dict().should.equal(
        {
            "functional_label": "adjective",
            "headword": "elat*ed",
            "offensive": False,
            "pronounciations": [
                {
                    "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/e/elate01m.mp3",
                    "default": "i-ˈlā-təd",
                }
            ],
            "short": ["marked by high spirits : exultant"],
            "stems": ["elated", "elatedly", "elatedness", "elatednesses"],
        }
    )
    verb.to_dict().should.equal(
        {
            "etymology": [
                {
                    "text": [
                        "Latin {it}elatus{/it} (past participle of {it}efferre{/it} to carry out, elevate), from {it}e-{/it} + {it}latus{/it}, past participle of {it}ferre{/it} to carry {ma}{mat|tolerate|}, {mat|bear|}{/ma}"
                    ]
                }
            ],
            "functional_label": "verb",
            "headword": "elate",
            "homograph": 1,
            "offensive": False,
            "pronounciations": [
                {
                    "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/e/elate001.mp3",
                    "default": "i-ˈlāt",
                }
            ],
            "short": ["to fill with joy or pride"],
            "stems": ["elate", "elated", "elates", "elating"],
        }
    )


@with_merriam_webster_fixture("thesaurus/elated.json")
def test_adjective_verb_elated_thesaurus_definition(
    fixture: Union[dict, list]
):
    ("adjective + verb 'elated' - Thesaurus Data-modeling")

    # Given a two definitions of "elated"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(3)

    # When I process the data model

    adjective, verb, another = definitions

    # Then their type matches
    adjective.functional_label.should.equal("adjective")
    verb.functional_label.should.equal("verb")

    adjective.to_dict().should.equal(
        {
            "functional_label": "adjective",
            "headword": "elated",
            "offensive": False,
            "short": [
                "experiencing or marked by overwhelming usually pleasurable emotion"
            ],
            "stems": ["elated", "elatedly", "elatedness", "elatednesses"],
        }
    )
    verb.to_dict().should.equal(
        {
            "functional_label": "verb",
            "headword": "elated",
            "offensive": False,
            "stems": ["elated"],
            "status_labels": ["past tense of {d_link|elate|elate}"],
            "short": ["to fill with great joy"],
        }
    )

    another.to_dict().should.equal(
        {
            "functional_label": "verb",
            "headword": "elate",
            "offensive": False,
            "stems": ["elate", "elated", "elates", "elating"],
            "short": ["to fill with great joy"],
        }
    )
