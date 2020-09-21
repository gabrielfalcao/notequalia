from unittest import skip
from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/agree.json")
def test_2_22_syns_collegiate(fixture: Union[dict, list]):
    ("2.22 SYNONYMS SECTION: SYNS - https://dictionaryapi.com/products/json#sec-2.syns")

    data = Definition.List(fixture).to_dict()
    str(data).should.contain("synonym_discussions")
    data.should.equal(
        [
            {
                "pronounciations": [
                    {
                        "default": "ə-ˈgrē",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/a/agree001.mp3",
                    }
                ],
                "etymology": [
                    {
                        "text": [
                            'Middle English {it}agreen{/it} "to please, gratify, consent, concur," borrowed from Anglo-French {it}agreer,{/it} from {it}a-,{/it} verb-forming prefix (going back to Latin {it}ad-{/it} {et_link|ad-|ad-}) + {it}-greer,{/it} verbal derivative of {it}gré{/it} "gratitude, satisfaction, liking, pleasure, assent," going back to Latin {it}grātum,{/it} neuter of {it}grātus{/it} "thankful, received with gratitude, welcome, pleasant" {ma}{mat|grace:1|}{/ma}'
                        ]
                    }
                ],
                "short": [
                    "to concur in (something, such as an opinion) : admit, concede",
                    "to consent to as a course of action",
                    "to settle on by common consent : arrange",
                ],
                "functional_label": "verb",
                "headword": "agree",
                "offensive": False,
                "stems": ["agree", "agreed", "agreeing", "agrees"],
                "definitions": [
                    {
                        "verb_divider": "transitive verb",
                        "sense_sequence": {
                            "senses": [
                                {
                                    "number": "1 a",
                                    "defining_text": {
                                        "text": "{bc}to {d_link|concur|concur} in (something, such as an opinion) {bc}{sx|admit||}, {sx|concede||} ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "They {wi}agreed{/wi} that he was right."
                                            }
                                        ],
                                    },
                                },
                                {
                                    "number": "b",
                                    "defining_text": {
                                        "text": "{bc}to consent to as a course of action ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "She {it}agreed{/it} to sell him the house."
                                            }
                                        ],
                                    },
                                },
                                {
                                    "number": "2",
                                    "status_labels": ["chiefly British"],
                                    "defining_text": {
                                        "text": "{bc}to settle on by common consent {bc}{sx|arrange||} ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "… I {it}agreed{/it} rental terms with him …",
                                                "attribution": {},
                                            }
                                        ],
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
                                    "number": "1",
                                    "defining_text": {
                                        "text": "{bc}to accept or concede something (such as the views or wishes of another) ",
                                        "verbal_illustrations": [
                                            {"text": "{wi}agree{/wi} to a plan"}
                                        ],
                                    },
                                },
                                {
                                    "number": "2 a",
                                    "defining_text": {
                                        "text": "{bc}to achieve or be in harmony (as of opinion, feeling, or purpose) ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "We {wi}agree{/wi} in our taste in music."
                                            }
                                        ],
                                    },
                                },
                                {
                                    "number": "b",
                                    "defining_text": {
                                        "text": "{bc}to get along together"
                                    },
                                },
                                {
                                    "number": "c",
                                    "defining_text": {
                                        "text": "{bc}to come to terms ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "{wi}agree{/wi} on a fair division of profits"
                                            }
                                        ],
                                    },
                                },
                                {
                                    "number": "3 a",
                                    "defining_text": {
                                        "text": "{bc}to be similar {bc}{sx|correspond||} ",
                                        "verbal_illustrations": [
                                            {"text": "Both copies {wi}agree{/wi}."}
                                        ],
                                    },
                                },
                                {
                                    "number": "b",
                                    "defining_text": {
                                        "text": "{bc}to be consistent ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "The story {wi}agrees{/wi} with the facts."
                                            }
                                        ],
                                    },
                                },
                                {
                                    "number": "4",
                                    "defining_text": {
                                        "text": "{bc}to be fitting, pleasing, or healthful {bc}{sx|suit||} ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "This climate {wi}agrees{/wi} with him."
                                            }
                                        ],
                                    },
                                },
                                {
                                    "number": "5",
                                    "status_labels": ["grammar"],
                                    "defining_text": {
                                        "text": "{bc}to have an inflectional form denoting identity or other regular correspondence in a grammatical category (such as gender, number, case, or person)"
                                    },
                                },
                            ]
                        },
                    },
                ],
                "synonym_discussions": [
                    {
                        "paragraph_label": "synonyms",
                        "paragraphs": [
                            "{sc}agree{/sc} {sc}concur{/sc} {sc}coincide{/sc} mean to come into or be in harmony regarding a matter of opinion. {sc}agree{/sc} implies complete accord usually attained by discussion and adjustment of differences. ",
                            " {sc}concur{/sc} often implies approval of someone else's statement or decision. ",
                            " {sc}coincide{/sc}, used more often of opinions, judgments, wishes, or interests than of people, implies total agreement. ",
                        ],
                    }
                ],
            },
            {
                "short": [
                    "to be alike in the form that shows whether a word is singular or plural"
                ],
                "functional_label": "idiom",
                "headword": "agree in number",
                "offensive": False,
                "stems": ["agree in number"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}to be alike in the form that shows whether a word is singular or plural ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "A verb and its subject must {it}agree in number{/it}."
                                            }
                                        ],
                                    }
                                }
                            ]
                        },
                        "status_labels": ["grammar"],
                    }
                ],
            },
            {
                "variants": [{"name": "agree to differ"}],
                "short": [
                    "to agree not to argue anymore about a difference of opinion"
                ],
                "functional_label": "idiom",
                "headword": "agree to disagree",
                "offensive": False,
                "stems": ["agree to differ", "agree to disagree"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}to agree not to argue anymore about a difference of opinion ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "He likes golf and his wife likes tennis, so when it comes to sports, they have {it}agreed to disagree{/it}."
                                            }
                                        ],
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
            {
                "short": ["to regard (something) with approval"],
                "functional_label": "phrasal verb",
                "headword": "agree with",
                "offensive": False,
                "stems": ["agree with", "agreed with", "agreeing with", "agrees with"],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}to regard (something) with approval ",
                                        "verbal_illustrations": [
                                            {
                                                "text": "Do you {it}agree with{/it} capital punishment?"
                                            }
                                        ],
                                    }
                                }
                            ]
                        }
                    }
                ],
            },
        ]
    )
