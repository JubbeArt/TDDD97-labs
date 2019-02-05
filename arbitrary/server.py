from flask import Flask, jsonify
from flask import request
import database_helper as dh

app = Flask(__name__)

@app.route("/sign_in", methods=['POST'])
def sign_in():
    data = request.json
    token = dh.login(data['email'], data['password'])

    if token:
        response = {
            'success': True,
            'token': token
        }
    else:
        response = {
            'success': False
        }
    
    return jsonify(response)


@app.route("/sign_out")
def sign_out(): 
    token = request.headers['Authorization']
    dh.logout(token)
    return ''



@app.route("/sign_up", methods=['POST'])
def sign_up():
    data = request.json
    values = ['email', 'password', 'firstname', 'familyname', 'gender', 'city', 'country']

    for v in values:
        if v not in data:
            return 'You are retarded and shjould get help'

    if len(data['password']) <= 7:
        return 'You are retarded and shjould get help'

    dh.sign_up(data['email'], data['password'], data['firstname'], data['familyname'], data['gender'], data['city'], data['country'])

    return '-'


@app.route("/change_password", methods=['POST'])
def change_password():
    token = request.headers['Authorization']
    data = request.json
    
    dh.change_password(token, data['oldPassword'], data['newPassword'])
    return ''

@app.route("/get_user_data_by_token")
def get_user_data_by_token():
    token = request.headers['Authorization']
    user_data = dh.get_user_data_by_token(token)
    return user_data

@app.route("/get_user_data_by_email", methods=['POST'])
def get_user_data_by_email():
    token = request.headers['Authorization']
    if(dh.is_valid_token(token)):
        user_data = dh.get_user_data_by_email(request.json['email'])
        return user_data
    return '-'

@app.route("/get_user_messages_by_email", methods=['POST'])
def get_user_messages_by_email():
    token = request.headers['Authorization']
    
    if dh.is_valid_token(token):
        return dh.get_messages_by_email(request.json['email'])
    return '-'

@app.route("/get_user_messages_by_token")
def get_user_messages_by_token():
    token = request.headers['Authorization']
    return dh.get_messages_by_token(token)
    

@app.route("/post_message", methods=['POST'])
def post_message():
    token = request.headers['Authorization']   
    email = request.json['email']
    message = request.json['message']
    dh.post_message(token, email, message)
    return ""

dh.teardown_db(app)
app.run(debug=True)
