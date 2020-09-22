"""add created-at token

Revision ID: b2d7042664e6
Revises: 53a3754af1f9
Create Date: 2020-09-22 03:22:33.184296

"""
from alembic import op
import sqlalchemy as db


# revision identifiers, used by Alembic.
revision = 'b2d7042664e6'
down_revision = '53a3754af1f9'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "auth_access_token", db.Column("created_at", db.DateTime, nullable=True)
    )


def downgrade():
    op.drop_column("auth_access_token", "created_at")
