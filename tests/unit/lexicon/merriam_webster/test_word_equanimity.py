from sure import anything
from typing import Union
from notequalia.lexicon.merriam_webster.models import EntryMetadata, Definition
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("thesaurus/equanimity.json")
def test_noun_equanimity_thesaurus_definition(fixture: Union[dict, list]):
    ("noun 'equanimity' - Thesaurus Data-modeling")

    Definition.List(fixture).to_dict().should.equal(
        [
            {
                "short": ["evenness of emotions or temper"],
                "functional_label": "noun",
                "headword": "equanimity",
                "offensive": False,
                "stems": ["equanimity", "equanimities"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "evenness of emotions or temper ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "an Olympic diver who always displays remarkable {it}equanimity{/it} on the platform"
                                            }
                                        ],
                                    }
                                }
                            ]
                        }
                    }
                ],
                "antonyms": ["agitation", "discomposure", "perturbation"],
                "synonyms": [
                    "aplomb",
                    "calmness",
                    "collectedness",
                    "composedness",
                    "composure",
                    "cool",
                    "coolness",
                    "countenance",
                    "equilibrium",
                    "imperturbability",
                    "placidity",
                    "repose",
                    "sangfroid",
                    "self-composedness",
                    "self-possession",
                    "serenity",
                    "tranquillity",
                    "tranquilness",
                ],
            }
        ]
    )
