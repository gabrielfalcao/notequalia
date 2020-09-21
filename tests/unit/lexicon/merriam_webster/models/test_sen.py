from unittest import skip
from typing import Union
from notequalia.lexicon.merriam_webster.models import CognateCrossReference
from notequalia.lexicon.merriam_webster.models import (
    CognateCrossReferenceTarget,
    Definition,
)
from tests.unit.helpers import with_merriam_webster_fixture


@skip("Pending Implementation - https://dictionaryapi.com/products/json#sec-2.sen")
@with_merriam_webster_fixture("collegiate/tab.json")
def test_2_10_8_sen_collegiate(fixture: Union[dict, list]):
    ("2.10.8 TRUNCATED SENSE: SEN - https://dictionaryapi.com/products/json#sec-2.sen")

    Definition.List(fixture).to_dict().should.equal([])
