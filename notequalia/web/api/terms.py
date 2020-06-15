# -*- coding: utf-8 -*-
#
import json
import logging
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
    {
        "term": fields.String(
            required=True, description="the term to be defined"
        ),
    },
)

parser = reqparse.RequestParser()
# parser.add_argument("access_token", location="args", help="The opaque JWT Acess Token")

# parser.add_argument('session', location='cookies', help='the session id containing the state of authentication')

term_ns = api.namespace(
    "Term API V1",
    description="Word Definition API",
    path="/api/v1/dict",
)


@term_ns.route("/definitions")
@term_ns.expect(parser)
class DefinitionsEndpoint(Resource):
    @term_ns.expect(definition_json)
    def post(self):
        term = (api.payload.get("term") or "").strip()
        result = LexiconEngine().define_term(term)
        model = Term.get_or_create(term=term)
        model.set(content=json.dumps(result))
        model.save()
        try:
            return json_response(model.to_dict(), 201)
        except Exception as e:
            return {"error": str(e)}, 400
