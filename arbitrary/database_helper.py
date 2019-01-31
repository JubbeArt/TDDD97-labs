import sqlite3
from flask import g
from random import random

DATABASE = '/home/jeswr740/TDDD91/Lab1/arbitrary/database.db'

def query_db(query: str, args=(), one: bool =False):
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
    db_password = query_db('SELECT password FROM users WHERE email = ?', [email], True)
    
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