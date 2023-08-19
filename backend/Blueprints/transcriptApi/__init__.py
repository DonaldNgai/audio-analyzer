from flask import Blueprint, redirect, url_for

transcript_api_bp = Blueprint("transcript_api", __name__)

@transcript_api_bp.route("/")
def index():
    return "This is the transcript api blueprint"

@transcript_api_bp.route("/add/<int:num1>/<int:num2>")
def add(num1, num2):
    return addTwo(num1,num2)

@transcript_api_bp.route("/go_to_main")
def go_to_main():
    return redirect(url_for("main.index")) # main, and then function name which is index in routes.py


def addTwo(int1, int2):
    return str(int1 + int2)