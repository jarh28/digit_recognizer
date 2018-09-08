from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from serve import get_model_api

app = Flask(__name__)
CORS(app)
model_api = get_model_api()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.errorhandler(404)
def url_error(e):
    return """
    Wrong URL!
    <pre>{}</pre>""".format(e), 404


@app.errorhandler(500)
def server_error(e):
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500


@app.route('/api', methods=['POST'])
def api():
    input_data = request.json
    output_data = model_api(input_data)
    response = jsonify(str(output_data))
    return response


if __name__ == '__main__':
    app.run(debug=True)