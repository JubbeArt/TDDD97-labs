from flask import Flask, jsonify, request, send_from_directory
import flask_bcrypt 
import database_helper as dh
from typing import Dict, List
from helpers import login_required, validate_email_format, required_fields, status, error_status
from flask_sockets import Sockets
from geventwebsocket.handler import WebSocketHandler
import json


# We aim for the grade 5:
# - 1. Providing Live Data Presentation [3 points] (ChartJS and sockets)
# - 3. Performing Client-side Routing + Overriding Back/Forward buttons using the History API [2 point] (React-Router)
# - 5. Applying Further Security Measures [3 points] (bcrypt and openssl)  
# - 7. Client-side Templating Using a Third-Party API [1 point] (React)


app = Flask(__name__, static_url_path='/static', static_folder='../static')
sockets = Sockets(app)
bcrypt = flask_bcrypt.Bcrypt(app)

opensockets: Dict[str, List] = {}

# {
#     "a@a": [websocket1, websocket2],
#     "b@a": [],
#     "c@a": [websocket]
# }

@sockets.route('/log_in')
def login_socket(ws):
    token = ws.receive()
    email = dh.get_email_by_token(token)

    # user not logged in => bail out
    if not email:
        print('USER TRIED TO CONNECT WITH SOCKET, BUT TOKEN WAS INVALID')
        return
    
    # save socket for later use
    if email in opensockets:
        opensockets[email].append(ws)
    else:
        opensockets[email] = [ws]

    notify_all_sockets()

    while not ws.closed:
        ws.receive()

def notify_all_sockets():
    print('NOTIFYING USERS!!!!!!!!!')
    concurrent_users = dh.get_users_online()  
 
    for email in opensockets:
        viewers = dh.get_viewers(email)
        number_of_posts = dh.get_number_of_posts(email)

        for socket in opensockets[email]:
            #print(email, socket,'is open:', not socket.closed)
            if not socket.closed:                
                socket.send(json.dumps({
                    "type": "stats",
                    "data": {
                        "concurrent_users": concurrent_users,
                        "number_of_posts": number_of_posts,
                        "viewers": viewers
                    }
                }))

@app.route('/')
@app.route('/home')
@app.route('/browse')
@app.route('/account')
@app.route('/stats')
@app.route('/media')
def index():
    return app.send_static_file('index.html')


@app.route('/validate_token')
@login_required
def validate_token(_):
    return status(None)


@app.route("/sign_in", methods=['POST'])
@required_fields(['email', 'password'])
def sign_in():
    data = request.json
    email = data['email']
    token = dh.login(email, data['password'], bcrypt)

    if token:
        if email in opensockets:
            for socket in opensockets[email]:
                if not socket.closed:
                    socket.send(json.dumps({'type': 'logout'}))
            opensockets[email] = []
        return status({'token': token}, "Successfully signed in.")
    else:
        return error_status(400, "Wrong username or password.")


@app.route("/sign_out")
@login_required
def sign_out(token): 
    dh.logout(token)
    notify_all_sockets()
    return ''

    
@app.route("/sign_up", methods=['POST'])
@validate_email_format
@required_fields(['email', 'password', 'firstname', 'familyname', 'gender', 'city', 'country'])
def sign_up():
    data = request.json

    if len(data['password']) <= 7:
        return error_status(400, 'Password too short.')

    if dh.sign_up(data['email'], data['password'], data['firstname'], data['familyname'], data['gender'], data['city'], data['country'], bcrypt):
        return status('')
    else:
        return error_status(400, 'Email already exsits')

@app.route("/change_password", methods=['POST'])
@login_required
@required_fields(['oldPassword', 'newPassword'])
def change_password(token):
    data = request.json

    if len(data['newPassword']) <= 7:
        return error_status(400, 'Password too short.')    
    if dh.change_password(token, data['oldPassword'], data['newPassword']):
        return status('')
    return error_status(401, 'Wrong password.')

@app.route("/get_user_data_by_token")
@login_required
def get_user_data_by_token(token):
    return jsonify(dh.get_user_data_by_token(token))

@app.route("/get_user_data_by_email")
@login_required
@required_fields(['email'])
@validate_email_format
def get_user_data_by_email(_):
    email = request.args['email']
    data = dh.get_user_data_by_email(email)
    if data:
        dh.add_viewer(email)
        notify_all_sockets()
        return status(data)
    
    return error_status(400, 'User not found')


@app.route("/get_user_messages_by_email")
@login_required
@required_fields(['email'])
@validate_email_format
def get_user_messages_by_email(_):
    response = dh.get_messages_by_email(request.args['email'])

    if response:
        return response
    return error_status(400, 'User not found')

@app.route("/get_user_messages_by_token")
@login_required
def get_user_messages_by_token(token):
    return dh.get_messages_by_token(token)
    

@app.route("/post_message", methods=['POST'])
@login_required
@required_fields(['email', 'message'])
def post_message(token): 
    email = request.json['email']
    message = request.json['message']
    dh.post_message(token, email, message)
    notify_all_sockets()
    return status('', 'Post posted.', 201)
    

from gevent.pywsgi import WSGIServer

dh.teardown_db(app)
http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler, keyfile='key.pem', certfile='certificate.pem')
http_server.serve_forever()
