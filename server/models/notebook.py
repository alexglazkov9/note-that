from db import db, ma
from marshmallow import fields
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text as sa_text



class NotebookModel(db.Model):
    __tablename__ = 'notebooks'

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    notes = db.relationship('NoteModel')

    @classmethod
    def get_notebooks_by_user_id(cls, id):
        return cls.query.filter_by(author_id = id).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class NotebookSchema(ma.Schema):
    id = fields.Integer()
    title = fields.String()