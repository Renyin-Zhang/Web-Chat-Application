import datetime

from models import db


# gpt_session table
class gpt_session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, nullable=False)
    session_id = db.Column(db.String(120), nullable=False)
    session_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow())
    content = db.Column(db.String(4000), nullable=False)

    def __repr__(self):
        return f'<gpt_session {self.id}, {self.session_id}, {self.session_time}, {self.content}, {self.uid}>'
