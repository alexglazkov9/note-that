from flask import Blueprint, request
from flask_restful import Resource, reqparse, Api
from flask_jwt_extended import (jwt_required, get_jwt_identity)
from models.notebook import NotebookModel, NotebookSchema
from models.models import UserModel

bp = Blueprint('notebooks', __name__, url_prefix='/notebook')
api = Api(bp)

notebooks_schema = NotebookSchema(many=True)
notebook_schema = NotebookSchema()

class Notebook(Resource):
    @jwt_required
    def post(self):
        json_data = request.get_json(force = True)
        if not json_data:
            return {
                'status': 'fail',
                'message':'No data provided'
            }, 400
        
        data, errors = notebook_schema.load(json_data)
        if errors:
            return errors, 422
        
        new_notebook = NotebookModel(
            title = data['title'],
            author_id = UserModel.find_by_username(get_jwt_identity()).id
        )

        try:
            new_notebook.save_to_db()
            return {
                'status': 'success',
                'message': 'Notebook was created',
                'data': notebook_schema.dump(new_notebook).data
            }, 201
        except:
            return {
                'status': 'fail',
                'message': 'Something went wrong'
            }, 500
    
    @jwt_required
    def get(self, notebook_uuid=None):
        if notebook_uuid is None:
            return self.__get_all()
        else:
            return self.__get_by_id(note_id)

    def __get_all(self):
        current_user = UserModel.find_by_username(get_jwt_identity())
        notebooks = NotebookModel.get_notebooks_by_user_id(current_user.id)
        notebooks = notebooks_schema.dump(notebooks).data
        return {
            'status': 'success',
            'data': notebooks
        }, 200

api.add_resource(Notebook, '/<int:notebook_uuid>', '/')