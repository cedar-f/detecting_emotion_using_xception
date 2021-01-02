import base64
import io
import logging
import boto3
from botocore.exceptions import ClientError
import datetime
import random
import string

base_directory = 'img/'


def upload_img(img_data, bucket='emtion-img-data', object_name=None):
    if object_name is None:
        object_name = base_directory + str(datetime.datetime.now()) + get_random_string(4) + '.jpg'
        object_name = object_name.replace(' ', '')
    s3_client = boto3.client('s3')
    try:
        buffer = io.BytesIO()
        img_data.save(buffer, "JPEG")
        buffer.seek(0)
        s3_client.upload_fileobj(buffer, bucket, object_name, ExtraArgs={'ACL': 'public-read'})
    except ClientError as e:
        logging.error(e)
        return False
    return True


def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str
