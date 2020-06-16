# -*- coding: utf-8 -*-
#
import json
import logging
from typing import Tuple
from flask_restplus import Resource
from flask_restplus import fields
from flask_restplus import reqparse
from flask_restplus import inputs

from notequalia.models import Term
from notequalia.lexicon_engine import LexiconEngine
from notequalia.utils import json_response
from .base import api

logger = logging.getLogger(__name__)


definition_json = api.model(
    "Definition",
    {"term": fields.String(required=True, description="the term to be defined")},
)

parser = reqparse.RequestParser()
# parser.add_argument("access_token", location="args", help="The opaque JWT Acess Token")

# parser.add_argument('session', location='cookies', help='the session id containing the state of authentication')

term_ns = api.namespace(
    "Term API V1", description="Word Definition API", path="/api/v1/dict"
)


def define_new_term(term: str) -> Tuple[Term, bool]:
    result = LexiconEngine().define_term(term)
    content = json.dumps(result)
    model = Term.find_one_by(term=term)
    created = False
    if not model:
        created = True
        model =  Term.create(term=term, content=content)
    else:
        model.set(content=content).save()

    return model, created


@term_ns.route("/definitions")
@term_ns.expect(parser)
class DefinitionsEndpoint(Resource):
    @term_ns.expect(definition_json)
    def post(self):
        term = (api.payload.get("term") or "").strip()
        model, created = define_new_term(term)
        return json_response(model.to_dict(), created and 201 or 200)

    def get(self):
        terms = sorted([t.to_dict() for t in Term.all()], key=lambda d: d.get('term'))
        return json_response(terms, 200)


@term_ns.route("/term/<term>")
@term_ns.expect(parser)
class TermEndpoint(Resource):
    def delete(self, term):
        found = Term.find_one_by(term=term)
        if not found:
            return json_response({"error": f"term {term!r} does not exist"}, 404)

        found.delete()
        return json_response(found.to_dict(), 200)

    def get(self, term):
        found = Term.find_one_by(term=term)
        if not found:
            return json_response({"error": f"term {term!r} does not exist"}, 404)

        return json_response(found.to_dict(), 200)
