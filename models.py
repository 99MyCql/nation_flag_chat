from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Barrage(db.Model):
    __tablename__ = "barrage"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    avatar_url = db.Column(db.Text, nullable=False)
    sex = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    like_count = db.Column(db.Integer)

class UserRecord(db.Model):
    __tablename__ = "user_record"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    record = db.Column(db.Text, nullable=False) # 记录用户上次看到第几个对话
