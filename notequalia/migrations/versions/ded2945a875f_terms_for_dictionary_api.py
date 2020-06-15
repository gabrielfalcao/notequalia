"""terms for dictionary api

Revision ID: ded2945a875f
Revises: 5bf2e350cf71
Create Date: 2020-06-16 00:43:47.971209

"""
from alembic import op
import sqlalchemy as db


# revision identifiers, used by Alembic.
revision = 'ded2945a875f'
down_revision = '5bf2e350cf71'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "terms",
        db.Column("id", db.Integer, primary_key=True),
        db.Column("term", db.UnicodeText, nullable=True, index=True),
        db.Column("content", db.UnicodeText, nullable=True),
        db.Column(
            "parent_id",
            db.Integer,
            db.ForeignKey("terms.id", ondelete="RESTRICT"),
            nullable=True,
        ),
    )



def downgrade():
    op.drop_table('terms')
