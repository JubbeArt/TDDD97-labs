from flask import Flask, jsonify, request, send_from_directory
import database_helper as dh
from helpers import login_required, validate_email_format, required_fields, status, error_status
from flask_sockets import Sockets
from geventwebsocket.handler import WebSocketHandler
import json

app = Flask(__name__, static_url_path='/static')
sockets = Sockets(app)

from flask_cors import CORS
CORS(app)

opensockets = {}


# {
#     "a@a": [websock],
#     "a@a": []
# }





@sockets.route('/log_in')
def echo_socket(ws):
    token = ws.receive()
    email = dh.get_email_by_token(token)
    
    if email in opensockets:
        opensockets[email].append(ws)
    else:
        opensockets[email] = [ws]

    data = {
        "concurrent_users": dh.get_users_online(),
        "number_of_posts": dh.get_number_of_posts(email),
        "viewers": dh.get_viewers(email)
    }

    ws.send(json.dumps({"type": "stats", "data": data}))

    while not ws.closed:
        ws.receive()

def notify_all_sockets():
    concurrent_users = dh.get_users_online()  
    print('NOTIFYING USERS!!!!!!!!!')

    for email in opensockets:
        viewers = dh.get_viewers(email)
        number_of_posts = dh.get_number_of_posts(email)

        for socket in opensockets[email]:
            print(email, socket,'is open:', not socket.closed)
            if socket.closed:
                continue

            socket.send(json.dumps({
                "concurrent_users": concurrent_users,
                "number_of_posts": number_of_posts,
                "viewers": viewers
            }))


@app.route('/')
def index():
    notify_all_sockets()
    return app.send_static_file('index.html')

@app.route("/sign_in", methods=['POST'])
@required_fields(['email', 'password'])
def sign_in():
    data = request.json
    email = data['email']
    token = dh.login(email, data['password'])

    if token:
        if email in opensockets:
            for  socket in opensockets[email]:
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
    return ''

    
@app.route("/sign_up", methods=['POST'])
@validate_email_format
@required_fields(['email', 'password', 'firstname', 'familyname', 'gender', 'city', 'country'])
def sign_up():
    data = request.json

    if len(data['password']) <= 7:
        return error_status(400, 'Password too short.')

    if dh.sign_up(data['email'], data['password'], data['firstname'], data['familyname'], data['gender'], data['city'], data['country']):
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
    data = dh.get_user_data_by_email(request.args['email'])
    if data:
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
    return status('', 'Post posted.', 201)
    

from gevent.pywsgi import WSGIServer

dh.teardown_db(app)
http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
http_server.serve_forever()

