from flask import Blueprint

bp = Blueprint('mains', __name__, template_folder='templates')

from Blueprints.main import routes