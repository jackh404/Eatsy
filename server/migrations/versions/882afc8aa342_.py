"""empty message

Revision ID: 882afc8aa342
Revises: fa2bce0d7de4
Create Date: 2023-12-19 11:38:46.391282

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '882afc8aa342'
down_revision = 'fa2bce0d7de4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('favorites',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('user_id', sa.Uuid(), nullable=True),
    sa.Column('recipe_id', sa.Uuid(), nullable=True),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], name=op.f('fk_favorites_recipe_id_recipes')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_favorites_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_favorites'))
    )
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('email', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('_password_hash', sa.String(), nullable=False))
        batch_op.create_unique_constraint(batch_op.f('uq_users_email'), ['email'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('uq_users_email'), type_='unique')
        batch_op.drop_column('_password_hash')
        batch_op.drop_column('email')

    op.drop_table('favorites')
    # ### end Alembic commands ###
