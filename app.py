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
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')


@app.route('/')
def index():
    return render_template('index.html')


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
        emit('response_back', None)
        return

    imgencode = cv2.imencode('.jpg', frame)[1]

    # base64 encode
    stringData = base64.b64encode(imgencode).decode('utf-8')
    b64_src = 'data:image/jpg;base64,'
    stringData = b64_src + stringData
    if time.localtime().tm_sec % 10 ==0 and is_save is True:
        print(is_save)
        upload_img(pimg)
    emit('response_back', stringData)


if __name__ == '__main__':
    print("app is  running")
    # socketio.run(app, host='0.0.0.0', port=3000)
    # socketio.run(app, host="0.0.0.0", debug=True,  keyfile="key.pem", certfile="cert.pem")

    # create certificate
    # openssl req - newkey rsa: 2048 - new - nodes - x509 - days 3650 - keyout key.pem - out cert.pem

    eventlet.wsgi.server(
        eventlet.wrap_ssl(eventlet.listen(("0.0.0.0", 3000)),
                          certfile='key_and_lock/cert.pem',
                          keyfile='key_and_lock/key.pem',
                          server_side=True), app)
