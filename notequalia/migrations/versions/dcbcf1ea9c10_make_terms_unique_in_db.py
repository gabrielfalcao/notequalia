"""add unique constraint to terms

Revision ID: dcbcf1ea9c10
Revises: ded2945a875f
Create Date: 2020-06-16 01:36:55.017982

"""
from alembic import op
import sqlalchemy as db


# revision identifiers, used by Alembic.
revision = "dcbcf1ea9c10"
down_revision = "ded2945a875f"
branch_labels = None
depends_on = None


def upgrade():
    op.create_unique_constraint("unique_term", "terms", ["term"])


def downgrade():
    op.drop_unique_constraint("unique_term", "terms")
