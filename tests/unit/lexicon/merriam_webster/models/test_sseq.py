from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/hop.json")
def test_2_10_3_def_collegiate(fixture: Union[dict, list]):
    ("2.10.3 SENSE SEQUENCE: SSEQ - https://dictionaryapi.com/products/json#sec-2.sseq")

    Definition.List(fixture).to_dict().should.equal(
        [
            {
                "pronounciations": [
                    {
                        "default": "ˈhäp",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/h/hop00001.mp3",
                    }
                ],
                "etymology": [
                    {
                        "text": [
                            "Middle English {it}hoppen{/it}, from Old English {it}hoppian{/it}"
                        ]
                    }
                ],
                "short": [
                    "to move by a quick springy leap or in a series of leaps; also : to move as if by hopping",
                    "to make a quick trip especially by air",
                    "to set about doing something —usually used in the phrase hop to it",
                ],
                "functional_label": "verb",
                "homograph": 1,
                "headword": "hop",
                "offensive": False,
                "stems": ["hop", "hopped", "hopping", "hops"],
                "definitions": [
                    {
                        "verb_divider": "intransitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}to move by a quick springy leap or in a series of leaps"
                                    },
                                    "divided_sense": {
                                        "divider": "also",
                                        "defining_text": {
                                            "text": "{bc}to move as if by hopping ",
                                            "verbal_illustrations": [
                                                {"text": "{wi}hop{/wi} in the car"}
                                            ],
                                        },
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {
                                        "text": "{bc}to make a quick trip especially by air"
                                    },
                                },
                                {
                                    "number": "3",
                                    "defining_text": {
                                        "text": "{bc}to set about doing something ",
                                        "usage_notes": "usually used in the phrase {it}hop to it{/it}",
                                    },
                                },
                            ]
                        },
                    },
                    {
                        "verb_divider": "transitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}to jump over ",
                                        "verbal_illustrations": [
                                            {"text": "{wi}hop{/wi} a fence"}
                                        ],
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {
                                        "text": "{bc}to ride on ",
                                        "verbal_illustrations": [
                                            {"text": "{it}hopped{/it} a flight"}
                                        ],
                                    },
                                    "divided_sense": {
                                        "divider": "also",
                                        "defining_text": {
                                            "text": "{bc}to ride surreptitiously and without authorization ",
                                            "verbal_illustrations": [
                                                {"text": "{wi}hop{/wi} a freight train"}
                                            ],
                                        },
                                    },
                                },
                            ]
                        },
                    },
                ],
            },
            {
                "short": [
                    "a short brisk leap especially on one leg",
                    "bounce, rebound",
                    "dance",
                ],
                "functional_label": "noun",
                "homograph": 2,
                "headword": "hop",
                "offensive": False,
                "stems": ["hop", "hops"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1 a",
                                    "defining_text": {
                                        "text": "{bc}a short brisk leap especially on one leg"
                                    },
                                },
                                {
                                    "number": "b",
                                    "defining_text": {
                                        "text": "{bc}{sx|bounce||}, {sx|rebound||} ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "shortstop scooped it up on the first {wi}hop{/wi}"
                                            }
                                        ],
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {"text": "{bc}{sx|dance||3}"},
                                },
                                {
                                    "number": "3 a",
                                    "defining_text": {
                                        "text": "{bc}a flight in an aircraft"
                                    },
                                },
                                {
                                    "number": "b",
                                    "defining_text": {"text": "{bc}a short trip"},
                                },
                            ]
                        }
                    }
                ],
            },
            {
                "etymology": [
                    {
                        "text": [
                            "Middle English {it}hoppe{/it}, from Middle Dutch; akin to Old High German {it}hopfo{/it} hop"
                        ]
                    }
                ],
                "short": [
                    "the ripe dried pistillate catkins of a perennial north-temperate zone twining vine (Humulus lupulus) of the hemp family used especially to impart a bitter flavor to malt liquors",
                    "the vine from which hops are obtained having 3- to 5-lobed leaves and inconspicuous flowers of which the pistillate ones are in glandular cone-shaped catkins",
                ],
                "functional_label": "noun",
                "homograph": 3,
                "headword": "hop",
                "offensive": False,
                "stems": ["hop", "hops"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}the ripe dried pistillate catkins of a perennial north-temperate zone twining vine ({it}Humulus lupulus{/it}) of the hemp family used especially to impart a bitter flavor to malt liquors"
                                    },
                                },
                                {
                                    "number": "2",
                                    "defining_text": {
                                        "text": "{bc}the vine from which hops are obtained having 3- to 5-lobed leaves and inconspicuous flowers of which the pistillate ones are in glandular cone-shaped catkins"
                                    },
                                },
                            ]
                        }
                    }
                ],
            },
            {
                "short": ["to flavor with hops"],
                "functional_label": "verb",
                "homograph": 4,
                "headword": "hop",
                "offensive": False,
                "stems": ["hop", "hopped", "hopping", "hops"],
                "definitions": [
                    {
                        "verb_divider": "transitive verb",
                        "sense_sequence": {
                            "senses": [
                                {"defining_text": {"text": "{bc}to flavor with hops"}}
                            ]
                        },
                    }
                ],
            },
            {
                "short": [
                    "a chiefly eastern North American tree (Ostrya virginiana) of the birch family with fruiting clusters resembling hops"
                ],
                "functional_label": "noun",
                "headword": "hop hornbeam",
                "offensive": False,
                "stems": ["hop hornbeam", "hop hornbeams"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}a chiefly eastern North American tree ({it}Ostrya virginiana{/it}) of the birch family with fruiting clusters resembling hops"
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
                        "default": "ˌhä-pə-mə-ˈthəm",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/h/hopomy01.mp3",
                    }
                ],
                "etymology": [
                    {
                        "text": [
                            "earlier {it}hop on my thumb{/it}, imperative issued to one supposedly small enough to be held in the hand"
                        ]
                    }
                ],
                "short": ["a very small person"],
                "functional_label": "noun",
                "headword": "hop-o'-my-thumb",
                "offensive": False,
                "stems": ["hop-o'-my-thumb", "hop-o'-my-thumbs"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {"defining_text": {"text": "{bc}a very small person"}}
                            ]
                        }
                    }
                ],
            },
            {
                "short": ["a short distance"],
                "functional_label": "noun",
                "headword": "hop, skip, and jump",
                "offensive": False,
                "stems": ["hop, skip, and jump"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {"defining_text": {"text": "{bc}a short distance"}}
                            ]
                        }
                    }
                ],
            },
            {
                "short": ["triple jump"],
                "functional_label": "noun",
                "headword": "hop, step, and jump",
                "offensive": False,
                "stems": ["hop, step, and jump", "hop, step, and jumps"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {"defining_text": {"text": "{bc}{sx|triple jump||}"}}
                            ]
                        }
                    }
                ],
            },
            {
                "short": ["to go away quickly"],
                "functional_label": "idiom",
                "headword": "hop it",
                "offensive": False,
                "stems": ["hop it"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}to go away quickly ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "She told her brother to {it}hop it{/it} and leave her alone."
                                            }
                                        ],
                                    }
                                }
                            ]
                        },
                        "status_labels": ["British", "informal"],
                    }
                ],
            },
            {
                "short": ["to act or move quickly"],
                "functional_label": "idiom",
                "headword": "hop to it",
                "offensive": False,
                "stems": ["hop to it"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}to act or move quickly ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "The car was ready to leave and he was told to {it}hop to it{/it}."
                                            }
                                        ],
                                    }
                                }
                            ]
                        },
                        "status_labels": ["informal"],
                    }
                ],
            },
        ]
    )
