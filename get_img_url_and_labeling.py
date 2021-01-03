import boto3
import re
import json
import numpy as np
import pandas as pd

s3_client = boto3.resource('s3')
bucket = s3_client.Bucket('emtion-img-data')


def get_list_img_json():
    list_img = np.array([])
    for my_bucket_object in bucket.objects.all():
        if re.match('^img/.+', my_bucket_object.key):
            # print(my_bucket_object.key)
            list_img = np.append(list_img, {
                'img': 'https://emtion-img-data.s3-ap-southeast-1.amazonaws.com/' + my_bucket_object.key,
                'alt': 'image for labeling'})

    list_img_json = json.dumps(list_img.tolist())
    return list_img_json


# cars = {'img': ['Honda Civic', 'Toyota Corolla11', 'Ford Focus', 'Audi A4'],
#         'label': [22000, 25000, 27000, 35000]
#         }


def save_to_csv(labeled_data):
    try:
        df1 = pd.read_csv('s3://emtion-img-data/label/labeled_img.csv')
        print(df1)
        df2 = pd.DataFrame(labeled_data, columns=['img', 'label'])
        df1 = df1.append(df2, ignore_index=True)
        df1 = df1.drop_duplicates(subset=df1.columns[0], keep='first')
        df1.to_csv('s3://emtion-img-data/label/labeled_img.csv', index=False, header=True)
        print('df1')
        print(df1)
    except:
        df2 = pd.DataFrame(labeled_data, columns=['img', 'label'])
        df2 = df2.drop_duplicates(subset=df2.columns[0], keep='first')
        print('df2')
        print(df2)
        df2.to_csv('s3://emtion-img-data/label/labeled_img.csv', index=False, header=True)
print(get_list_img_json)