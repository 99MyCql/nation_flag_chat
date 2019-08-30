from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Barrage(db.Model):
    __tablename__ = "barrage"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    avatar_url = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    like_count = db.Column(db.Integer)