from flask import Blueprint, redirect, url_for, request
import os
import tempfile
from flask_cors import CORS

import openai
openai.api_key = os.getenv("OPENAI_API_KEY")



transcript_api_bp = Blueprint("transcript_api", __name__)
CORS(transcript_api_bp)

@transcript_api_bp.route("/")
def index():
    return "This is the transcript api blueprint"

# @transcript_api_bp.route("/add/<int:num1>/<int:num2>")
# def add(num1, num2):
#     return addTwo(num1,num2)

@transcript_api_bp.route("/go_to_main")
def go_to_main():
    # The name of the blueprint is defined in __init__.py and that's what is referenced here
    return redirect(url_for("main.index")) # main, and then function name which is index in routes.py

@transcript_api_bp.route('/file', methods=['POST'])
def upload():
    print("Form Data Received")

    if "file" not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    if file.filename == "":
        return redirect(request.url)
    
    # print(file)
    filename, file_extension = os.path.splitext(file.filename)
    temp = tempfile.NamedTemporaryFile(suffix=file_extension)
    print(temp.name)
    file.save(temp)

    audio_file = open(temp.name, "rb")

    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    print (transcript)
    return {"message": transcript}
