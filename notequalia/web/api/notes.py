# -*- coding: utf-8 -*-
#
import logging
from flask_restplus import Resource
from flask_restplus import fields
from flask_restplus import reqparse
from flask_restplus import inputs

from notequalia.models import Note
from .base import api, oidc

logger = logging.getLogger(__name__)


note_json = api.model(
    "Note",
    {
        "name": fields.String(
            required=True, description="name unique name for this note"
        ),
        "content": fields.String(
            required=True, description="the JSON data representing the note"
        ),
    },
)

parser = reqparse.RequestParser()
parser.add_argument("access_token", location="args", help="The opaque JWT Acess Token")

# parser.add_argument('oidc_id_token', location='cookies', help='the id token provided by keycloak')
# parser.add_argument('session', location='cookies', help='the session id containing the state of authentication')

note_ns = api.namespace(
    "Note API V1",
    description="Fake NewStore Note API",
    path="/api/v1/notes",
)


@note_ns.route("/notes")
@note_ns.expect(parser)
class NoteListEndpoint(Resource):
    @oidc.accept_token(True, scopes_required=["note:read"])
    def get(self):
        notes = Note.all()
        return [u.to_dict() for u in notes]

    @note_ns.expect(note_json)
    @oidc.accept_token(True, scopes_required=["note:write"])
    def post(self):
        name = api.payload.get("name")
        content = api.payload.get("content")
        try:
            note = Note.create(name=name, content=content)
            return note.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

    @oidc.accept_token(True, scopes_required=["note:write"])
    def delete(self):
        response = []
        try:
            for note in Note.all():
                note.delete()
                response.append(note.to_dict())
            return response, 200
        except Exception as e:
            return {"error": str(e)}, 400


@note_ns.route("/note/<note_id>")
@note_ns.expect(parser)
class NoteEndpoint(Resource):
    @oidc.accept_token(True, scopes_required=["note:read"])
    def get(self, note_id):
        note = Note.find_one_by(id=note_id)
        if not note:
            return {"error": "note not found"}, 404

        return note.to_dict()

    @oidc.accept_token(True, scopes_required=["note:write"])
    def delete(self, note_id):
        note = Note.find_one_by(id=note_id)
        if not note:
            return {"error": "note not found"}, 404

        note.delete()
        return {"deleted": note.to_dict()}

    @oidc.accept_token(True, scopes_required=["note:write"])
    @note_ns.expect(note_json)
    def put(self, note_id):
        note = Note.find_one_by(id=note_id)
        if not note:
            return {"error": "note not found"}, 404

        name = api.payload.get("name")
        content = api.payload.get("content")
        note = note.update_and_save(name=name, content=content)
        return note.to_dict(), 200
