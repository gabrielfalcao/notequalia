from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
)


def test_cognate_cross_references():
    ("cognate cross references")

    data = [
        {"cxl": "less common spelling of", "cxtis": [{"cxt": "bologna"}]},
        {
            "cxl": "another definition of",
            "cxtis": [
                {
                    "cxr": "someid",
                    "cxl": "somelabel",
                    "cxt": "another term",
                    "cxn": "123",
                }
            ],
        },
    ]

    cognates = CognateCrossReference.List(data)

    cognates.should.have.length_of(2)

    cog1, cog2 = cognates

    cog1.should.be.a(CognateCrossReference)
    cog2.should.be.a(CognateCrossReference)

    cog1.label.should.equal("less common spelling of")
    cog1.targets.should.have.length_of(1)

    cog1.targets[0].should.be.a(CognateCrossReferenceTarget)
    cog1.targets[0].hyperlink_text.should.equal("bologna")
