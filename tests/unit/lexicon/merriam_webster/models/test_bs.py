from unittest import skip
from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@skip("Pending Implementation - https://dictionaryapi.com/products/json#sec-2.bs")
@with_merriam_webster_fixture("collegiate/feline.json")
def test_2_10_9_bs_collegiate(fixture: Union[dict, list]):
    ("2.10.9 BINDING SUBSTITUTE: BS - https://dictionaryapi.com/products/json#sec-2.bs")

    Definition.List(fixture).to_dict().should.equal([])
