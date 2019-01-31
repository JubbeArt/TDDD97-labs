from flask import Flask, jsonify
from flask import request
from database_helper import teardown_db, login, logout

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/sign_in", methods=['POST'])
def sign_in():
    data = request.json
    token = login(data['email'], data['password'])

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
    logout(token)
    return ''



@app.route("/sign_up")

@app.route("/change_password")

@app.route("/get_user_data_by_token")

@app.route("/get_user_data_by_email")

@app.route("/get_user_messages_by_email")

@app.route("/get_user_messages_by_token")

@app.route("/post_message")
def xd():
    return "waow"

teardown_db(app)
app.run(debug=True)
