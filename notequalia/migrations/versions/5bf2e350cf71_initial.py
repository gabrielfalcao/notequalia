"""initial

Revision ID: 5bf2e350cf71
Revises:
Create Date: 2020-06-09 03:20:31.879874

"""
from alembic import op
import sqlalchemy as db


# revision identifiers, used by Alembic.
revision = '5bf2e350cf71'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "note",
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
    op.create_table(
        "note_email",
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
    op.create_table(
        "keycloak_admin_requests",
        db.Column("id", db.Integer, primary_key=True),
        db.Column("method", db.Unicode(20), nullable=True, index=True),
        db.Column("path", db.UnicodeText, nullable=True, index=True),
        db.Column("jwt_token", db.UnicodeText, nullable=True),
        db.Column("args", db.UnicodeText, nullable=True),
        db.Column("data", db.UnicodeText, nullable=True),
        db.Column("headers", db.UnicodeText, nullable=True),
    )


def downgrade():
    op.drop_table('keycloak_admin_requests')
    op.drop_table('note_email')
    op.drop_table('note')
