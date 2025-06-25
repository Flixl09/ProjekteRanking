from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    employeeid = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String)
    editor = db.Column(db.Boolean)
    votes = db.Column(db.Integer)
    favourite = db.Column(db.Integer)

class Project(db.Model):
    __tablename__ = 'projects'
    projectid = db.Column(db.Integer, primary_key=True)
    leader = db.Column(db.BigInteger, db.ForeignKey('users.employeeid'))
    imageurl = db.Column(db.String)
    title = db.Column(db.String)
    description = db.Column(db.Text)
    projecturl = db.Column(db.String)
    upvotes = db.Column(db.Integer)
    downvotes = db.Column(db.Integer)
    mehvotes = db.Column(db.Integer)
    votes = db.Column(db.Integer)
    score = db.Column(db.Numeric(precision=10, scale=2))
    createdat = db.Column(db.DateTime)
    authorized = db.Column(db.Boolean)
    color = db.Column(db.String(6))
    shortdesc = db.Column(db.String(60))
    favourites = db.Column(db.Integer)

    leader_user = db.relationship("User")

class Vote(db.Model):
    __tablename__ = 'vote'
    employeeid = db.Column(db.BigInteger, db.ForeignKey('users.employeeid'), primary_key=True)
    projectid = db.Column(db.Integer, db.ForeignKey('projects.projectid'), primary_key=True)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    votetype = db.Column(db.Integer) # 1 for upvote, -1 for downvote, 0 for mehvote

    user = db.relationship("User")
    project = db.relationship("Project")
