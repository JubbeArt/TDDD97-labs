from functools import wraps
import database_helper as dh
from typing import Tuple
from flask import jsonify, request
import re

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



def required_fields(fields):
    def actual_decorator(function):
        @wraps(function)
        def decorated_function(*args, **kwargs):
            params = {}

            if request.args:
                params.update(request.args)

            if request.json:
                params.update(request.json)

            for field in fields:                
                if field not in params:
                    return error_status(400, f'Missing argument: {field}')        
            return function(*args, **kwargs)
        return decorated_function
    return actual_decorator


def validate_email_format(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):
        params = {}
        if request.args:
            params.update(request.args)
        if request.json:
            params.update(request.json)
        email = params['email']

        if not re.match(r'[0-9A-Za-z\.\_\-]+@[0-9A-Za-z\.\_\-]+' , email):
            return error_status(400, 'Invalid email format')
        
        return function(*args, **kwargs)
    return decorated_function



def error_status(code: int, message: str) -> Tuple[str, str]:
    return '', f'{code} {message}'

def status(data, message: str = '', code: int = 200) -> Tuple[str, str]:
    data = jsonify(data) if data else ''
    return data, f'{code} {message}'