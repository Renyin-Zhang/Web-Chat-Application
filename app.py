import datetime

from flask import Flask, redirect, request, url_for
from auth.auth import auth_blueprint
from chatbot.chatGpt import chatgpt_blueprint
from models.session import Session
from models.user import User
from webPage.archives import archives_blueprint
from flask_cors import CORS
from models.database import init_database
from history.history import history_blueprint

app = Flask(__name__)
app.config.from_pyfile('config.py')

# database init
init_database(app)

# enable CORS
# support cookie
CORS(app, resources={r'/*': {'origins': '*'}}, supports_credentials=True)

# register blueprints
app.register_blueprint(auth_blueprint)
app.register_blueprint(chatgpt_blueprint)
app.register_blueprint(archives_blueprint)
app.register_blueprint(history_blueprint)


# global interceptor
@app.before_request
def check_cookie():
    # Specify the routes to intercept
    intercepted_paths = ['/profile', '/about', '/chat', '/history', '/chatgpt', '/wordle', '/twentyquestion',
                         '/situationpuzzle']

    # If it's a redirect, allow it to pass
    if request.args.get('redirect') is not None:
        return

    # If it's not an intercepted path, return directly
    if request.path not in intercepted_paths:
        return

    # If there's no cookie, redirect to signin
    if '3403' not in request.cookies:
        return redirect("/signin")

    # Check if session exists and is not expired
    session = Session.query.filter_by(session=request.cookies.get("3403")).first()
    if session is None or (session.expire is not None and datetime.datetime.utcnow() > session.expire):
        return redirect("/signin")


if __name__ == "__main__":
    app.run(debug=True, port=3403)
