from functools import wraps
from flask import jsonify, request

def json(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):
        data_object = function(*args, **kwargs)
        return jsonify(data_object)
    return decorated_function

def login_required(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):
        error = {
            "success": False, "message": "You are not signed in."
        }

        if 'Authorization' not in request.headers:
            return error

        token = request.headers['Authorization']

        
        
        return function(*args, **kwargs)
    return decorated_function