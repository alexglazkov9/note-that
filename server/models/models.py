from db import db, ma
from marshmallow import Schema, fields, pre_load, validate
from passlib.hash import pbkdf2_sha256 as sha256



class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(120), nullable = False)
    notes = db.relationship('NoteModel', backref='users', lazy=True)
    
    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username = username).first()

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'username': x.username,
                'password': x.password
            }
        return {'users': list(map(lambda x: to_json(x), UserModel.query.all()))}
    
    @classmethod
    def delete_all(cls):
        try:
            num_rows_deleted = db.session.query(cls).delete()
            db.session.commit()
            return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
        except:
            return {'message': 'Something went wrong'}

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def get_all_notes(self):
        def to_json(x):
            return {
                'text': x.body
            }
        return list(map(lambda x: to_json(x), self.notes))
            

class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'

    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(120))
    
    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti = jti).first()
        return bool(query)

    def add(self):
        db.session.add(self)
        db.session.commit()


class NoteModel(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key = True)
    header = db.Column(db.Text)
    body = db.Column(db.Text)
    created_at = db.Column(db.DateTime)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    notebook_id = db.Column(db.Integer, db.ForeignKey('notebooks.id'), nullable = False)

    @classmethod
    def get_paginated_notes_by_user_id(cls, id, page):
        return cls.query.filter_by(author_id = id).paginate(page, 1, False).items

    @classmethod
    def get_notes_by_user_id(cls, id):
        return cls.query.filter_by(author_id = id).all()

    @classmethod
    def get_note_by_id(cls, author_id, post_id):
        return cls.query.filter_by(id = post_id, author_id = author_id).first()

    @classmethod
    def delete_notes_for_user_id(cls, author_id):
        delete_n = cls.__table__.delete().where(cls.author_id == author_id)
        db.session.execute(delete_n)
        db.session.commit()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class NoteSchema(ma.Schema):
    id = fields.Integer(dump_only=True)
    header = fields.String(required = True)
    body = fields.String(required = True)
    notebook_id = fields.Integer(required = True)
    created_at = fields.DateTime()