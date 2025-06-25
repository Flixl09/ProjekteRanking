import datetime
from flask import Blueprint, jsonify, request
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

@routes.route('/api/votes', methods=['POST'])
def add_vote():
    data = request.get_json()

    employeeid = data.get('employeeid')
    projectid = data.get('projectid')
    votetype = data.get('votetype')

    if not employeeid or not projectid or votetype is None:
        return jsonify({'error': 'employeeid and projectid and votetype required'}), 400

    user = User.query.get(employeeid)
    project = Project.query.get(projectid)

    if not user:
        return jsonify({'error': 'User not found'}), 404
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    if votetype not in [1, -1, 0]:
        return jsonify({'error': 'Invalid votetype'}), 400

    existing_vote = Vote.query.get((employeeid, projectid))
    if existing_vote and existing_vote.votetype == votetype:
        return jsonify({'error': 'Vote already exists'}), 409
    elif existing_vote and existing_vote.votetype != votetype:
        # Update existing vote
        existing_vote.votetype = votetype
        db.session.commit()
        return jsonify({'message': 'Vote updated'}), 200

    new_vote = Vote(
        employeeid=employeeid,
        projectid=projectid,
        votetype=votetype,
    )

    db.session.add(new_vote)
    db.session.commit()

    return jsonify({'message': 'Vote recorded'}), 201

@routes.route('/api/projects/unvoted/<int:employeeid>', methods=['GET'])
def get_unvoted_projects(employeeid):
    subquery = db.session.query(Vote.projectid).filter_by(employeeid=employeeid)
    
    unvoted_projects = Project.query.filter(~Project.projectid.in_(subquery)).all()
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
    } for project in unvoted_projects])