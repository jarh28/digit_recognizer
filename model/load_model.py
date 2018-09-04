from tensorflow import keras
import os

_dir = os.path.join(os.path.dirname(__file__), 'trained_model.h5')

def load_model():
    model = keras.models.load_model(_dir)
    model._make_predict_function()
    return model