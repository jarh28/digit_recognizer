import numpy as np
from model import load_model
import base64
import cv2
import math


def get_model_api():
    model = load_model.load_model()

    def model_api(input_data):
        data = str(input_data)
        img_data = data.split(',')[1]
        img_decoded = base64.b64decode(img_data)

        np_img = np.fromstring(img_decoded, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_GRAYSCALE)

        img = 255-img

        # Top row
        while np.sum(img[0]) == 0:
            img = img[1:]

        # Bottom row
        while np.sum(img[-1]) == 0:
            img = img[:-1]

        # First column
        while np.sum(img[:, 0]) == 0:
            img = np.delete(img, 0, 1)

        # Last column
        while np.sum(img[:, -1]) == 0:
            img = np.delete(img, -1, 1)

        rows, cols = img.shape

        # Resize with a factor
        if rows > cols:
            factor = 20.0 / rows
            rows = 20
            cols = int(round(cols * factor))
            img = cv2.resize(img, (cols, rows))
        else:
            factor = 20.0 / cols
            cols = 20
            rows = int(round(rows * factor))
            img = cv2.resize(img, (cols, rows))

        # Padding to complete the 28x28 dims
        cols_padding = (int(math.ceil((28 - cols) / 2.0)), int(math.floor((28 - cols) / 2.0)))
        rows_padding = (int(math.ceil((28 - rows) / 2.0)), int(math.floor((28 - rows) / 2.0)))
        img = np.lib.pad(img, (rows_padding, cols_padding), 'constant')

        # img_resized = cv2.resize(255-img, (28, 28))
        img_resized = img

        x = img_resized.flatten() / 255.0

        x = x.reshape((1, len(x)))
        prediction = model.predict_classes(x)
        return prediction[0]

    return model_api
