# -*- coding: utf-8 -*-
#
import re
import json
import logging


from typing import Tuple
from datetime import datetime
from flask_restplus import Resource
from flask_restplus import fields
from flask_restplus import reqparse
from flask_restplus import inputs

from notequalia.models import Term
from notequalia.lexicon_engine import (
    PyDictionaryClient,
    MerriamWebsterAPIClient,
)
from notequalia.utils import json_response
from .base import api, application

from .auth import authorization_parser, require_auth


logger = logging.getLogger(__name__)


definition_json = api.model(
    "Definition",
    {
        "term": fields.String(
            required=True, description="the term to be defined"
        )
    },
)

parser = reqparse.RequestParser()
# parser.add_argument("access_token", location="args", help="The opaque JWT Acess Token")

# parser.add_argument('session', location='cookies', help='the session id containing the state of authentication')

term_ns = api.namespace(
    "Term API V1", description="Word Definition API", path="/api/v1/dict"
)


def define_new_term(term: str) -> Tuple[Term, bool]:
    term = term.lower().strip()
    pydictionary = PyDictionaryClient().define_term(term)
    thesaurus = MerriamWebsterAPIClient().get_thesaurus_definitions(term)
    collegiate = MerriamWebsterAPIClient().get_collegiate_definitions(term)

    # content has all the human-readable data for react apps
    content = json.dumps(
        {
            "pydictionary": pydictionary,
            "thesaurus": thesaurus.to_dict(only_visible=True),
            "collegiate": collegiate.to_dict(only_visible=True),
        },
        default=str,
    )
    model = Term.find_one_by(term=term)
    created = False

    params = dict(
        content=content,
        merriamwebster_thesaurus_json=json.dumps(
            thesaurus.to_dict(), default=str
        ),
        merriamwebster_collegiate_json=json.dumps(
            collegiate.to_dict(), default=str
        ),
        pydictionary_json=json.dumps(pydictionary, default=str),
    )
    if not model:
        created = True
        model = Term.create(term=term, **params)
    else:
        model.set(**params).save()

    return model, created


def validate_term(term: str) -> str:
    '''ensures that we only process words without special characters other
    than "dash"'''
    found = re.search(r"^\s*[\w\s-]+\s*$", term)
    if not found:
        return ""

    return found.group(0).strip().lower()


@term_ns.route("/definitions")
@term_ns.expect(authorization_parser, validate=True)
class DefinitionsEndpoint(Resource):
    @term_ns.expect(definition_json)
    @require_auth(scope='term:write manage:terms')
    def post(self):
        term = validate_term((api.payload.get("term") or "").strip())
        if not term:
            return json_response({"error": "term is required"}, 400)

        if len(term) > 50:
            return json_response(
                {"error": f"term cannot have more than 50 characters"}, 400
            )

        model, created = define_new_term(term)
        return json_response(model.to_dict(), created and 201 or 200)

    def get(self):
        terms = [t.to_dict() for t in Term.latest()]
        return json_response(terms, 200)


@term_ns.route("/term/<term>")
@term_ns.expect(parser)
class TermEndpoint(Resource):
    @require_auth(scope='manage:terms term:write')
    def delete(self, term):
        found = Term.find_one_by(term=term)
        if not found:
            return json_response(
                {"error": f"term {term!r} does not exist"}, 404
            )

        found.delete()
        return json_response(found.to_dict(), 200)

    def get(self, term):
        found = Term.find_one_by(term=term)
        if not found:
            return json_response(
                {"error": f"term {term!r} does not exist"}, 404
            )

        return json_response(found.to_dict(), 200)


@term_ns.route("/download")
class Download(Resource):
    def get(self):
        return lexicon_backup_response()


def lexicon_backup_response(should_reprocess=False):
    if should_reprocess:
        items = reprocess()
        name = "backup-reprocessed"
    else:
        name = "backup"
        items = Term.all()

    terms = sorted([t.to_dict() for t in items], key=lambda d: d.get("term"))
    data = {"terms": terms, "count": len(terms)}
    now = datetime.utcnow().strftime("%Y-%m-%d")
    headers = {
        "Content-Disposition": f'attachment; filename="lexicon-{name}-{now}.json"'
    }
    return json_response(data, 200, headers=headers)


@application.route("/backup.json")
def backup():
    return lexicon_backup_response()


@application.route("/reprocess", methods=["POST"])
@require_auth(scope='term:write manage:terms')
def backup_reprocess():
    return lexicon_backup_response(should_reprocess=True)


def reprocess():
    items = Term.all()
    total = len(items)
    for i, term in enumerate(items):
        logger.info(f"reprocessing term {i}/{total}: {term.term}")
        model, created = define_new_term(term.term)
        logger.info(f"updated term {i}/{total}: {term.term}")
        yield model
