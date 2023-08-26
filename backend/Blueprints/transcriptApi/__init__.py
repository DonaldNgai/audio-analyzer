from flask import Blueprint, redirect, url_for, request
import os
import tempfile
from flask_cors import CORS
import base64


import openai
openai.api_key = os.getenv("OPENAI_API_KEY")

transcript_api_bp = Blueprint("transcript_api", __name__)
CORS(transcript_api_bp)

counter = 0

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
def transcribe_from_file():
    print("Form Data Received")

    if "file" not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    if file.filename == "":
        return redirect(request.url)
    
    print(file)
    filename, file_extension = os.path.splitext(file.filename)
    
    temp = tempfile.NamedTemporaryFile(suffix=file_extension)
    print(temp.name)
    file.save(temp)
    file.stream.seek(0)
    file.save(file.filename)

    audio_file = open(temp.name, "rb")
    # transcript = openai.Audio.transcribe("whisper-1", audio_file)
    transcript = "hello"
    # time.sleep(3000)
    print (transcript)
    return {"message": transcript}

@transcript_api_bp.route('/liveblob', methods=['POST'])
def transcribe_from_blob():
    global counter
    print ("Live Blob transcribing " + str(counter))

    if "file" not in request.files:
        return redirect(request.url)

    
    data = request.files['file']
    filepath = "tmp/" + data.filename
    print(filepath)
    saveTempAudioFile(filepath, data)
    os.remove(filepath)

    counter+=1
    
    return {"message": "Hello WOrlds"}

@transcript_api_bp.route('/livebase64', methods=['POST'])
def transcribe_from_base64():
    global counter
    print ("Live Base 64 transcribing" + str(counter))

    # print (request.get_json())
    # if "file" not in request.files:
    #     return redirect(request.url)
    
    # file = request.files['file']
    # if file.filename == "":
    #     return redirect(request.url)

    # print (file)
    # video_stream = base64.b64decode(file.read())
    # print(file)
    json_data = request.get_json()
    if "file" not in json_data:
        return redirect(request.url)

    data = json_data['file']
    # print(data)
    # wav_file = open("temp.wav", "wb")
    decode_string = base64.b64decode(data.split(',')[1])
    filename = "".join(["./file",str(counter),".mpeg"])
    print(filename)
    # print(decode_string)
    with open(filename, 'wb') as f:
        f.write(decode_string)
        f.close()
    # print(decode_string)
    # wav_file.write(decode_string)    
    # result=torch.Tensor(numpy.frombuffer(json_data["file"], dtype=numpy.int32))
    # if file.filename == "":
    #     return redirect(request.url)
    print ("helloworld")
    counter+=1
    
    return {"message": "Hello WOrlds"}


def saveTempAudioFile(filepath, fileToSave):
    fileDirectory = os.path.dirname(filepath)
    isExist = os.path.exists(fileDirectory)
    if not isExist:
        # Create a new directory because it does not exist
        os.makedirs(fileDirectory)
        print("Creating tmp folder")

    fileToSave.save(filepath)