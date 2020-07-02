from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/backflip.json")
def test_2_10_def_collegiate(fixture: Union[dict, list]):
    (
        "2.10.1 DEFINITION SECTION: DEF - https://dictionaryapi.com/products/json#sec-2.def"
    )

    # Given 5 definitions of "baloney" from collegiate API
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(1)

    # Then it should taon
    definitions.to_dict().should.equal(
        [
            {
                "pronounciations": [
                    {
                        "default": "ˈbak-ˌflip",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/b/backf01v.mp3",
                    }
                ],
                "short": ["a backward somersault especially in the air"],
                "functional_label": "noun",
                "headword": "back*flip",
                "offensive": False,
                "stems": ["backflip", "backflips"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "data": [
                                            [
                                                "text",
                                                "{bc}a {a_link|backward} somersault especially in the air",
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
            }
        ]
    )
