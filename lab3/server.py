from flask import Flask, jsonify, request, send_from_directory
import database_helper as dh
from helpers import login_required, status, error_status

app = Flask(__name__, static_url_path='/static')

# TODO: Add error checks where needed and don't assume db-helper always succeeds

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route("/sign_in", methods=['POST'])
def sign_in():
    data = request.json
    token = dh.login(data['email'], data['password'])

    if token:
        return status({'token': token}, "Successfully signed in.")
    else:
        return error_status(400, "Wrong username or password.")

@app.route("/sign_out")
@login_required
def sign_out(token): 
    dh.logout(token)
    return ''

    
@app.route("/sign_up", methods=['POST'])
def sign_up():

    data = request.json
    values = ['email', 'password', 'firstname', 'familyname', 'gender', 'city', 'country']

    for v in values:
        if v not in data:
            return error_status(400, f'Missing field {v}.')

    if len(data['password']) <= 7:
        return error_status(400, 'Password too short.')

    if dh.sign_up(data['email'], data['password'], data['firstname'], data['familyname'], data['gender'], data['city'], data['country']):
        return status('')
    else:
        return error_status(400, 'Email already exsits')

@app.route("/change_password", methods=['POST'])
@login_required
def change_password(token):
    data = request.json
    print('HERE', data)
    
    if dh.change_password(token, data['oldPassword'], data['newPassword']):
        return status('')
    return error_status(401, 'Wrong password.')

@app.route("/get_user_data_by_token")
@login_required
def get_user_data_by_token(token):
    return jsonify(dh.get_user_data_by_token(token))

@app.route("/get_user_data_by_email", methods=['POST'])
@login_required
def get_user_data_by_email(_):
    data = dh.get_user_data_by_email(request.json['email'])
    if data:
        return status(data)
    
    return error_status(400, 'User not found')


@app.route("/get_user_messages_by_email", methods=['POST'])
@login_required
def get_user_messages_by_email(_):
    return dh.get_messages_by_email(request.json['email'])

@app.route("/get_user_messages_by_token")
@login_required
def get_user_messages_by_token(token):
    return dh.get_messages_by_token(token)
    

@app.route("/post_message", methods=['POST'])
@login_required
def post_message(token): 
    email = request.json['email']
    message = request.json['message']
    dh.post_message(token, email, message)
    return status('', 'Post posted.', 201)
    
dh.teardown_db(app)
app.run(debug=True)