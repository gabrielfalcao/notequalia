from sure import anything
from typing import Union
from notequalia.lexicon.merriam_webster.models import EntryMetadata, Definition
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("thesaurus/equanimity.json")
def test_noun_equanimity_thesaurus_definition(fixture: Union[dict, list]):
    ("noun 'equanimity' - Thesaurus Data-modeling")

    # Given a single definition of "equanimity"
    fixture.should.be.a(list)
    fixture.should.have.length_of(1)

    # When I process the data model

    item = Definition(fixture[0])

    # Then it should be a noun
    item.functional_label.should.equal("noun")

    # And should not be offensive
    item.offensive.should.be.false

    # And it should have metadata
    item.meta.should.be.an(EntryMetadata)

    # And should have stems
    item.stems.should.equal(["equanimity", "equanimities"])

    item.to_dict().should.equal(
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
                                            "evenness of emotions or temper ",
                                        ],
                                        [
                                            "vis",
                                            [
                                                {
                                                    "t": "an Olympic diver who always displays remarkable {it}equanimity{/it} on the platform"
                                                }
                                            ],
                                        ],
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            "functional_label": "noun",
            "headword": "equanimity",
            "offensive": False,
            "short": ["evenness of emotions or temper"],
            "stems": ["equanimity", "equanimities"],
        }
    )
