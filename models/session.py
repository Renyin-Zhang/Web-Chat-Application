from models import db


# session table
class Session(db.Model):
    # __tablename__ = 'session'
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, nullable=False)
    session = db.Column(db.String(40), nullable=True)
    expire = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Session {self.id}, {self.uid}, {self.session}>'
