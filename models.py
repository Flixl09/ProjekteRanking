from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Computed

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    employeeid = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String)
    editor = db.Column(db.Boolean)
    votes = db.Column(db.Integer)
    favourite = db.Column(db.Integer)
    authkey = db.Column(db.String(64), unique=True)
    email = db.Column(db.String)

class Project(db.Model):
    __tablename__ = 'projects'

    projectid = db.Column(db.Integer, primary_key=True)
    leader = db.Column(db.BigInteger, db.ForeignKey('users.employeeid'))
    title = db.Column(db.String)
    description = db.Column(db.Text)
    projecturl = db.Column(db.String)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    mehvotes = db.Column(db.Integer, default=0)

    votes = db.Column(
        db.Integer,
        Computed('upvotes + downvotes + mehvotes', persisted=True),
        nullable=False
    )
    score = db.Column(
        db.Numeric(precision=10, scale=2),
        Computed('upvotes - downvotes - (mehvotes * 0.1)', persisted=True),
        nullable=False
    )
    createdat = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    finishat = db.Column(db.DateTime, nullable=True, default="9999-12-31 23:59:59")
    authorized = db.Column(db.Boolean, default=False)
    color = db.Column(db.String(6), default='FFFFFF')
    shortdesc = db.Column(db.String(60))
    favourites = db.Column(db.Integer, default=0)

    leader_user = db.relationship("User")

class Vote(db.Model):
    __tablename__ = 'vote'
    employeeid = db.Column(db.BigInteger, db.ForeignKey('users.employeeid'), primary_key=True)
    projectid = db.Column(db.Integer, db.ForeignKey('projects.projectid'), primary_key=True)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    votetype = db.Column(db.Integer) # 1 for upvote, -1 for downvote, 0 for mehvote

    user = db.relationship("User")
    project = db.relationship("Project")

class Images(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    projectid = db.Column(db.Integer, db.ForeignKey('projects.projectid'))
    imageurl = db.Column(db.String)

    project = db.relationship("Project", backref=db.backref('images', lazy=True))