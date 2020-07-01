from typing import Union
from notequalia.lexicon.merriam_webster.models import (
    EntryMetadata,
    ThesaurusDefinition,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/elated.json")
def test_adjective_verb_elated_collegiate_definition(
    fixture: Union[dict, list]
):
    ("adjective + verb 'elated' - Collegiate Data-modeling>")

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
                    "default": "i-ˈlā-təd",
                    "label_after": "",
                    "label_before": "",
                    "punctuation": "",
                    "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/wav/e/elate01m.wav",
                }
            ],
            "stems": ["elated", "elatedly", "elatedness", "elatednesses"],
            "variants": [],
        }
    )
    verb.to_dict().should.equal(
        {
            "functional_label": "verb",
            "headword": "elate",
            "homograph": 1,
            "offensive": False,
            "pronounciations": [
                {
                    "default": "i-ˈlāt",
                    "label_after": "",
                    "label_before": "",
                    "punctuation": "",
                    "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/wav/e/elate001.wav",
                }
            ],
            "stems": ["elate", "elated", "elates", "elating"],
            "variants": [],
        }
    )


@with_merriam_webster_fixture("thesaurus/elated.json")
def test_adjective_verb_elated_thesaurus_definition(
    fixture: Union[dict, list]
):
    ("adjective + verb 'elated' - Thesaurus Data-modeling>")

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
            "pronounciations": [],
            "stems": ["elated", "elatedly", "elatedness", "elatednesses"],
            "variants": [],
        }
    )
    verb.to_dict().should.equal(
        {
            "functional_label": "verb",
            "headword": "elated",
            "offensive": False,
            "pronounciations": [],
            "stems": ["elated"],
            "variants": [],
        }
    )

    another.to_dict().should.equal(
        {
            "functional_label": "verb",
            "headword": "elate",
            "offensive": False,
            "pronounciations": [],
            "stems": ["elate", "elated", "elates", "elating"],
            "variants": [],
        }
    )
