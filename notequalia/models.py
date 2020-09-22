import json
import hashlib
import jwt
import bcrypt
import logging

from datetime import datetime, timedelta
from dateutil.parser import parse as parse_datetime
from cached_property import cached_property
from typing import Optional, List, Dict
from sqlalchemy import desc

# from uiclasses import Model as DataClass
from chemist import Model, db, metadata
from notequalia.lexicon.merriam_webster.models import Definition
from notequalia import config
from notequalia.es import ElasticSearchEngine
from ordered_set import OrderedSet

# from notequalia.utils import parse_jwt_token


logger = logging.getLogger(__name__)


def now():
    return datetime.utcnow()


def scope_string_to_set(scope: str) -> OrderedSet:
    return OrderedSet(filter(bool, scope.split()))


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

    @cached_property
    def parent(self):
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

    @cached_property
    def note(self):
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

    def __repr__(self):
        return f'<Term: "{self.term}">'

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

    @cached_property
    def parent(self):
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

    def send_to_elasticsearch(self, engine: ElasticSearchEngine):
        logger.info(f"indexing {self}")
        if not self.term:
            logger.warning(f"skipping elasticsearch indexing of unnamed term {self}")
            return

        document_id = hashlib.sha256(self.term.encode("utf-8")).hexdigest()
        raw = self.to_dict()
        mw_thesaurus = raw.get("thesaurus")
        mw_collegiate = raw.get("collegiate")

        for definition in mw_thesaurus:
            functional_label = definition.get("functional_label")
            logger.info(
                f"stored {functional_label} %s",
                engine.store_document(
                    "dict_mw_thesaurus", functional_label, document_id, body=definition
                ),
            )

        for definition in mw_collegiate:
            functional_label = definition.get("functional_label")
            logger.info(
                f"stored {functional_label} %s",
                engine.store_document(
                    "dict_mw_collegiate", functional_label, document_id, body=definition
                ),
            )


class AccessToken(Model):
    table = db.Table(
        "auth_access_token",
        metadata,
        db.Column("id", db.Integer, primary_key=True),
        db.Column("content", db.UnicodeText, nullable=False, unique=True),
        db.Column("scope", db.UnicodeText, nullable=True),
        db.Column(
            "created_at", db.Unicode(255), default=lambda: datetime.utcnow().isoformat()
        ),
        db.Column("duration", db.Integer),
        db.Column(
            "user_id",
            db.Integer,
            db.ForeignKey("auth_user.id", ondelete="RESTRICT"),
            nullable=False,
        ),
    )

    @cached_property
    def scopes(self):
        return scope_string_to_set(self.scope)

    @property
    def user(self):
        return User.find_one_by(id=self.user_id) if self.user_id else None

    def to_dict(self):
        data = self.user.to_dict()
        data.pop("id")
        data["access_token"] = self.serialize()
        return data

    def matches_scope(self, scope: str) -> bool:
        expired = not self.user.validate_token(self)
        if expired:
            return False

        scope_choices = scope_string_to_set(scope)
        intersection = self.scopes.intersection(scope_choices)
        if not intersection:
            logger.warning(
                f"token {self} ({self.scopes}) of user {self.user} does not have any of the required scope {scope}"
            )

        return bool(intersection)


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

    def __str__(self):
        return f"<User id={self.id} email={self.email!r}>"

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
    def find_one_by_email(cls, email):
        email = email.lower()
        return cls.find_one_by(email=email)

    @classmethod
    def authenticate(cls, email, password):
        user = cls.find_one_by_email(email)
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

    def create_token(
        self, scope: str = "manage:notes manage:terms", duration: int = 28800, **kw
    ):
        """
        :param duration: in seconds - defaults to 28800 (8 hours)
        """
        created_at = now().isoformat()
        access_token = jwt.encode(
            {
                "created_at": created_at,
                "duration": duration,
                "scope": f"{scope} admin admin:user",
            },
            self.token_secret,
            algorithm="HS256",
        )
        return AccessToken.create(
            content=access_token.decode("utf-8"),
            scope=scope,
            user_id=self.id,
            created_at=created_at,
            duration=duration,
        )

    def validate_token(self, access_token: AccessToken) -> bool:
        data = jwt.decode(access_token.content, self.token_secret, algorithms=["HS256"])
        created_at = access_token.created_at
        duration = access_token.duration
        valid_until = parse_datetime(created_at) + timedelta(seconds=duration)
        return now() < valid_until
