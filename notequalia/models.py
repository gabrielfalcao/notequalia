import json
import jwt
import bcrypt
import logging

from datetime import datetime, timedelta
from dateutil.parser import parse as parse_datetime

from typing import Optional, List, Dict
from sqlalchemy import desc

# from uiclasses import Model as DataClass
from chemist import Model, db, metadata
from notequalia.lexicon.merriam_webster.models import Definition
from notequalia import config

# from notequalia.utils import parse_jwt_token


def now():
    return datetime.utcnow()


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
        db.Column("term", db.UnicodeText, nullable=True, index=True, unique=True),
        db.Column("content", db.UnicodeText, nullable=True),
        db.Column("pydictionary_json", db.UnicodeText, nullable=True),
        db.Column("merriamwebster_thesaurus_json", db.UnicodeText, nullable=True),
        db.Column("merriamwebster_collegiate_json", db.UnicodeText, nullable=True),
        db.Column(
            "parent_id",
            db.Integer,
            db.ForeignKey("terms.id", ondelete="RESTRICT"),
            nullable=True,
        ),
    )

    @classmethod
    def latest(cls, *expressions):
        table = cls.table
        order_by = (desc(table.c.id),)
        return cls.where_many(order_by=order_by)

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
        return self.get_parsed_json_property("content")

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


class User(Model):
    table = db.Table(
        "auth_user",
        metadata,
        db.Column("id", db.Integer, primary_key=True),
        db.Column("email", db.String(100), nullable=False, unique=True),
        db.Column("password", db.Unicode(128), nullable=False),
        db.Column("created_at", db.DateTime),
        db.Column("updated_at", db.DateTime),
        db.Column("requested_subscription_at", db.DateTime),
        db.Column("invited_at", db.DateTime),
        db.Column("activated_at", db.DateTime),
    )

    def to_dict(self):
        data = self.serialize()
        data.pop("password")
        return data

    def change_password(self, old_password, new_password):
        right_password = self.match_password(old_password)
        if right_password:
            return self.set_password(new_password)

        return False

    def set_password(self, password) -> bool:
        self.set(password=self.secretify_password(password))
        self.save()
        return True

    def match_password(self, plain) -> bool:
        return bcrypt.checkpw(plain.encode("utf-8"), self.password.encode("utf-8"))

    @classmethod
    def authenticate(cls, email, password):
        email = email.lower()
        user = cls.find_one_by(email=email)
        if not user:
            return

        if user.match_password(password):
            return user

    @classmethod
    def secretify_password(cls, plain) -> str:
        if not plain:
            raise RuntimeError(f"cannot hash without a plain password: {plain!r}")
        return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    @classmethod
    def create(cls, email, password, **kw):
        email = email.lower()
        password = cls.secretify_password(password)
        return super(User, cls).create(email=email, password=password, **kw)

    @property
    def token_secret(self):
        return bcrypt.kdf(
            password=config.SECRET_KEY,
            salt=self.password.encode("utf-8"),
            desired_key_bytes=32,
            rounds=100,
        )

    def create_token(self, duration: int = 28800):
        """
        :param duration: in seconds - defaults to 28800 (8 hours)
        """
        created_at = now()
        access_token = jwt.encode(
            {"created_at": created_at.isoformat(), "duration": duration}, self.token_secret, algorithm="HS256"
        )
        return AccessToken.create(
            content=access_token,
            scope='manage:notes manage:terms',
            user_id=self.id,
        )

    def validate_token(self, access_token: str) -> bool:
        data = jwt.decode(access_token, self.token_secret, algorithms=['HS256'])
        created_at = date['created_at']
        duration = date['duration']
        valid_until = parse_datetime(created_at) + timedelta(seconds=duration)
        return now() < valid_until

class AccessToken(Model):
    table = db.Table(
        "auth_access_token",
        metadata,
        db.Column("id", db.Integer, primary_key=True),
        db.Column("content", db.UnicodeText, nullable=False, unique=True),
        db.Column("scope", db.UnicodeText, nullable=True),
        db.Column("created_at", db.DateTime),
        db.Column("duration", db.Integer),
        db.Column(
            "user_id",
            db.Integer,
            db.ForeignKey("auth_user.id", ondelete="RESTRICT"),
            nullable=False,
        ),
    )

    @property
    def user(self):
        return User.find_one_by(id=self.user_id) if self.user_id else None

    def to_dict(self):
        data = self.serialize()
        data.pop("id")
        data["access_token"] = data.pop("content")
        return data
