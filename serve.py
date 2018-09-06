import numpy as np
from model import load_model
import base64
import cv2


def get_model_api():
    model = load_model.load_model()

    def model_api(input_data):
        data = str(input_data)
        img_data = data.split(',')[1]
        img_decoded = base64.b64decode(img_data)

        np_img = np.fromstring(img_decoded, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_GRAYSCALE)

        img_resized = cv2.resize(255-img, (28, 28))

        x = img_resized.flatten() / 255.0
        x = x.reshape((1, len(x)))

        prediction = model.predict_classes(x)
        return prediction[0]

    return model_api
