from flask import Flask
from flask import request
from database_helper import teardown_db, validate_login

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/sign_in", methods=['POST'])
def sign_in():
    data = request.json
    validate_login(data['email'], data['password'])

    return f'email is {data["email"]} and password {data["password"]}'


@app.route("/sign_out")

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
