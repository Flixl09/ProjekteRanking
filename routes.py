from flask import Blueprint, jsonify
from models import db, User, Project, Vote

routes = Blueprint('routes', __name__)

@routes.route('/api/projects')
def get_projects():
    projects = Project.query.all()
    return jsonify([{
        'projectid': project.projectid,
        "votes": project.votes,
        'title': project.title,
        'imageurl': project.imageurl or None,
        'description': project.description,
        'projecturl': project.projecturl or None,
        'upvotes': project.upvotes,
        'downvotes': project.downvotes,
        'mehvotes': project.mehvotes,
        'score': str(project.score) if project.score is not None else None,
        'createdat': project.createdat.isoformat() if project.createdat else None,
        'authorized': project.authorized,
        'color': project.color or None,
        'shortdesc': project.shortdesc or None,
        'leader': {
            'id': project.leader_user.employeeid,
            'name': project.leader_user.name
        } if project.leader_user else None,
        "favourites": project.favourites
    } for project in projects])

