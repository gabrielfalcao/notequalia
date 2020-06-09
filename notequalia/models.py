import json
import logging

# from typing import Optional
# from uiclasses import Model as DataClass
from chemist import Model, db, metadata

# from notequalia.utils import parse_jwt_token


logger = logging.getLogger(__name__)


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
