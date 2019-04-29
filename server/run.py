from flask import Flask
from flask_jwt_extended import JWTManager
import config

def create_app():
    #Flask configuration
    app = Flask(__name__)
    app.config.from_object(config.BaseConfig)

    @app.before_first_request
    def create_tables():
        db.create_all()

    # Fix CORS
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        return response

    #JWT configuration
    jwt = JWTManager(app)

    from models import models
    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decrypted_token):
        jti = decrypted_token['jti']
        return models.RevokedTokenModel.is_jti_blacklisted(jti)
    
    @jwt.expired_token_loader
    def expired_token_callback(expired_token):
        token_type = expired_token['type']
        return jsonify({
            'status': 'fail',
            'message': 'The {} token has expired'.format(token_type)
        }), 401

    from routes import auth, notes, notebooks
    app.register_blueprint(auth.bp)
    app.register_blueprint(notes.bp)
    app.register_blueprint(notebooks.bp)

    from models.db import db
    db.init_app(app)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)