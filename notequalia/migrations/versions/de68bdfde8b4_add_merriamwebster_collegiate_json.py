"""add merriamwebster_collegiate_json

Revision ID: de68bdfde8b4
Revises: f44468804164
Create Date: 2020-07-02 00:14:33.553814

"""
from alembic import op
import sqlalchemy as db


# revision identifiers, used by Alembic.
revision = "de68bdfde8b4"
down_revision = "f44468804164"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "terms",
        db.Column(
            "merriamwebster_collegiate_json", db.UnicodeText, nullable=True
        ),
    )


def downgrade():
    op.drop_column("terms", "merriamwebster_collegiate_json")
