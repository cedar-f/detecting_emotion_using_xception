# detecting_emotion_using_xception
## description
this project is my finnal term examination, it use for detecting emotion by xception with 7 state of emotion
using python3.6, aws S3 (storage), aws EC2 (virtual machine)

## environtment 
recommend python 3.6
this project use aws S3 for storing collected image when running app for retrain models (comming soon) and storing labeled data
## config environement
1. install libary from requirements.txt (common way: 'pip install -r requirement.txt')
2. install awscli ('pip install awscli')
3. config awscli for aws s3 storage:

    run "aws configure" in cmd and input your aws IAM access ID and access key.
4. install openssl for OS and generate certificate ssl:

    for ubuntu: it has already been installed
  
    for window: follow this link "https://slproweb.com/products/Win32OpenSSL.html" or it can be installed from another source
5. run this command with openssl: "openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem" or "req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem" to generate certificate and key,
after that we got "cert.pem" and "key.pem" file, coppy it to "detecting_emotion_using_xception/key_and_lock"
## usage
run this command in "detecting_emotion_using_xception/": "python3.6 app.py"

app will run on port 3000 in localhost
