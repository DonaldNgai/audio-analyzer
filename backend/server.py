import os

import numpy as np
from flask import Flask, request
from flask_cors import CORS
from keras.models import load_model
from PIL import Image, ImageOps

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])

# inputSentenceLength = 10
# # Load the model
# model = load_model("/model/mymodel.keras", compile=False)


# def predict_next_word(input_text, n_best):
#         predictionInput = np.zeros(shape=(1,inputSentenceLength, len(uniqueWords)))
#         for i, word in enumerate(input_text.split()):
#             predictionInput[0,i,uniqueWordsIndex[word]] = 1

#         # So how this predicts is you have a bunch of matrices.
#         # Based on how the matrix looks, we want to predict and output

#         predictions = model.predict(predictionInput, verbose=0)[0]
#         return np.argpartition(predictions, n_best)[-n_best:]

# def generate_text(input_text, text_length, creativity=3):
#     word_sequence = tokenizer.tokenize(input_text)
#     current = 0
#     # The underscore just means we don't care about the variable
#     for _ in range(text_length):
#         sub_sequence = " ".join(word_sequence[current:current+inputSentenceLength])
#         try:
#             next_word = uniqueWords[random.choice(predict_next_word(sub_sequence, creativity))]
#         except:
#             next_word = random.choice(uniqueWords)
#         word_sequence.append(next_word)
#         current += 1
#     return " ".join(word_sequence)

def upload():
    return {"message": "successful link"}