from flask import render_template
from Blueprints.main import bp

@bp.route('/')
def index():
    return render_template('index.html')