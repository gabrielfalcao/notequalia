"""user authentication

Revision ID: 53a3754af1f9
Revises: de68bdfde8b4
Create Date: 2020-07-21 00:12:09.345878

"""
from alembic import op
import sqlalchemy as db


# revision identifiers, used by Alembic.
revision = "53a3754af1f9"
down_revision = "de68bdfde8b4"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "auth_user",
        db.Column("id", db.Integer, primary_key=True),
        db.Column("email", db.String(100), nullable=False, unique=True),
        db.Column("password", db.Unicode(128), nullable=False),
        db.Column("created_at", db.DateTime),
        db.Column("updated_at", db.DateTime),
        db.Column("requested_subscription_at", db.DateTime),
        db.Column("invited_at", db.DateTime),
        db.Column("activated_at", db.DateTime),
    )
    op.create_table(
        "auth_access_token",
        db.Column("id", db.Integer, primary_key=True),
        db.Column("duration", db.Integer),
        db.Column("content", db.UnicodeText, nullable=False),
        db.Column("scope", db.UnicodeText, nullable=True),
        db.Column(
            "user_id",
            db.Integer,
            db.ForeignKey("auth_user.id", ondelete="RESTRICT"),
            nullable=False,
        ),
    )


def downgrade():
    op.drop_table("auth_access_token")
    op.drop_table("auth_user")
