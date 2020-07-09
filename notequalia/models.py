import json
import logging

from typing import Optional, List, Dict

# from uiclasses import Model as DataClass
from chemist import Model, db, metadata
from notequalia.lexicon.merriam_webster.models import Definition

# from notequalia.utils import parse_jwt_token


logger = logging.getLogger(__name__)


class NoteBook(Model):
    table = db.Table(
        "notebook",
        metadata,
        db.Column("id", db.Integer, primary_key=True),
        db.Column("name", db.Unicode(255), nullable=True, index=True),
    )


class Note(Model):
    table = db.Table(
        "note",
        metadata,
        db.Column("id", db.Integer, primary_key=True),
        db.Column("name", db.UnicodeText, nullable=True, index=True),
        db.Column("content", db.UnicodeText, nullable=True),
        db.Column(
            "parent_id",
            db.Integer,
            db.ForeignKey("note.id", ondelete="RESTRICT"),
            nullable=True,
        ),
        db.Column(
            "notebook_id",
            db.Integer,
            db.ForeignKey("notebook.id", ondelete="RESTRICT"),
            nullable=True,
        ),
    )

    @property
    def parent(self):
        self._parent = getattr(self, "_parent", None)
        if not self.parent:
            self._parent = self.get_parent()

        return self._parent

    def get_parent(self):
        if not self.parent_id:
            return

        return Note.find_one_by(id=self.parent_id)

    @property
    def content(self):
        try:
            return json.loads(self.get("content", "null"), default=str)
        except Exception:
            logger.exception(f"{self}.content property")
            return self.get("content")


class NoteMail(Model):
    table = db.Table(
        "note_email",
        metadata,
        db.Column("id", db.Integer, primary_key=True),
        db.Column("sender", db.String(320), nullable=True, index=True),
        db.Column("recipient", db.String(320), nullable=True, index=True),
        db.Column("data", db.UnicodeText, nullable=True),
        db.Column("extra", db.UnicodeText, nullable=True),
        db.Column(
            "note_id",
            db.Integer,
            db.ForeignKey("note.id", ondelete="CASCADE"),
            nullable=True,
        ),
    )

    @property
    def note(self):
        self._note = getattr(self, "_note", None)
        if not self.note:
            self._note = self.get_note()

        return self._note

    def get_note(self):
        if not self.note_id:
            return

        return Note.find_one_by(id=self.note_id)


class KeycloakRequest(Model):
    table = db.Table(
        "keycloak_admin_requests",
        metadata,
        db.Column("id", db.Integer, primary_key=True),
        db.Column("method", db.Unicode(20), nullable=True, index=True),
        db.Column("path", db.UnicodeText, nullable=True, index=True),
        db.Column("jwt_token", db.UnicodeText, nullable=True),
        db.Column("args", db.UnicodeText, nullable=True),
        db.Column("data", db.UnicodeText, nullable=True),
        db.Column("headers", db.UnicodeText, nullable=True),
    )

    @property
    def args(self):
        return json.loads(self.get("args", "{}"))

    @property
    def jwt_token(self):
        return json.loads(self.get("jwt_token", "{}"))

    @property
    def data(self):
        return json.loads(self.get("data", "{}"))

    @property
    def headers(self):
        return json.loads(self.get("headers", "{}"))

    # def to_dict(self):
    #     data = self.serialize()
    #     data["headers"] = self.headers
    #     data["data"] = self.data
    #     data["args"] = self.args
    #     data["jwt_token"] = self.jwt_token
    #     return data


class Term(Model):
    table = db.Table(
        "terms",
        metadata,
        db.Column("id", db.Integer, primary_key=True),
        db.Column(
            "term", db.UnicodeText, nullable=True, index=True, unique=True
        ),
        db.Column("content", db.UnicodeText, nullable=True),
        db.Column("pydictionary_json", db.UnicodeText, nullable=True),
        db.Column(
            "merriamwebster_thesaurus_json", db.UnicodeText, nullable=True
        ),
        db.Column(
            "merriamwebster_collegiate_json", db.UnicodeText, nullable=True
        ),
        db.Column(
            "parent_id",
            db.Integer,
            db.ForeignKey("terms.id", ondelete="RESTRICT"),
            nullable=True,
        ),
    )

    def to_dict(self):
        data = {}
        data["id"] = self.id
        data["term"] = self.term
        data["pydictionary"] = self.pydictionary
        data["content"] = self.content
        data["thesaurus"] = self.thesaurus
        data["collegiate"] = self.collegiate
        if self.parent:
            data["parent"] = self.parent.to_dict()

        return data

    @property
    def parent(self):
        self._parent = getattr(self, "_parent", None)
        if not self._parent:
            self._parent = self.get_parent()

        return self._parent

    def get_parent(self):
        if not self.parent_id:
            return

        return Note.find_one_by(id=self.parent_id)

    def get_parsed_json_property(self, property_name: str) -> Optional[dict]:
        try:
            return json.loads(self.get(property_name, "null"))
        except Exception:
            logger.exception(f"{self}.{property_name} property")
            return None

    @property
    def content(self) -> dict:
        return self.get_parsed_json_property('content')

    @property
    def pydictionary(self) -> List[dict]:
        return self.get_parsed_json_property("pydictionary_json")

    @property
    def thesaurus(self) -> List[dict]:
        return self.get_parsed_json_property("merriamwebster_thesaurus_json")

    def get_thesaurus_definitions(self) -> Definition.List:
        return Definition.List(self.thesaurus)

    @property
    def collegiate(self) -> List[dict]:
        return self.get_parsed_json_property("merriamwebster_collegiate_json")

    def get_collegiate_definitions(self) -> Definition.List:
        return Definition.List(self.collegiate)
