from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from io import StringIO
import io
import base64
from PIL import Image
import cv2
import numpy as np
from videoStreaming import predictXception
import eventlet
from img_2_directory import upload_img
from get_img_url_and_labeling import get_list_img_json, save_to_csv
import time
import pandas as pd
from engineio.payload import Payload

Payload.max_decode_packets = 10000
app = Flask(__name__, template_folder='templates')
socketio = SocketIO(app, cors_allowed_origins='*')


@app.route('/')
def home():
    print("SERVER STARTED")
    return render_template('index.html')


@app.route('/labeling')
def labeling():
    print("SERVER STARTED")
    hinhs = {
        "items": [
            {
                "img": "https://i.pinimg.com/originals/57/dc/69/57dc695c383af1aaf38798eaccceb4e5.jpg",
                "alt": "image for labeling"
            }
        ]
    }
    string_html = '<div class="item"> <img src="../static/download.png" alt="labeling-fordata" /><h1>1</h1><div class="label"><div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="labeling_1" id="labeling_1" value="happy" /> <label class="form-check-label" for="labeling_1">Happy</label></div><div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="labeling_1" id="labeling_1" value="angry" /> <label class="form-check-label" for="labeling_1">Angry</label></div><div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="labeling_1" id="labeling_1" value="disgust" /> <label class="form-check-label" for="labeling_1" >Disgust</label ></div><div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="labeling_1" id="labeling_1" value="scared" /> <label class="form-check-label" for="labeling_1" >Scared</label ></div><div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="labeling_1" id="labeling_1" value="sad" /> <label class="form-check-label" for="labeling_1">Sad</label></div><div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="labeling_1" id="labeling_1" value="surprised" /> <label class="form-check-label" for="labeling_1" >Surprised</label ></div><div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="labeling_1" id="labeling_1" value="neutral" /> <label class="form-check-label" for="labeling_1" >Neutral</label ></div></div></div>'

    return render_template('labeling.html', data=hinhs, html=string_html)


@socketio.on('load_labeling')
def load_labeling(data):
    # print('client connect status: '+msg)
    print("đã nhận được dữ liệu là: " + data + "từ client nhé")
    dataJSON = {
        "items": get_list_img_json()
    }
    print(dataJSON)
    emit("load_labeling_client", dataJSON)


@app.route('/predict-by-webcamjs')
def predict_by_webcamjs():
    print("SERVER STARTED")
    return render_template('index_usingWebcamJS.html')


@app.route('/index-do-tung-lam')
def predict_by_lam():
    print("SERVER STARTED")
    return render_template('index_lam.html')


# @socketio.on('message')
# def handleMessage(msg):
#     # print('client connect status: '+msg)
#     send(msg, broadcast=True)

# predict


@socketio.on('image')
def image(data_image):
    sbuf = StringIO()
    sbuf.write(data_image)

    # decode and convert into image
    b = io.BytesIO(base64.b64decode(data_image))
    pimg = Image.open(b)

    ## converting RGB to BGR, as opencv standards
    frame = cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)
    frame, is_save = predictXception(frame)
    if frame is None:
        emit('result_predict', None)
        return

    imgencode = cv2.imencode('.jpg', frame)[1]

    # base64 encode
    stringData = base64.b64encode(imgencode).decode('utf-8')
    b64_src = 'data:image/jpg;base64,'
    stringData = b64_src + stringData
    if time.localtime().tm_sec % 10 == 0 and is_save is True:
        # print(is_save)
        upload_img(pimg)
    emit('result_predict', stringData)


# response_back
# result_predict

# svae info image after label


@socketio.on('save_after_label')
def save_after_label(data_label):
    # print('client', data_label)
    # labeled_data = data_label.split('@')
    # print(labeled_data)
    # print("du liu nhan ve",tuple(labeled_data))
    # print(tuple(labeled_data).shape)
    # print(type(labeled_data))
    # df = pd.DataFrame(labeled_data, columns=['img', 'label'])
    # print(df)

    converted_data_label = []
    for item in data_label:
        img = str(item).split('@')[0].replace('img/', '')
        # print('process', img)
        lbl = str(item).split('@')[1]
        converted_data_label.append((img, lbl))

    # print(converted_data_label)
    save_to_csv(converted_data_label)
    # print(get_list_img_json())
    dataJSON = {
        "items": get_list_img_json()
    }
    # hinh = "https://i.pinimg.com/originals/57/dc/69/57dc695c383af1aaf38798eaccceb4e5.jpg"
    emit('testguiok', dataJSON)


@socketio.on("result_predict_for_take")
def result_predict_for_take(data_image):
    sbuf = StringIO()
    sbuf.write(data_image)

    # decode and convert into image
    b = io.BytesIO(base64.b64decode(data_image))
    pimg = Image.open(b)

    # converting RGB to BGR, as opencv standards
    frame = cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)
    frame = predictXception(frame)
    if frame is None:
        emit("result_predict", None)
        return

    imgencode = cv2.imencode(".jpg", frame)[1]

    # base64 encode
    stringData = base64.b64encode(imgencode).decode("utf-8")
    b64_src = "data:image/jpg;base64,"
    stringData = b64_src + stringData

    a = stringData
    emit("result_predict_for_take", a)


if __name__ == '__main__':
    print("app is  running")
    # socketio.run(app, host='0.0.0.0', port=3000)
    # socketio.run(app, host="0.0.0.0", debug=True,  keyfile="key.pem", certfile="cert.pem")

    # create certificate
    # openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

    eventlet.wsgi.server(
        eventlet.wrap_ssl(eventlet.listen(("0.0.0.0", 3000)),
                          certfile='key_and_lock/cert.pem',
                          keyfile='key_and_lock/key.pem',
                          server_side=True), app)
