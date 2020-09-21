from sure import anything
from typing import Union
from notequalia.lexicon.merriam_webster.models import EntryMetadata, Definition
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/kabbalah.json")
def test_noun_kaballah_collegiate_definition(fixture: Union[dict, list]):
    ("noun 'kaballah' - Collegiate Data-modeling")

    # Given a two definitions of "kaballah"
    Definition.List(fixture).to_dict().should.equal(
        [
            {
                "labels": ["often capitalized"],
                "variants": [
                    {"name": "kab*ba*la"},
                    {"name": "ka*ba*la"},
                    {"name": "ca*ba*la"},
                    {"name": "cab*ba*la"},
                    {"name": "cab*ba*lah"},
                ],
                "pronounciations": [
                    {
                        "default": "kə-ˈbä-lə",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/c/cabala02.mp3",
                    },
                    {
                        "default": "ˈka-bə-lə",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/c/cabala01.mp3",
                    },
                ],
                "etymology": [
                    {"text": ["Medieval Latin {it}cabbala{/it} {ma}{mat|cabal|}{/ma}"]}
                ],
                "short": [
                    "a medieval and modern system of Jewish theosophy, mysticism, and thaumaturgy marked by belief in creation through emanation and a cipher method of interpreting Scripture",
                    "a traditional, esoteric, occult, or secret matter",
                    "esoteric doctrine or mysterious art",
                ],
                "functional_label": "noun",
                "headword": "kab*ba*lah",
                "offensive": False,
                "stems": [
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
                ],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}a medieval and modern system of Jewish theosophy, mysticism, and thaumaturgy marked by belief in creation through emanation and a cipher method of interpreting Scripture"
                                    },
                                },
                                {
                                    "number": "2 a",
                                    "defining_text": {
                                        "text": "{bc}a traditional, esoteric, occult, or secret matter"
                                    },
                                },
                                {
                                    "number": "b",
                                    "defining_text": {
                                        "text": "{bc}esoteric doctrine or mysterious art"
                                    },
                                },
                            ]
                        }
                    }
                ],
            },
            {
                "variants": [{"name": "cabbala"}, {"name": "cabbalah"}],
                "short": [
                    "a medieval and modern system of Jewish theosophy, mysticism, and thaumaturgy marked by belief in creation through emanation and a cipher method of interpreting Scripture",
                    "a traditional, esoteric, occult, or secret matter",
                    "esoteric doctrine or mysterious art",
                ],
                "headword": "ca*ba*la",
                "offensive": False,
                "stems": [
                    "cabala",
                    "cabalas",
                    "cabbala",
                    "cabbalah",
                    "cabbalahs",
                    "cabbalas",
                    "kabbalah",
                ],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}a medieval and modern system of Jewish theosophy, mysticism, and thaumaturgy marked by belief in creation through emanation and a cipher method of interpreting Scripture"
                                    },
                                },
                                {
                                    "number": "2 a",
                                    "defining_text": {
                                        "text": "{bc}a traditional, esoteric, occult, or secret matter"
                                    },
                                },
                                {
                                    "number": "b",
                                    "defining_text": {
                                        "text": "{bc}esoteric doctrine or mysterious art"
                                    },
                                },
                            ]
                        }
                    }
                ],
            },
        ]
    )
