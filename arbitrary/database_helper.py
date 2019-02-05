import sqlite3
from flask import g, jsonify
from random import random


DATABASE = '/home/jeswr740/TDDD91/Lab1/arbitrary/database.db'

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
    
    #  
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
    email = query_db('SELECT email FROM tokens WHERE token=?', [token])[0]
    old = query_db('SELECT password FROM users WHERE email=?', [email])[0]
    if(old == old_password):
        execute_db('UPDATE users SET password = ? WHERE email = ?', [new_password, email])
  
def get_user_data_by_email(email: str):
    data = query_db('SELECT email, firstname, familyname, gender, city, country FROM users WHERE email=?', [email])
    json_response =  {
        'email': data[0],
        'firstname':data[1],
        'familyname':data[2], 
        'gender': 'Male' if data[3] else 'Female', 
        'city':data[4], 
        'country': data[5]
    }
    return jsonify(json_response)

def get_user_data_by_token(token: str):
    email = query_db('SELECT email FROM tokens WHERE token=?', [token])[0]
    if not email:
        return '-'
    return get_user_data_by_email(email)

def is_valid_token(token: str):
    if query_db('SELECT token FROM tokens WHERE token=?', [token]):
        return True
    return False

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


