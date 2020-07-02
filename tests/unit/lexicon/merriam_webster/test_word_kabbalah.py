from sure import anything
from typing import Union
from notequalia.lexicon.merriam_webster.models import EntryMetadata, Definition
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/kabbalah.json")
def test_noun_kaballah_collegiate_definition(fixture: Union[dict, list]):
    ("noun 'kaballah' - Collegiate Data-modeling")

    # Given a two definitions of "kaballah"
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(2)

    # When I process the data model

    noun, def2 = definitions

    # Then it should be a noun
    noun.functional_label.should.equal("noun")

    # And should not be offensive
    noun.offensive.should.be.false

    # And it should have metadata
    noun.meta.should.be.an(EntryMetadata)

    # And should have stems
    noun.stems.should.equal(
        [
            "cabala",
            "cabalas",
            "cabbala",
            "cabbalah",
            "cabbalahs",
            "cabbalas",
            "kabala",
            "kabalas",
            "kabbala",
            "kabbalah",
            "kabbalahs",
            "kabbalas",
            "kabbalism",
            "kabbalisms",
            "kabbalistic",
        ]
    )

    def2.to_dict().should.equal(
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
                                            "{bc}a medieval and modern system of Jewish theosophy, mysticism, and thaumaturgy marked by belief in creation through emanation and a cipher method of interpreting Scripture",
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
                                            "{bc}a traditional, esoteric, occult, or secret matter",
                                        ]
                                    ]
                                },
                                "number": "2 a",
                            },
                            {
                                "defining_text": {
                                    "data": [
                                        [
                                            "text",
                                            "{bc}esoteric doctrine or mysterious art",
                                        ]
                                    ]
                                },
                                "number": "b",
                            },
                        ]
                    }
                }
            ],
            "headword": "ca*ba*la",
            "offensive": False,
            "short": [
                "a medieval and modern system of Jewish theosophy, mysticism, and thaumaturgy marked by belief in creation through emanation and a cipher method of interpreting Scripture",
                "a traditional, esoteric, occult, or secret matter",
                "esoteric doctrine or mysterious art",
            ],
            "stems": [
                "cabala",
                "cabalas",
                "cabbala",
                "cabbalah",
                "cabbalahs",
                "cabbalas",
                "kabbalah",
            ],
            "variants": [{"name": "cabbala"}, {"name": "cabbalah"}],
        }
    )
