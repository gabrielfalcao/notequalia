"""pydictionary and merriam webster thesaurus fields

Revision ID: f44468804164
Revises: 382c2fae54c9
Create Date: 2020-07-01 18:04:54.535531

"""
from alembic import op
import sqlalchemy as db


# revision identifiers, used by Alembic.
revision = "f44468804164"
down_revision = "382c2fae54c9"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "terms", db.Column("pydictionary_json", db.UnicodeText, nullable=True)
    )
    op.add_column(
        "terms",
        db.Column("merriamwebster_thesaurus_json", db.UnicodeText, nullable=True),
    )


def downgrade():
    op.drop_column("terms", "merriamwebster_thesaurus_json")
    op.drop_column("terms", "pydictionary")
