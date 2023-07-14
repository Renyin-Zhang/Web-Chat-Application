import datetime

from models import db


# history table
class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), nullable=False)
    type = db.Column(db.Integer, nullable=False)
    role = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(4000), nullable=False)
    time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow())

    def to_dict(self):
        return {
            'username': self.username,
            'type': 'ask' if self.role == 1 else 'answer',
            'content': self.content,
        }
