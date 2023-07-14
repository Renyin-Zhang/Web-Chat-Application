from models import db


def init_database(app):
    db.init_app(app)
