import numpy as np
from model import load_model
import pandas as pd
import os

def get_model_api():
    model = load_model.load_model()

    def model_api(input_data):
        x = np.array(input_data, dtype=float)

        data = pd.Series(x, name='N')
        _dir = os.path.join(os.path.dirname(__file__), 'number.csv')
        data.to_csv(_dir, index=False)

        x /= 255.0
        x = x.reshape((1,len(x)))
        prediction = model.predict_classes(x)
        return prediction[0]

    return model_api