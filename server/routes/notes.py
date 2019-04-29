from flask import Blueprint, request
from flask_restful import Resource, reqparse, Api
from flask_jwt_extended import (jwt_required, get_jwt_identity)
from models.models import NoteModel, UserModel, NoteSchema
import datetime

bp = Blueprint('notes', __name__, url_prefix='/note')
api = Api(bp)

notes_schema = NoteSchema(many=True)
note_schema = NoteSchema()

class Note(Resource):
    @jwt_required
    def post(self):
        json_data = request.get_json(force=True)
        if not json_data:
            return {
                'status': 'fail',
                'message':'No data provided'
            }, 400

        data, errors = note_schema.load(json_data)
        if errors:
            return errors, 422

        new_note = NoteModel(
            header = data['header'],
            body = data['body'],
            created_at = datetime.datetime.now(),
            notebook_id = data['notebook_id'],
            author_id = UserModel.find_by_username(get_jwt_identity()).id
        )

        try:
            new_note.save_to_db()
            return {
                'status': 'success',
                'message': 'Note was created',
                'data': note_schema.dump(new_note).data
            }, 201
        except:
            return {
                'status': 'fail',
                'message': 'Something went wrong'
            }, 500
    
    # @jwt_required
    # def get(self, page):
    #     current_user = UserModel.find_by_username(get_jwt_identity())
    #     posts = PostModel.get_paginated_posts_by_user_id(current_user.id, page)
    #     posts = posts_schema.dump(posts).data
    #     return {
    #         'status': 'success',
    #         'data': posts
    #     }, 200

    @jwt_required
    def delete(self):
        NoteModel.delete_notes_for_user_id(1)

    @jwt_required
    def get(self, note_id=None):
        if note_id is None:
            return self.__get_all()
        else:
            return self.__get_by_id(note_id)

    def __get_by_id(self, note_id):
        current_user = UserModel.find_by_username(get_jwt_identity())
        note = NoteModel.get_note_by_id(current_user.id, note_id)
        note = note_schema.dump(note).data
        return {
            'status': 'success',
            'data': note
        }, 200

    def __get_all(self):
        current_user = UserModel.find_by_username(get_jwt_identity())
        notes = NoteModel.get_notes_by_user_id(current_user.id)
        notes = notes_schema.dump(notes).data
        return {
            'status': 'success',
            'data': notes
        }, 200

    @jwt_required
    def put(self, note_id):
        current_user = UserModel.find_by_username(get_jwt_identity())
        note = NoteModel.query.filter_by(id=note_id).first()
        
        if note.author_id != current_user.id:
            return {
                'status': 'fail',
                'message':'User does not have permissions'
            }, 403
        
        json_data = request.get_json(force=True)
        if not json_data:
            return {
                'status': 'fail',
                'message':'No data provided'
            }, 400

        data, errors = note_schema.load(json_data)
        if errors:
            return errors, 422

        note.header = data['header']
        note.body = data['body']

        try:
            note.save_to_db()
            return {
                'status': 'success',
                'data': note_schema.dump(note).data
            }, 200
        except:
            return {
                'status': 'fail',
                'message': 'Something went wrong'
            }, 500

class NewNote(Resource):
    @jwt_required
    def get(self, notebook_id):
        current_user = UserModel.find_by_username(get_jwt_identity())
        new_note = NoteModel(
            header = '',
            body = '',
            created_at = datetime.datetime.now(),
            notebook_id = notebook_id,
            author_id = current_user.id
        )

        try:
            new_note.save_to_db()
            return {
                'status': 'success',
                'message': 'Note was created',
                'data': note_schema.dump(new_note).data
            }, 201
        except:
            return {
                'status': 'fail',
                'message': 'Something went wrong'
            }, 500

api.add_resource(Note, '/<int:note_id>', '/')
api.add_resource(NewNote, '/new/<int:notebook_id>')