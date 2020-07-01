import json
from notequalia.web.api.terms import define_new_term
from notequalia.lexicon.merriam_webster.models import Definition

from tests.functional.helpers import web_test, vcr


@vcr.use_cassette
def test_thesaurus_term_verb_encumber():
    ("define_new_term('encumber') should define a verb via thesaurus")

    term, created = define_new_term("encumber")

    definitions = term.get_thesaurus_definitions()
    definitions.should.have.length_of(1)

    definitions[0].should.be.a(Definition)
