"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as db
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
    ${upgrades if upgrades else "pass"}
    op.create_table(
        "table_name",
        db.Column("id", db.Integer, primary_key=True),
    )


def downgrade():
    op.drop_table(
        "table_name"
    )
    ${downgrades if downgrades else "pass"}
