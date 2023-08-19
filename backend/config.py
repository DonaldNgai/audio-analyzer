import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    OPEN_API_KEY = os.getenv("OPENAI_API_KEY")

