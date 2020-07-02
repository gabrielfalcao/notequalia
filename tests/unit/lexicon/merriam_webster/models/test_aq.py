from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@with_merriam_webster_fixture("collegiate/alliteration.json")
def test_2_12_aq_collegiate(fixture: Union[dict, list]):
    (
        "2.12 ATTRIBUTION OF QUOTE: AQ - https://dictionaryapi.com/products/json#sec-2.aq"
    )

    Definition.List(fixture).to_dict().should.equal(
        [
            {
                "pronounciations": [
                    {
                        "default": "ə-ˌli-tə-ˈrā-shən",
                        "audio_url": "https://media.merriam-webster.com/audio/prons/en/US/mp3/a/allite02.mp3",
                    }
                ],
                "etymology": [
                    {
                        "text": [
                            'borrowed from New Latin {it}allīterātiōn-, allīterātiō,{/it} from Latin {it}ad-{/it} {et_link|ad-|ad-} + {it}lītera{/it} "letter" + {it}-ātiōn-, -ātiō{/it} {et_link|-ation|-ation} {ma}{mat|letter:1|}{/ma}'
                        ]
                    },
                    {
                        "et_snote": [
                            [
                                [
                                    "t",
                                    "Word apparently coined by the Italian humanist Giovanni Pontano (ca. 1426-1503) in the dialogue {it}Actius{/it} (written 1495-99, first printed 1507).",
                                ]
                            ]
                        ]
                    },
                ],
                "short": [
                    "the repetition of usually initial consonant sounds in two or more neighboring words or syllables (such as wild and woolly, threatening throngs) —called also head rhyme, initial rhyme"
                ],
                "functional_label": "noun",
                "headword": "al*lit*er*a*tion",
                "offensive": False,
                "stems": [
                    "alliteration",
                    "alliterations",
                    "head rhyme",
                    "initial rhyme",
                ],
                "definitions": [
                    {
                        "sense_sequence": {
                            "senses": [
                                {
                                    "defining_text": {
                                        "text": "{bc}the repetition of usually initial {d_link|consonant|consonant:2} sounds in two or more neighboring words or syllables (such as {it}w{/it}ild and {it}w{/it}oolly, {it}thr{/it}eatening {it}thr{/it}ongs) "
                                    }
                                }
                            ]
                        }
                    }
                ],
            }
        ]
    )
