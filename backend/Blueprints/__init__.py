from flask import Flask
from flask_cors import CORS

from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)

    # Initialize Flask extensions here
    
    # Register blueprints here
    from Blueprints.main import bp as main_bp
    app.register_blueprint(main_bp, url_prefix="/")

    from Blueprints.transcriptApi import transcript_api_bp as transcript_api_bp
    app.register_blueprint(transcript_api_bp, url_prefix="/transcribe")

    # Test route
    @app.route('/test/')
    def test_page():
        return '<h1>Testing the Flask Application Factory Pattern</h1>'
    return app
