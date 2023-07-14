import datetime

from flask import Blueprint, request, jsonify, render_template, redirect

from models.session import Session
from models.user import User

archives_blueprint = Blueprint('archives', __name__)


@archives_blueprint.route('/')
@archives_blueprint.route('/signin')
def signin():
    session = Session.query.filter_by(session=request.cookies.get("3403")).first()
    if session is not None and session.expire is not None and datetime.datetime.utcnow() < session.expire:
        user = User.query.filter_by(id=session.uid).first()
        return redirect("/chat?username=" + user.username + "&redirect=true")
    # Else, show the signin page
    return render_template('signin.html')



@archives_blueprint.route('/signup')
def signup():
    return render_template('signup.html')



@archives_blueprint.route('/chat')
def chat():
    return render_template('chat.html', title="My Chat")


@archives_blueprint.route('/history')
def history():
    return render_template('history.html', title="Chat History 📃")


@archives_blueprint.route('/profile')
def profile():
    return render_template('profile.html')


@archives_blueprint.route('/chatgpt')
def chatgpt():
    return render_template('chat.html', title="Chat GPT")


@archives_blueprint.route('/wordle')
def wordle():
    return render_template('chat.html', title="Wordle")


@archives_blueprint.route('/twentyquestion')
def twenty_question():
    return render_template('chat.html', title="20 Questions")


@archives_blueprint.route('/situationpuzzle')
def situation_puzzle():
    return render_template('chat.html', title="Situation Puzzle")
