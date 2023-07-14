import datetime
import json
import random
import string

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from models.session import Session
from models.user import User
from models import db

auth_blueprint = Blueprint('auth', __name__)


# cookie


# login
@auth_blueprint.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')
    passwordAgain = data.get('passwordAgain', '')

    if password != passwordAgain:
        return jsonify({'code': 400, 'name': "signup", 'text': "password not match"})

    # Check if the username is of valid length
    if len(username) < 4 or len(username) > 12:
        return jsonify({'code': 400, 'name': "signup", 'text': "Username must be between 4 and 12 characters"})

    if len(password) < 8 or len(password) > 20:
        return jsonify({'code': 400, 'name': "signup", 'text': "Password must be between 8 and 20 characters"})

    # Check if the username already exists in the database
    user = User.query.filter_by(username=username).first()
    if user:
        # If the user exists, return an error
        return jsonify({'code': 400, 'name': "signup", 'text': "Username already exists"})

    # Create a new user with the form data. Hash the password so the plaintext version isn't saved.
    new_user = User(username=username, password=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()

    new_session = Session(uid=new_user.id)
    db.session.add(new_session)
    db.session.commit()

    return jsonify({'code': 200, 'name': "signin", 'text': "success"})


# signin
@auth_blueprint.route('/auth/signin', methods=['POST'])
def signin():
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')
    remember = data.get('remember', '')

    # Check if the username is of valid length
    if len(username) < 4 or len(username) > 12:
        return jsonify({'code': 400, 'name': "signin", 'text': "Username must be between 4 and 12 characters"})

    if len(password) < 8 or len(password) > 20:
        return jsonify({'code': 400, 'name': "signin", 'text': "Password must be between 8 and 20 characters"})

    user = User.query.filter_by(username=username).first()
    if not user:
        # If the user doesn't exist, return an error
        return jsonify({'code': 400, 'name': "signin", 'text': "Invalid username or password"})

    # if password is not correct, return an error
    if not check_password_hash(user.password, password):
        return jsonify({'code': 400, 'name': "signin", 'text': "Invalid username or password"})

    # generate random session key
    session_key = random_session()
    expire_date = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    session = Session.query.filter_by(uid=user.id).first()
    session.session = session_key
    session.expire = expire_date
    db.session.commit()
    # set expire date. if remembered, expire date is 7 days later
    # if not, it became a session cookie
    if not remember:
        expire_date = ""
    return jsonify({'code': 200, 'name': "signup", 'text': {"cookie": session_key, "expire": expire_date}})


# generate random session key
# use 14 digits current time and 6 random letters
def random_session():
    random_str = ''.join(random.choices(string.ascii_letters, k=6))
    current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return f'{random_str}{current_time}'
