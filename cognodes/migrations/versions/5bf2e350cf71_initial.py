"""initial

Revision ID: 5bf2e350cf71
Revises:
Create Date: 2020-06-09 03:20:31.879874

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5bf2e350cf71'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "note",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.UnicodeText, nullable=True, index=True),
        sa.Column("content", sa.UnicodeText, nullable=True),
        sa.Column(
            "parent_id",
            sa.Integer,
            sa.ForeignKey("note.id", ondelete="RESTRICT"),
            nullable=True,
        ),
    )
    op.create_table(
        "note_email",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("sender", sa.String(320), nullable=True, index=True),
        sa.Column("recipient", sa.String(320), nullable=True, index=True),
        sa.Column("data", sa.UnicodeText, nullable=True),
        sa.Column("extra", sa.UnicodeText, nullable=True),
        sa.Column(
            "note_id",
            sa.Integer,
            sa.ForeignKey("note.id", ondelete="CASCADE"),
            nullable=True,
        ),
    )
    op.create_table(
        "keycloak_admin_requests",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("method", sa.Unicode(20), nullable=True, index=True),
        sa.Column("path", sa.UnicodeText, nullable=True, index=True),
        sa.Column("jwt_token", sa.UnicodeText, nullable=True),
        sa.Column("args", sa.UnicodeText, nullable=True),
        sa.Column("data", sa.UnicodeText, nullable=True),
        sa.Column("headers", sa.UnicodeText, nullable=True),
    )


def downgrade():
    op.drop_table('keycloak_admin_requests')
    op.drop_table('note_email')
    op.drop_table('note')
