from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/test.json")
def test_2_10_4_sense_collegiate(fixture: Union[dict, list]):
    (
        "2.10.4 SENSE: SENSE - https://dictionaryapi.com/products/json#sec-2.sense"
    )

    Definition.List(fixture).to_dict().should.equal(
        [
            {
                "pronounciations": [
                    {
                        "default": "ˈtest",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/t/test0001.mp3",
                    }
                ],
                "etymology": [
                    {
                        "text": [
                            "Middle English, vessel in which metals were assayed, potsherd, from Anglo-French {it}test, tees{/it} pot, Latin {it}testum{/it} earthen vessel; akin to Latin {it}testa{/it} earthen pot, shell"
                        ]
                    }
                ],
                "short": [
                    "a means of testing: such as",
                    "something (such as a series of questions or exercises) for measuring the skill, knowledge, intelligence, capacities, or aptitudes of an individual or group",
                    "a procedure, reaction, or reagent used to identify or characterize a substance or constituent",
                ],
                "functional_label": "noun",
                "homograph": 1,
                "headword": "test",
                "offensive": False,
                "stems": ["test", "tests"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {},
                                {
                                    "number": "b",
                                    "defining_text": {
                                        "text": "{bc}a positive result in such a test"
                                    },
                                },
                                {},
                                {
                                    "number": "b",
                                    "defining_text": {
                                        "text": "{bc}an ordeal or oath required as proof of conformity with a set of beliefs"
                                    },
                                },
                                {
                                    "number": "c",
                                    "status_labels": ["chiefly British"],
                                    "defining_text": {
                                        "text": "{bc}{sx|cupel||}"
                                    },
                                },
                                {
                                    "number": "3",
                                    "defining_text": {
                                        "text": "{bc}a result or value determined by testing"
                                    },
                                },
                                {
                                    "number": "4",
                                    "defining_text": {
                                        "text": "{bc}{sx|test match||}"
                                    },
                                },
                            ]
                        }
                    }
                ],
            },
            {
                "short": [
                    "to put to test or proof : try —often used with out",
                    "to require a doctrinal oath of",
                    "to undergo a test",
                ],
                "functional_label": "verb",
                "homograph": 2,
                "headword": "test",
                "offensive": False,
                "stems": [
                    "test",
                    "test the water",
                    "test the waters",
                    "testabilities",
                    "testability",
                    "testable",
                    "tested",
                    "tested the water",
                    "tested the waters",
                    "testing",
                    "testing the water",
                    "testing the waters",
                    "tests",
                    "tests the water",
                    "tests the waters",
                ],
                "definitions": [
                    {
                        "verb_divider": "transitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}to put to test or proof {bc}{sx|try||} ",
                                        "usage_notes": "often used with {it}out{/it}",
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {
                                        "text": "{bc}to require a doctrinal oath of"
                                    },
                                },
                            ]
                        },
                    },
                    {
                        "verb_divider": "intransitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1 a",
                                    "defining_text": {
                                        "text": "{bc}to undergo a test"
                                    },
                                },
                                {
                                    "number": "b",
                                    "defining_text": {
                                        "text": "{bc}to be assigned a standing or evaluation on the basis of {a_link|tests} ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "{wi}tested{/wi} positive for cocaine"
                                            },
                                            {
                                                "text": "the cake {wi}tested{/wi} done"
                                            },
                                        ],
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {
                                        "text": "{bc}to apply a test as a means of analysis or diagnosis ",
                                        "usage_notes": "used with {it}for{/it} ",
                                    },
                                },
                            ]
                        },
                    },
                ],
            },
            {
                "short": [
                    "of, relating to, or constituting a test",
                    "subjected to, used for, or revealed by testing",
                ],
                "functional_label": "adjective",
                "homograph": 3,
                "headword": "test",
                "offensive": False,
                "stems": ["test"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}of, relating to, or constituting a test"
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {
                                        "text": "{bc}subjected to, used for, or revealed by {a_link|testing} ",
                                        "verbal_illustrations": [
                                            {"text": "a {wi}test{/wi} group"},
                                            {"text": "{wi}test{/wi} data"},
                                        ],
                                    },
                                },
                            ]
                        }
                    }
                ],
            },
            {
                "etymology": [{"text": ["Latin {it}testa{/it} shell"]}],
                "short": [
                    "an external hard or firm covering (such as a shell) of many invertebrates (such as a foraminifer or a mollusk)"
                ],
                "functional_label": "noun",
                "homograph": 4,
                "headword": "test",
                "offensive": False,
                "stems": ["test", "tests"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}an external hard or firm covering (such as a shell) of many invertebrates (such as a foraminifer or a mollusk)"
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "short": ["Testament"],
                "functional_label": "abbreviation",
                "headword": "Test",
                "offensive": False,
                "stems": ["Test"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{a_link|Testament}"
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "short": [
                    "a self-imposed partial or complete ban on the testing of nuclear weapons that is mutually agreed to by countries possessing such weapons"
                ],
                "functional_label": "noun",
                "headword": "test ban",
                "offensive": False,
                "stems": ["test ban", "test bans"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}a self-imposed partial or complete ban on the testing of nuclear weapons that is mutually agreed to by countries possessing such weapons"
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "short": [
                    "a vehicle (such as an airplane) used for testing new equipment (such as engines or weapons systems); broadly : any device, facility, or means for testing something in development"
                ],
                "functional_label": "noun",
                "headword": "test bed",
                "offensive": False,
                "stems": ["test bed"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}a vehicle (such as an airplane) used for testing new equipment (such as engines or weapons systems)"
                                    },
                                    "divided_sense": {
                                        "divider": "broadly",
                                        "defining_text": {
                                            "text": "{bc}any device, facility, or means for testing something in development"
                                        },
                                    },
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "short": [
                    "a representative case whose outcome is likely to serve as a precedent",
                    "a proceeding brought by agreement or on an understanding of the parties to obtain a decision as to the constitutionality of a statute",
                ],
                "functional_label": "noun",
                "headword": "test case",
                "offensive": False,
                "stems": ["test case", "test cases"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}a representative case whose outcome is likely to serve as a precedent"
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {
                                        "text": "{bc}a proceeding brought by agreement or on an understanding of the parties to obtain a decision as to the constitutionality of a statute"
                                    },
                                },
                            ]
                        }
                    }
                ],
            },
            {
                "pronounciations": [
                    {
                        "default": "ˈtes(t)-ˌdrīv",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/t/testdr01.mp3",
                    }
                ],
                "short": [
                    "to drive (a motor vehicle) in order to evaluate performance",
                    "to use or examine (something, such as a computer program) in order to evaluate performance",
                ],
                "functional_label": "verb",
                "headword": "test-drive",
                "offensive": False,
                "stems": [
                    "test-drive",
                    "test-driven",
                    "test-drives",
                    "test-driving",
                    "test-drove",
                    "testdrives",
                ],
                "definitions": [
                    {
                        "verb_divider": "transitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}to drive (a motor vehicle) in order to evaluate performance"
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {
                                        "text": "{bc}to use or examine (something, such as a computer program) in order to evaluate performance ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "{wi}test-drive{/wi} the new game"
                                            }
                                        ],
                                    },
                                },
                            ]
                        },
                    }
                ],
            },
            {
                "pronounciations": [
                    {
                        "default": "ˈtest-ˌflī",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/t/testfl01.mp3",
                    }
                ],
                "short": ["to subject to a flight test"],
                "functional_label": "verb",
                "headword": "test-fly",
                "offensive": False,
                "stems": [
                    "test-flew",
                    "test-flies",
                    "test-flown",
                    "test-fly",
                    "test-flying",
                ],
                "definitions": [
                    {
                        "verb_divider": "transitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}to subject to a flight test ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "{wi}test-fly{/wi} an experimental plane"
                                            }
                                        ],
                                    }
                                }
                            ]
                        },
                    }
                ],
            },
        ]
    )
