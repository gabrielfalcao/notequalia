"""add notebook

Revision ID: 382c2fae54c9
Revises: dcbcf1ea9c10
Create Date: 2020-06-21 04:59:31.581956

"""
from alembic import op
import sqlalchemy as db


# revision identifiers, used by Alembic.
revision = '382c2fae54c9'
down_revision = 'dcbcf1ea9c10'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "notebook",
        db.Column("id", db.Integer, primary_key=True),
        db.Column("name", db.Unicode(255), nullable=True, index=True),
    )
    op.add_column('note',
        db.Column(
            "notebook_id",
            db.Integer,
            db.ForeignKey("notebook.id", ondelete="RESTRICT"),
            nullable=True,
        ),
    )

def downgrade():
    op.drop_column('note', 'notebook_id')
    op.drop_table("notebook")
