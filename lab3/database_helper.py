import sqlite3
from flask import g, jsonify
from random import random
import os

current_folder = os.path.dirname(os.path.abspath(__file__))
DATABASE = current_folder + '/database.db'

def query_db(query: str, args=(), one: bool =True):
    cursor = get_db().execute(query, args)
    results = cursor.fetchall()
    cursor.close()

    if results and one:
        return results[0]
    elif results:
        return results
    else:
        return None

def execute_db(query: str, args=()):
    cursor = get_db().execute(query, args)
    get_db().commit()
    cursor.close()

def login(email: str, password: str):
    #tokens = query_db('SELECT token FROM tokens WHERE email = ?', [email])
    db_password = query_db('SELECT password FROM users WHERE email = ?', [email])
    
    if db_password[0] == password:
        token = generate_token()
        execute_db('INSERT INTO tokens VALUES (?, ?)', [token , email]) 
        return token
    else:
        return None

def generate_token() -> str:
    return str(random())

def logout(token: str):
    execute_db('DELETE FROM tokens WHERE token = ?', [token])


def change_password(token: str, old_password: str, new_password: str):
    email = get_email_by_token(token)
    old = query_db('SELECT password FROM users WHERE email=?', [email])[0]
    if(old == old_password):
        execute_db('UPDATE users SET password = ? WHERE email = ?', [new_password, email])
        return True
    return False
  
# TODO: Fix the validation
def get_user_data_by_email(email: str):
    data = query_db('SELECT email, firstname, familyname, gender, city, country FROM users WHERE email=?', [email])
    if data:
        json_response =  {
            'email': data[0],
            'firstname':data[1],
            'familyname':data[2], 
            'gender': 'Male' if data[3] else 'Female', 
            'city':data[4], 
            'country': data[5]
        }
    else:
        json_response =  {
            'email': 'User does not exist',
            'firstname': 'User does not exist',
            'familyname':'User does not exist', 
            'gender': 'User does not exist', 
            'city':'User does not exist', 
            'country': 'User does not exist'
        }
    return jsonify(json_response)

def get_email_by_token(token: str):
    return query_db('SELECT email FROM tokens WHERE token=?', [token])[0]


def get_user_data_by_token(token: str):
    email = get_email_by_token(token)
    if not email:
        return '-'
    return get_user_data_by_email(email)

def sign_up(email: str, password: str, firstname: str, familyname: str, gender: str, city: str, country: str):
    gender = 1 if gender == "Male" or gender == "male" or gender == "1" else 0
    execute_db('INSERT INTO users VALUES (?,?,?,?,?,?,?)', [email, firstname, familyname, password, city, country, gender]) 


def is_valid_token(token: str):
    if query_db('SELECT token FROM tokens WHERE token=?', [token]):
        return True
    return False


def get_messages_by_email(email: str):
    data = query_db('SELECT message, author FROM messages WHERE email=?', [email], False)
    
    if not data:
        return jsonify([])

    messages = []

    for d in data:
        messages.append({
            'message': d[0],
            'author': d[1]            
        })

    return jsonify(messages)

def get_messages_by_token(token: str):
    email = get_email_by_token(token)

    if email:
        return get_messages_by_email(email)
    return ''

def post_message(token, email, message):
    author = get_email_by_token(token)
    if token and email and message:
        execute_db('INSERT INTO messages (message, email, author) VALUES (?, ?, ?)', [message, email, author])
        return 201
    return 400

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def teardown_db(app):
    @app.teardown_appcontext
    def close_connection(exception):
        db = getattr(g, '_database', None)
        if db is not None:
            db.close()
