from unittest import skip
from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@skip("Pending Implementation - https://dictionaryapi.com/products/json#sec-2.pseq")
@with_merriam_webster_fixture("collegiate/tab.json")
def test_2_10_7_pseq_collegiate(fixture: Union[dict, list]):
    ("2.10.7 DIVIDED SENSE: PSEQ - https://dictionaryapi.com/products/json#sec-2.pseq")

    Definition.List(fixture).to_dict().should.equal([])
