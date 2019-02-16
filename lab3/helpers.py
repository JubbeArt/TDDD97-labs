from functools import wraps
import database_helper as dh
from typing import Tuple
from flask import jsonify, request

def login_required(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):

        if 'Authorization' not in request.headers:
            return error_status(401, 'Missing authorization header.')

        token = request.headers['Authorization']

        if not dh.is_valid_token(token):
            return error_status(401, 'You are not logged in.')
        
        return function(token, *args, **kwargs)
    return decorated_function


def error_status(code: int, message: str) -> Tuple[str, str]:
    return '', f'{code} {message}'

def status(data, message: str = '', code: int = 200) -> Tuple[str, str]:
    data = jsonify(data) if data else ''
    return data, f'{code} {message}'