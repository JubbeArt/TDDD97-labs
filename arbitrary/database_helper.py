import sqlite3
from flask import g

DATABASE = 'database.db'


def validate_login(email: str, password: str):
    db = get_db()
    db.execute("SELECT * FROM email WHERE email='a@a'")
    print(db)

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