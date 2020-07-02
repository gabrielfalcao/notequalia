from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/baloney.json")
def test_2_9_cxs_collegiate(fixture: Union[dict, list]):
    (
        "2.9 COGNATE CROSS-REFERENCES: CXS - https://dictionaryapi.com/products/json#sec-2.cxs"
    )

    # Given 5 definitions of "baloney" from collegiate API
    definitions = Definition.List(fixture)
    definitions.should.have.length_of(5)

    # Then it should taon
    definitions.to_dict().should.equal(
        [
            {
                "pronounciations": [
                    {
                        "default": "bə-ˈlō-nē",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/b/bologn01.mp3",
                    }
                ],
                "short": [
                    "a large smoked sausage of beef, veal, and pork; also : a sausage made (as of turkey) to resemble bologna"
                ],
                "functional_label": "noun",
                "homograph": 1,
                "headword": "ba*lo*ney",
                "offensive": False,
                "stems": ["baloney", "bologna"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "data": [
                                            [
                                                "text",
                                                "{bc}a large smoked sausage of beef, veal, and pork",
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "variants": [{"name": "bo*lo*ney"}],
                "pronounciations": [
                    {
                        "default": "bə-ˈlō-nē",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/b/balone01.mp3",
                    }
                ],
                "etymology": [{"text": ["{it}bologna{/it}"]}],
                "short": [
                    "pretentious nonsense : bunkum —often used as a generalized expression of disagreement"
                ],
                "functional_label": "noun",
                "homograph": 2,
                "headword": "ba*lo*ney",
                "offensive": False,
                "stems": [
                    "baloney",
                    "baloneys",
                    "bologna",
                    "boloney",
                    "boloneys",
                ],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "data": [
                                            [
                                                "text",
                                                "{bc}pretentious nonsense {bc}{sx|bunkum||} ",
                                            ],
                                            [
                                                "uns",
                                                [
                                                    [
                                                        [
                                                            "text",
                                                            "often used as a generalized expression of disagreement",
                                                        ]
                                                    ]
                                                ],
                                            ],
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "variants": [
                    {
                        "name": "ba*lo*ney",
                        "pronounciations": [
                            {
                                "default": "bə-ˈlō-nē",
                                "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/b/bologn01.mp3",
                            }
                        ],
                    }
                ],
                "pronounciations": [
                    {
                        "default": "bə-ˈlō-nē",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/b/bologn01.mp3",
                    },
                    {"default": "-nyə", "label_before": "also"},
                    {"default": "-nə"},
                ],
                "etymology": [
                    {
                        "text": [
                            "short for {it}Bologna sausage{/it}, from {it}Bologna{/it}, Italy"
                        ]
                    }
                ],
                "short": [
                    "a large smoked sausage of beef, veal, and pork; also : a sausage made (as of turkey) to resemble bologna"
                ],
                "functional_label": "noun",
                "headword": "bo*lo*gna",
                "offensive": False,
                "stems": [
                    "baloney",
                    "baloneys",
                    "bologna",
                    "bologna bull",
                    "bolognas",
                    "boloney",
                    "boloneys",
                ],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "data": [
                                            [
                                                "text",
                                                "{bc}a large smoked sausage of beef, veal, and pork",
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "short": [
                    "pretentious nonsense : bunkum —often used as a generalized expression of disagreement"
                ],
                "functional_label": "noun",
                "headword": "bo*lo*ney",
                "offensive": False,
                "stems": ["baloney", "boloney", "boloneys"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "data": [
                                            [
                                                "text",
                                                "{bc}pretentious nonsense {bc}{sx|bunkum||} ",
                                            ],
                                            [
                                                "uns",
                                                [
                                                    [
                                                        [
                                                            "text",
                                                            "often used as a generalized expression of disagreement",
                                                        ]
                                                    ]
                                                ],
                                            ],
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "variants": [{"name": "pho*ney-baloney"}],
                "pronounciations": [
                    {
                        "default": "ˈfō-nē-bə-ˈlō-nē",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/p/phony01v.mp3",
                    }
                ],
                "short": ["phony"],
                "functional_label": "adjective",
                "headword": "pho*ny-ba*lo*ney",
                "offensive": False,
                "stems": ["phoney-baloney", "phony-baloney"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "data": [["text", "{bc}{sx|phony||e}"]]
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
        ]
    )
